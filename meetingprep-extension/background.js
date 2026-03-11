// MeetingPrep AI Chrome Extension - Background Service Worker

class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    console.log('MeetingPrep AI: Background service started');

    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true;
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      this.handleAlarm(alarm);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    chrome.notifications.onClicked.addListener(() => {
      chrome.tabs.create({ url: 'https://calendar.google.com' });
    });
  }

  handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('MeetingPrep AI: Extension installed');

      chrome.tabs.create({
        url: 'https://meetingprep-ai-vercel.vercel.app/welcome'
      });

      chrome.storage.local.set({
        settings: {
          autoDetect: true,
          showButtons: true,
          notifications: true
        },
        installedAt: Date.now()
      });

      chrome.notifications.create('welcome', {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'MeetingPrep AI is ready!',
        message: 'Open Google Calendar, click any meeting, then click the MeetingPrep icon to generate your first AI brief.',
        priority: 2
      });

      chrome.alarms.create('reminder-1h', { delayInMinutes: 60 });
      chrome.alarms.create('reminder-24h', { delayInMinutes: 1440 });

    } else if (details.reason === 'update') {
      console.log('MeetingPrep AI: Extension updated to', chrome.runtime.getManifest().version);
    }
  }

  async handleAlarm(alarm) {
    const { briefsGenerated } = await chrome.storage.local.get(['briefsGenerated']);
    if (briefsGenerated && briefsGenerated > 0) return;

    if (alarm.name === 'reminder-1h') {
      chrome.notifications.create('reminder-1h', {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Try MeetingPrep AI',
        message: 'You have 10 free AI briefs waiting. Open Google Calendar and click the MeetingPrep icon to try it.',
        priority: 1
      });
    }

    if (alarm.name === 'reminder-24h') {
      chrome.notifications.create('reminder-24h', {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Got a meeting coming up?',
        message: 'MeetingPrep AI can generate a brief in 30 seconds. Click here to open Google Calendar.',
        priority: 1
      });
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'saveSettings':
          await chrome.storage.local.set({ settings: request.settings });
          sendResponse({ success: true });
          break;

        case 'getSettings':
          const result = await chrome.storage.local.get(['settings']);
          sendResponse({ settings: result.settings || { autoDetect: true, showButtons: true, notifications: true } });
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background service error:', error);
      sendResponse({ error: error.message });
    }
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' &&
        tab.url &&
        tab.url.includes('calendar.google.com')) {
      chrome.tabs.sendMessage(tabId, { action: 'ping' }, () => {
        if (chrome.runtime.lastError) {
          console.log('Content script not responding on tab', tabId);
        }
      });
    }
  }
}

new BackgroundService();
