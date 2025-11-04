// MeetingPrep AI - All Briefs Viewer Script

const API_BASE = 'https://meetingprep-ai-vercel.vercel.app';

class AllBriefsViewer {
  constructor() {
    this.meetings = [];
    this.user = null;
    this.init();
  }

  async init() {
    try {
      // Check if user is authenticated
      const authData = await chrome.storage.local.get(['authToken', 'user']);
      
      if (!authData.authToken || !authData.user) {
        this.showError('Please sign in to view your briefs');
        return;
      }
      
      this.user = authData.user;
      
      // Load briefs from API
      await this.loadBriefs();
    } catch (error) {
      console.error('Error initializing:', error);
      this.showError('Failed to load briefs');
    }
  }

  async loadBriefs() {
    try {
      document.getElementById('loading').style.display = 'block';
      document.getElementById('error').style.display = 'none';
      document.getElementById('briefs-container').style.display = 'none';
      document.getElementById('empty-state').style.display = 'none';

      // Fetch meetings from API
      const authToken = await this.getAuthToken();
      const response = await fetch(`${API_BASE}/api/extension/get-meetings?userId=${encodeURIComponent(this.user.id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (!response.ok) {
        // If API endpoint doesn't exist, try fetching from storage as fallback
        console.log('API endpoint not available, using storage fallback');
        await this.loadBriefsFromStorage();
        return;
      }

      const data = await response.json();
      
      if (data.success && data.meetings && data.meetings.length > 0) {
        this.meetings = data.meetings;
        this.displayBriefs();
      } else {
        this.showEmptyState();
      }
    } catch (error) {
      console.error('Error loading briefs:', error);
      // Try storage fallback
      await this.loadBriefsFromStorage();
    } finally {
      document.getElementById('loading').style.display = 'none';
    }
  }

  async loadBriefsFromStorage() {
    // Fallback: get briefs from chrome storage
    const storage = await chrome.storage.local.get(null);
    const briefs = [];
    
    for (const key in storage) {
      if (key.startsWith('brief_') || key === 'latestBrief') {
        const briefData = storage[key];
        if (briefData && briefData.meeting) {
          briefs.push({
            meeting: briefData.meeting,
            brief: briefData.brief,
            generated_at: briefData.generated_at
          });
        }
      }
    }
    
    if (briefs.length > 0) {
      this.meetings = briefs;
      this.displayBriefs();
    } else {
      this.showEmptyState();
    }
  }

  async getAuthToken() {
    const authData = await chrome.storage.local.get(['authToken']);
    return authData.authToken || '';
  }

  displayBriefs() {
    const grid = document.getElementById('briefs-grid');
    grid.innerHTML = '';

    this.meetings.forEach((item, index) => {
      const meeting = item.meeting || item;
      const brief = item.brief || item.content;
      const card = this.createBriefCard(meeting, brief, index);
      grid.appendChild(card);
    });

    document.getElementById('briefs-container').style.display = 'block';
  }

  createBriefCard(meeting, brief, index) {
    const card = document.createElement('div');
    card.className = 'brief-card';
    
    const meetingDate = meeting.date ? new Date(meeting.date) : new Date();
    const isUpcoming = meetingDate >= new Date();
    const status = isUpcoming ? 'upcoming' : 'completed';
    
    const attendees = Array.isArray(meeting.attendees) 
      ? meeting.attendees.join(', ') 
      : meeting.attendees || 'No attendees';
    
    // Handle brief - it can be an object with content property or a string
    let briefText = '';
    if (brief) {
      briefText = typeof brief === 'string' ? brief : (brief.content || '');
    }
    
    const briefPreview = briefText 
      ? briefText.substring(0, 150).replace(/\n/g, ' ') + '...'
      : 'No brief content available';

    const meetingTitle = meeting.title || 'Untitled Meeting';
    const meetingId = meeting.id || null;

    card.innerHTML = `
      ${meetingId ? `<button class="delete-btn" data-meeting-id="${meetingId}" title="Delete brief">Delete</button>` : ''}
      <div class="brief-card-header">
        <div class="brief-title">${meetingTitle}</div>
        <span class="brief-status ${status}">${status}</span>
      </div>
      <div class="brief-meta">
        📅 ${meetingDate.toLocaleDateString()} 
        ${meeting.time ? `• ⏰ ${meeting.time}` : ''}
      </div>
      ${attendees !== 'No attendees' ? `<div class="brief-meta">👥 ${attendees.substring(0, 60)}${attendees.length > 60 ? '...' : ''}</div>` : ''}
      <div class="brief-preview">${briefPreview}</div>
    `;

    // Handle card click (open brief viewer)
    card.addEventListener('click', (e) => {
      // Don't open if clicking the delete button
      if (!e.target.closest('.delete-btn')) {
        this.openBriefViewer(meeting, brief, index);
      }
    });

    // Handle delete button click (only if meeting has ID)
    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        this.showDeleteModal(meeting, brief, index);
      });
    }

    return card;
  }

  openBriefViewer(meeting, brief, index) {
    // Store brief data for viewer
    // Handle brief - it can be an object with content property or a string
    const briefContent = brief 
      ? (typeof brief === 'string' ? brief : brief.content || '')
      : '';
    
    const briefData = {
      meeting: meeting,
      brief: briefContent,
      generated_at: new Date().toISOString()
    };
    
    chrome.storage.local.set({
      latestBrief: briefData,
      [`brief_${Date.now()}`]: briefData
    });

    // Open brief viewer
    chrome.tabs.create({
      url: chrome.runtime.getURL(`brief-viewer.html?briefId=${Date.now()}`)
    });
  }

  showEmptyState() {
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('briefs-container').style.display = 'none';
  }

  showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.querySelector('p').textContent = message || 'An error occurred';
    errorDiv.style.display = 'block';
    document.getElementById('loading').style.display = 'none';
  }

  showDeleteModal(meeting, brief, index) {
    const modal = document.getElementById('delete-modal');
    const message = document.getElementById('delete-modal-message');
    const meetingTitle = meeting.title || 'Untitled Meeting';
    const meetingId = meeting.id;
    
    if (!meetingId) {
      alert('This brief cannot be deleted as it was not saved to the database.');
      return;
    }
    
    message.textContent = `Are you sure you want to delete "${meetingTitle}"? This action cannot be undone.`;
    modal.classList.add('show');

    // Store meeting data for deletion
    modal.dataset.meetingId = meetingId;
    modal.dataset.meetingIndex = index;
  }

  hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('show');
    delete modal.dataset.meetingId;
    delete modal.dataset.meetingIndex;
  }

  async deleteMeeting(meetingId) {
    try {
      const authToken = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/extension/delete-meeting?meetingId=${encodeURIComponent(meetingId)}&userId=${encodeURIComponent(this.user.id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete meeting');
      }

      // Remove from local array
      this.meetings = this.meetings.filter(item => {
        const m = item.meeting || item;
        return m.id !== meetingId;
      });

      // Refresh display
      if (this.meetings.length === 0) {
        this.showEmptyState();
      } else {
        this.displayBriefs();
      }

      this.hideDeleteModal();
      
      // Show success feedback
      const deleteBtn = document.querySelector(`[data-meeting-id="${meetingId}"]`);
      if (deleteBtn) {
        const originalText = deleteBtn.textContent;
        deleteBtn.textContent = '✓ Deleted';
        deleteBtn.style.background = '#10b981';
        setTimeout(() => {
          // Card will be removed from display, so we don't need to reset
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert(`Failed to delete meeting: ${error.message}`);
    }
  }

  copyAllBriefs() {
    if (this.meetings.length === 0) {
      alert('No briefs to copy');
      return;
    }

    let textToCopy = 'MEETING BRIEFS\n';
    textToCopy += '='.repeat(50) + '\n\n';

    this.meetings.forEach((item, index) => {
      const meeting = item.meeting || item;
      const brief = item.brief || item.content;
      
      // Handle brief - it can be an object with content property or a string
      let briefText = '';
      if (brief) {
        briefText = typeof brief === 'string' ? brief : (brief.content || '');
      }

      const meetingDate = meeting.date ? new Date(meeting.date) : new Date();
      const status = meetingDate >= new Date() ? 'Upcoming' : 'Completed';
      
      textToCopy += `BRIEF ${index + 1}: ${meeting.title || 'Untitled Meeting'}\n`;
      textToCopy += `Status: ${status}\n`;
      textToCopy += `Date: ${meetingDate.toLocaleDateString()}${meeting.time ? ` | Time: ${meeting.time}` : ''}\n`;
      
      if (meeting.attendees) {
        const attendees = Array.isArray(meeting.attendees) 
          ? meeting.attendees.join(', ') 
          : meeting.attendees;
        textToCopy += `Attendees: ${attendees}\n`;
      }
      
      textToCopy += '\n';
      if (briefText) {
        textToCopy += briefText + '\n';
      } else {
        textToCopy += 'No brief content available\n';
      }
      textToCopy += '\n' + '='.repeat(50) + '\n\n';
    });

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Show feedback
      const copyBtn = document.getElementById('copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      copyBtn.style.background = 'rgba(34, 197, 94, 0.3)';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy briefs:', err);
      alert('Failed to copy briefs to clipboard');
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const viewer = new AllBriefsViewer();
  
  document.getElementById('print-btn')?.addEventListener('click', () => {
    window.print();
  });
  
  document.getElementById('copy-btn')?.addEventListener('click', () => {
    viewer.copyAllBriefs();
  });
  
  document.getElementById('back-btn')?.addEventListener('click', () => {
    window.close();
  });

  // Delete modal handlers
  document.getElementById('delete-modal-cancel')?.addEventListener('click', () => {
    viewer.hideDeleteModal();
  });

  document.getElementById('delete-modal-confirm')?.addEventListener('click', () => {
    const modal = document.getElementById('delete-modal');
    const meetingId = modal.dataset.meetingId;
    if (meetingId) {
      viewer.deleteMeeting(meetingId);
    }
  });

  // Close modal when clicking outside
  document.getElementById('delete-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'delete-modal') {
      viewer.hideDeleteModal();
    }
  });
});

