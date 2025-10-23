// MeetingPrep AI Chrome Extension - Background Service Worker

class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    console.log('MeetingPrep AI: Background service started');
    
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Handle extension icon click
    chrome.action.onClicked.addListener((tab) => {
      this.handleIconClick(tab);
    });

    // Monitor tab updates to inject content scripts
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });
  }

  handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('MeetingPrep AI: Extension installed');
      
      // Open welcome page
      chrome.tabs.create({
        url: 'http://localhost:3001/signup?source=extension'
      });
      
      // Set default settings
      chrome.storage.local.set({
        settings: {
          autoDetect: true,
          showButtons: true,
          notifications: true
        }
      });
    } else if (details.reason === 'update') {
      console.log('MeetingPrep AI: Extension updated');
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'openPopup':
          await this.openPopup();
          sendResponse({ success: true });
          break;
          
        case 'generateBrief':
          const brief = await this.generateBrief(request.meetingData);
          sendResponse({ brief });
          break;
          
        case 'saveSettings':
          await this.saveSettings(request.settings);
          sendResponse({ success: true });
          break;
          
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ settings });
          break;
          
        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background service error:', error);
      sendResponse({ error: error.message });
    }
  }

  handleIconClick(tab) {
    // Extension icon was clicked - open popup or redirect to calendar
    if (tab.url.includes('calendar.google.com')) {
      // Already on calendar, popup will open automatically
      console.log('On Google Calendar - popup will show meeting options');
    } else {
      // Not on calendar, redirect there
      chrome.tabs.update(tab.id, {
        url: 'https://calendar.google.com'
      });
    }
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    // Inject content script when Google Calendar loads
    if (changeInfo.status === 'complete' && 
        tab.url && 
        tab.url.includes('calendar.google.com')) {
      
      console.log('Google Calendar detected, ensuring content script is loaded');
      
      // Content script should already be injected via manifest
      // But we can send a message to verify it's working
      chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Content script not responding, may need manual injection');
        } else {
          console.log('Content script is active');
        }
      });
    }
  }

  async openPopup() {
    // This is handled automatically by the browser action
    // But we could trigger notifications or other actions here
    console.log('Popup opening requested');
  }

  async generateBrief(meetingData) {
    // This would typically call your backend API
    // For now, return a mock brief
    console.log('Generating brief for:', meetingData);
    
    try {
      const authData = await chrome.storage.local.get(['authToken']);
      
      if (!authData.authToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:3001/api/extension/generate-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.authToken}`
        },
        body: JSON.stringify({ meeting: meetingData })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate brief');
      }

      return data.brief;
    } catch (error) {
      console.error('Brief generation failed:', error);
      throw error;
    }
  }

  async saveSettings(settings) {
    await chrome.storage.local.set({ settings });
    console.log('Settings saved:', settings);
  }

  async getSettings() {
    const result = await chrome.storage.local.get(['settings']);
    return result.settings || {
      autoDetect: true,
      showButtons: true,
      notifications: true
    };
  }

  // Utility method to show notifications
  async showNotification(title, message, type = 'basic') {
    const settings = await this.getSettings();
    
    if (!settings.notifications) return;

    chrome.notifications.create({
      type: type,
      iconUrl: 'icons/icon48.png',
      title: title,
      message: message
    });
  }
}

// Initialize background service
new BackgroundService();
