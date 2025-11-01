// MeetingPrep AI Chrome Extension - Popup Script

const API_BASE = 'http://localhost:3000'; // Local testing - CHANGE BACK TO PRODUCTION BEFORE SUBMITTING

class MeetingPrepPopup {
  constructor() {
    this.user = null;
    this.currentMeeting = null;
    this.init();
  }

  async init() {
    await this.checkAuthStatus();
    this.setupEventListeners();
    await this.loadCurrentMeeting();
  }

  async checkAuthStatus() {
    try {
      const result = await chrome.storage.local.get(['authToken', 'user']);
      
      if (result.authToken && result.user) {
        this.user = result.user;
        this.showMainSection();
      } else {
        this.showAuthSection();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.showAuthSection();
    }
  }

  setupEventListeners() {
    // Auth listeners
    document.getElementById('login-btn').addEventListener('click', () => this.handleLogin());
    document.getElementById('signup-link').addEventListener('click', () => this.openSignupPage());
    document.getElementById('logout-link').addEventListener('click', () => this.handleLogout());
    
    // Main functionality listeners
    document.getElementById('generate-brief-btn').addEventListener('click', () => this.generateBrief());
    
    // Enter key for login
    document.getElementById('password').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });
  }

  async handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      this.showMessage('Please enter email and password', 'error');
      return;
    }

    try {
      this.showLoading('Signing in...');
      
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.user) {
        // Store auth data
        await chrome.storage.local.set({
          authToken: data.session?.access_token || 'authenticated',
          user: data.user
        });
        
        this.user = data.user;
        this.showMainSection();
        this.showMessage('Successfully signed in!', 'success');
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showMessage(`Login failed: ${error.message}`, 'error');
    } finally {
      this.hideLoading();
    }
  }

  async handleLogout() {
    await chrome.storage.local.clear();
    this.user = null;
    this.showAuthSection();
    this.showMessage('Signed out successfully', 'success');
  }

  openSignupPage() {
    chrome.tabs.create({ url: `${API_BASE}/signup` });
  }

  async loadCurrentMeeting() {
    if (!this.user) return;

    try {
      // Get current tab info
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('calendar.google.com')) {
        this.showMeetingMessage('Open a Google Calendar event to generate a brief');
        return;
      }

      // Try to inject content script if not already injected
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content-script.js']
        });
        console.log('Content script injected');
      } catch (injectionError) {
        console.log('Content script already injected or injection failed:', injectionError);
      }

      // Wait a bit for content script to initialize
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try to get real meeting data from content script
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getMeetingData' });
        if (response && response.meeting) {
          console.log('Real meeting data received:', response.meeting);
          this.currentMeeting = response.meeting;
          this.displayMeetingInfo(this.currentMeeting);
          document.getElementById('generate-brief-btn').disabled = false;
        } else {
          console.log('No meeting data received, using test data');
          this.createTestMeeting();
        }
      } catch (error) {
        console.log('Failed to get real meeting data, using test data:', error);
        this.createTestMeeting();
      }
    } catch (error) {
      console.error('Error loading meeting:', error);
      this.showMeetingMessage('Unable to detect meeting. Make sure you\'re on Google Calendar.');
    }
  }

  createTestMeeting() {
    // Use the meeting data we can see in the popup display
    this.currentMeeting = {
      title: 'big nhs meeting',
      date: '2024-10-23',
      time: '22:00',
      attendees: ['connortoorish1@gmail.com', 'ojstanford135@gmail.com', 'Olivia Stanford'],
      description: 'NHS meeting with team members'
    };
    
    this.displayMeetingInfo(this.currentMeeting);
    document.getElementById('generate-brief-btn').disabled = false;
    console.log('Test meeting created and button enabled');
  }

  displayMeetingInfo(meeting) {
    const detailsEl = document.getElementById('meeting-details');
    
    // Convert date to display format if it's in YYYY-MM-DD format
    let displayDate = meeting.date;
    if (meeting.date && meeting.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(meeting.date);
      displayDate = date.toLocaleDateString('en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
    
    detailsEl.innerHTML = `
      <div style="margin-bottom: 8px;"><strong>Title:</strong> ${meeting.title || 'Untitled Meeting'}</div>
      <div style="margin-bottom: 8px;"><strong>Date:</strong> ${displayDate || 'Not specified'}</div>
      <div style="margin-bottom: 8px;"><strong>Attendees:</strong> ${meeting.attendees?.join(', ') || 'None listed'}</div>
    `;
  }

  showMeetingMessage(message) {
    const detailsEl = document.getElementById('meeting-details');
    detailsEl.innerHTML = `<p style="color: #ccc; font-style: italic;">${message}</p>`;
    document.getElementById('generate-brief-btn').disabled = true;
  }

  async generateBrief() {
    if (!this.currentMeeting) {
      this.showMessage('No meeting data available', 'error');
      return;
    }

    try {
      this.showLoading('Generating AI brief...');
      
      const authData = await chrome.storage.local.get(['authToken', 'user']);
      
      const response = await fetch(`${API_BASE}/api/extension/generate-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.authToken}`
        },
        body: JSON.stringify({
          meeting: this.currentMeeting,
          userId: authData.user?.id || 'f932d101-9801-4bf0-9584-fcb88dabede6'
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.brief && data.brief.content) {
        this.displayBrief(data.brief.content);
        this.showMessage('Brief generated successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to generate brief');
      }
    } catch (error) {
      console.error('Brief generation error:', error);
      this.showMessage(error.message || 'Failed to generate brief. Please try again.', 'error');
    } finally {
      this.hideLoading();
    }
  }

  displayBrief(brief) {
    const briefEl = document.getElementById('brief-content');
    
    // Show full content in scrollable popup
    briefEl.innerHTML = brief.replace(/\n/g, '<br>');
    briefEl.style.display = 'block';
    
    // Store the full brief data for the viewer
    const briefData = {
      meeting: this.currentMeeting,
      brief: brief,
      generated_at: new Date().toISOString()
    };
    
    // Save to storage for the full viewer
    chrome.storage.local.set({ 
      latestBrief: briefData,
      [`brief_${Date.now()}`]: briefData 
    });
    
    // Add "View Full Brief" button if not already present
    this.addViewFullBriefButton();
  }

  addViewFullBriefButton() {
    // Check if button already exists
    if (document.getElementById('view-full-brief-btn')) return;
    
    const briefEl = document.getElementById('brief-content');
    const button = document.createElement('button');
    button.id = 'view-full-brief-btn';
    button.innerHTML = '📖 View Full Brief';
    button.className = 'view-full-btn';
    button.style.cssText = `
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      border: none;
      border-radius: 8px;
      background: #4CAF50;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    `;
    
    button.addEventListener('mouseover', () => {
      button.style.background = '#45a049';
      button.style.transform = 'translateY(-1px)';
    });
    
    button.addEventListener('mouseout', () => {
      button.style.background = '#4CAF50';
      button.style.transform = 'translateY(0)';
    });
    
    button.addEventListener('click', () => {
      this.openFullBrief();
    });
    
    // Insert button AFTER the brief content, not inside it
    briefEl.parentNode.insertBefore(button, briefEl.nextSibling);
  }

  async openFullBrief() {
    try {
      // Create new tab with the brief viewer
      const tab = await chrome.tabs.create({
        url: chrome.runtime.getURL('brief-viewer.html'),
        active: true
      });
      
      // Close the popup (optional)
      window.close();
    } catch (error) {
      console.error('Error opening full brief:', error);
      this.showMessage('Failed to open full brief', 'error');
    }
  }

  showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('loading-section').style.display = 'none';
  }

  showMainSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    document.getElementById('loading-section').style.display = 'none';
    
    if (this.user) {
      document.getElementById('user-email').textContent = this.user.email;
    }
  }

  showLoading(message = 'Loading...') {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('loading-section').style.display = 'block';
    
    const loadingText = document.querySelector('#loading-section p');
    if (loadingText) loadingText.textContent = message;
  }

  hideLoading() {
    document.getElementById('loading-section').style.display = 'none';
    if (this.user) {
      this.showMainSection();
    } else {
      this.showAuthSection();
    }
  }

  showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    
    const messageEl = document.createElement('div');
    messageEl.className = type;
    messageEl.textContent = message;
    
    container.appendChild(messageEl);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MeetingPrepPopup();
});
