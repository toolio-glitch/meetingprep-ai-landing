// MeetingPrep AI Chrome Extension - Content Script for Google Calendar

// Prevent multiple injections
if (typeof window.MeetingPrepCalendarIntegration !== 'undefined') {
  console.log('MeetingPrep AI: Content script already loaded');
} else {

class CalendarIntegration {
  constructor() {
    this.currentMeeting = null;
    this.init();
  }

  init() {
    console.log('MeetingPrep AI: Calendar integration loaded');
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getMeetingData') {
        const meetingData = this.extractMeetingData();
        sendResponse({ meeting: meetingData });
      }
    });

    // Add MeetingPrep buttons to calendar events
    this.addMeetingPrepButtons();
    
    // Watch for calendar changes (new events loaded, navigation)
    this.observeCalendarChanges();
  }

  extractMeetingData() {
    try {
      // Try to extract from event details popup/sidebar
      const eventPopup = this.findEventPopup();
      if (eventPopup) {
        return this.extractFromEventPopup(eventPopup);
      }

      // Try to extract from selected event in calendar view
      const selectedEvent = this.findSelectedEvent();
      if (selectedEvent) {
        return this.extractFromSelectedEvent(selectedEvent);
      }

      return null;
    } catch (error) {
      console.error('Error extracting meeting data:', error);
      return null;
    }
  }

  findEventPopup() {
    // Google Calendar event popup selectors (these may change)
    const selectors = [
      '[role="dialog"]', // Most common for popups
      '[data-eventid]',
      '.ep', // Event popup class
      '[jsname="CnSW2d"]', // Another possible selector
      'div[style*="position: absolute"]' // Popup positioning
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        if (element && this.isEventPopup(element)) {
          console.log('Found event popup with selector:', selector);
          return element;
        }
      }
    }

    // Fallback: look for any visible popup with meeting-like content
    const allDialogs = document.querySelectorAll('[role="dialog"], .popup, [data-popup]');
    for (const dialog of allDialogs) {
      if (this.isEventPopup(dialog)) {
        console.log('Found event popup via fallback');
        return dialog;
      }
    }

    console.log('No event popup found');
    return null;
  }

  isEventPopup(element) {
    // Check if element contains typical event popup content
    const text = element.textContent.toLowerCase();
    
    // Look for meeting-specific indicators
    const meetingIndicators = [
      'join with google meet',
      'guests',
      'organiser',
      'organizer', 
      'going?',
      'yes, no, maybe',
      'invite via link',
      'thursday', 'friday', 'monday', 'tuesday', 'wednesday', 'saturday', 'sunday', // Days
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' // Months
    ];
    
    const hasIndicator = meetingIndicators.some(indicator => text.includes(indicator));
    const hasEmail = element.querySelector('[data-email]') !== null;
    const hasTimePattern = /\d{1,2}:\d{2}/.test(text);
    
    console.log('Checking if event popup:', {
      text: text.substring(0, 100) + '...',
      hasIndicator,
      hasEmail,
      hasTimePattern
    });
    
    return hasIndicator || hasEmail || hasTimePattern;
  }

  findSelectedEvent() {
    // Look for selected/highlighted events in calendar view
    const selectors = [
      '.Jmftzc', // Selected event class
      '[data-eventid].selected',
      '.calendar-event.selected'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  }

  extractFromEventPopup(popup) {
    const meeting = {
      title: '',
      date: '',
      time: '',
      attendees: [],
      description: '',
      location: ''
    };

    try {
      console.log('Extracting from popup:', popup);
      
      // Extract title - try multiple approaches
      const titleSelectors = [
        'h2', // Main title in popup
        'h1',
        '[role="heading"]',
        '.event-title',
        '[data-test-id="event-title"]'
      ];
      
      for (const selector of titleSelectors) {
        const titleEl = popup.querySelector(selector);
        if (titleEl && titleEl.textContent.trim()) {
          meeting.title = titleEl.textContent.trim();
          console.log('Found title:', meeting.title);
          break;
        }
      }

      // Extract date/time - look for text patterns
      const allText = popup.textContent;
      const dateMatch = allText.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
      if (dateMatch) {
        meeting.date = dateMatch[0];
        console.log('Found date:', meeting.date);
      }

      const timeMatch = allText.match(/(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)\s*[-–]\s*(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/i);
      if (timeMatch) {
        meeting.time = timeMatch[0];
        console.log('Found time:', meeting.time);
      }

      // Extract attendees - look for names and emails
      const attendeeElements = popup.querySelectorAll('[title*="@"], [data-email]');
      attendeeElements.forEach(el => {
        const title = el.getAttribute('title') || '';
        const email = el.getAttribute('data-email') || '';
        const text = el.textContent.trim();
        
        if (title.includes('@')) {
          meeting.attendees.push(title);
        } else if (email.includes('@')) {
          meeting.attendees.push(email);
        } else if (text && text.length > 2 && !text.includes('guests')) {
          meeting.attendees.push(text);
        }
      });

      // Also look for attendee names in text
      const guestMatch = allText.match(/(\d+)\s+guests?/i);
      if (guestMatch) {
        console.log('Found guests info:', guestMatch[0]);
      }

      // Look for specific names (like "Olivia Stanford")
      const nameMatches = allText.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/g);
      if (nameMatches) {
        nameMatches.forEach(name => {
          if (name !== 'Connor Toorish' && name !== 'Google Meet' && !meeting.attendees.includes(name)) {
            meeting.attendees.push(name);
          }
        });
      }

      console.log('Extracted meeting data:', meeting);

    } catch (error) {
      console.error('Error parsing event popup:', error);
    }

    return meeting;
  }

  extractFromSelectedEvent(event) {
    const meeting = {
      title: '',
      date: '',
      time: '',
      attendees: [],
      description: '',
      location: ''
    };

    try {
      // Extract title from event element
      const titleEl = event.querySelector('.event-title, .title') || event;
      meeting.title = titleEl.textContent.trim();

      // Try to get more details by clicking the event (if not already open)
      // This is more complex and might trigger popups

    } catch (error) {
      console.error('Error parsing selected event:', error);
    }

    return meeting;
  }

  parseDateFromText(text) {
    // Parse date from various formats
    const dateRegex = /(\w+,?\s+)?(\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
    const match = text.match(dateRegex);
    return match ? match[0] : '';
  }

  parseTimeFromText(text) {
    // Parse time from various formats
    const timeRegex = /(\d{1,2}:\d{2}\s*(AM|PM|am|pm)?)/gi;
    const matches = text.match(timeRegex);
    return matches ? matches.join(' - ') : '';
  }

  addMeetingPrepButtons() {
    // Add buttons to calendar events for quick access
    // This is more complex and depends on Google Calendar's structure
    
    const events = document.querySelectorAll('[data-eventid], .calendar-event');
    events.forEach(event => {
      if (!event.querySelector('.meetingprep-btn')) {
        this.addButtonToEvent(event);
      }
    });
  }

  addButtonToEvent(eventElement) {
    const button = document.createElement('button');
    button.className = 'meetingprep-btn';
    button.innerHTML = '📋';
    button.title = 'Generate Meeting Brief';
    button.style.cssText = `
      position: absolute;
      top: 2px;
      right: 2px;
      width: 20px;
      height: 20px;
      border: none;
      background: rgba(66, 133, 244, 0.9);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 10px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleQuickBrief(eventElement);
    });

    // Position relative to event
    if (eventElement.style.position !== 'relative') {
      eventElement.style.position = 'relative';
    }
    
    eventElement.appendChild(button);
  }

  handleQuickBrief(eventElement) {
    // Quick brief generation without opening popup
    console.log('Quick brief requested for event:', eventElement);
    
    // Could show a tooltip or mini-popup with brief
    // For now, just open the extension popup
    chrome.runtime.sendMessage({ action: 'openPopup' });
  }

  observeCalendarChanges() {
    // Watch for DOM changes to add buttons to new events
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && (
              node.hasAttribute('data-eventid') ||
              node.classList?.contains('calendar-event')
            )) {
              shouldUpdate = true;
            }
          });
        }
      });

      if (shouldUpdate) {
        setTimeout(() => this.addMeetingPrepButtons(), 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.MeetingPrepCalendarIntegration = new CalendarIntegration();
  });
} else {
  window.MeetingPrepCalendarIntegration = new CalendarIntegration();
}

} // End of injection prevention block
