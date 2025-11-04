// MeetingPrep AI - Brief Viewer Script

const API_BASE = 'https://meetingprep-ai-vercel.vercel.app';

class BriefViewer {
  constructor() {
    this.briefData = null;
    this.init();
  }

  async init() {
    try {
      // Get brief data from URL parameters or storage
      await this.loadBriefData();
      
      if (this.briefData) {
        this.displayBrief();
      } else {
        this.showError('No brief data found');
      }
    } catch (error) {
      console.error('Error initializing brief viewer:', error);
      this.showError('Failed to load brief');
    }
  }

  async loadBriefData() {
    // Try to get data from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const briefId = urlParams.get('briefId');
    
    if (briefId) {
      // Load from storage using briefId
      const result = await chrome.storage.local.get([`brief_${briefId}`]);
      this.briefData = result[`brief_${briefId}`];
    } else {
      // Fallback: get the latest brief from storage
      const result = await chrome.storage.local.get(['latestBrief']);
      this.briefData = result.latestBrief;
    }
  }

  displayBrief() {
    const { meeting, brief, generated_at } = this.briefData;
    
    // Update meeting metadata
    document.getElementById('meeting-title').textContent = meeting.title || 'Untitled Meeting';
    document.getElementById('meeting-date').textContent = meeting.date || 'Date not specified';
    document.getElementById('meeting-time').textContent = meeting.time || 'Time not specified';
    
    // Format attendees
    let attendeesText = 'No attendees listed';
    if (meeting.attendees && meeting.attendees.length > 0) {
      if (Array.isArray(meeting.attendees)) {
        attendeesText = meeting.attendees.join(', ');
      } else {
        attendeesText = meeting.attendees;
      }
    }
    document.getElementById('meeting-attendees').textContent = attendeesText;
    
    // Convert markdown-like brief to HTML
    const briefHtml = this.convertBriefToHtml(brief);
    document.getElementById('brief-content').innerHTML = briefHtml;
    
    // Set generation time
    const generationTime = generated_at ? new Date(generated_at).toLocaleString() : 'Unknown';
    document.getElementById('generation-time').textContent = generationTime;
    
    // Show the brief and hide loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('brief-container').style.display = 'block';
  }

  convertBriefToHtml(brief) {
    if (!brief) return '<p>No brief content available</p>';
    
    // Convert markdown-like formatting to HTML
    let html = brief
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2><span class="section-icon">📋</span>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      
      // Line breaks
      .replace(/\n/g, '<br>');
    
    // Wrap consecutive <li> elements in <ul>
    html = html.replace(/(<li>.*?<\/li>)(<br>)*(?=<li>|$)/gs, (match, li) => {
      return li;
    });
    
    // Group list items
    html = html.replace(/(<li>.*?<\/li>(<br>)*)+/gs, (match) => {
      const items = match.replace(/<br>/g, '');
      return `<ul>${items}</ul>`;
    });
    
    // Add section icons for common sections
    html = html
      .replace(/<h2><span class="section-icon">📋<\/span>Meeting Details<\/h2>/g, 
               '<h2><span class="section-icon">📋</span>Meeting Details</h2>')
      .replace(/<h2><span class="section-icon">📋<\/span>Key Talking Points<\/h2>/g, 
               '<h2><span class="section-icon">💡</span>Key Talking Points</h2>')
      .replace(/<h2><span class="section-icon">📋<\/span>Research Notes<\/h2>/g, 
               '<h2><span class="section-icon">🔍</span>Research Notes</h2>')
      .replace(/<h2><span class="section-icon">📋<\/span>AI-Generated Insights<\/h2>/g, 
               '<h2><span class="section-icon">🤖</span>AI-Generated Insights</h2>');
    
    return html;
  }

  showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.querySelector('#error p').textContent = message;
  }
}

// Global functions for buttons
function copyBrief() {
  const briefContent = document.getElementById('brief-content');
  const meetingTitle = document.getElementById('meeting-title').textContent;
  
  // Create plain text version
  const plainText = `${meetingTitle}\n\n${briefContent.innerText}`;
  
  navigator.clipboard.writeText(plainText).then(() => {
    // Show success feedback
    const btn = document.getElementById('copy-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy brief:', err);
    alert('Failed to copy brief to clipboard');
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BriefViewer();
  
  // Set up button event listeners
  document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
  });
  
  document.getElementById('copy-btn').addEventListener('click', copyBrief);
  
  document.getElementById('back-btn').addEventListener('click', () => {
    window.close();
  });
  
  document.getElementById('view-all-btn').addEventListener('click', () => {
    // Open extension page instead of web dashboard
    chrome.tabs.create({
      url: chrome.runtime.getURL('all-briefs.html')
    });
  });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'displayBrief') {
    const viewer = new BriefViewer();
    viewer.briefData = request.data;
    viewer.displayBrief();
    sendResponse({ success: true });
  }
});
