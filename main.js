// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggleBtn.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('zen-theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('zen-theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'light') {
    themeIcon.classList.remove('ph-moon');
    themeIcon.classList.add('ph-sun');
  } else {
    themeIcon.classList.remove('ph-sun');
    themeIcon.classList.add('ph-moon');
  }
}

// Tab Switching Logic
const menuItems = document.querySelectorAll('.menu-item[data-target]');
const tabContents = document.querySelectorAll('.tab-content');

menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active class from all items and tabs
    menuItems.forEach(mi => mi.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));
    
    // Add active class to clicked item and target tab
    item.classList.add('active');
    const targetId = item.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.classList.add('active');
      
      // Reset scroll position to top when switching tabs
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }
  });
});

// Timer Logic
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

const displays = [document.getElementById('timer-display'), document.getElementById('main-timer-display')];
const startBtns = [document.getElementById('start-btn'), document.getElementById('main-start-btn')];
const pauseBtns = [document.getElementById('pause-btn'), document.getElementById('main-pause-btn')];
const resetBtns = [document.getElementById('reset-btn'), document.getElementById('main-reset-btn')];
const timerMessages = [document.getElementById('timer-message'), document.getElementById('main-timer-message')];

function updateDisplays() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  displays.forEach(d => { if(d) d.textContent = timeString; });
}

function updateBtnStates(startOpacity, startPointer, pauseOpacity, pausePointer, msg, color) {
  startBtns.forEach(btn => { if(btn) { btn.style.opacity = startOpacity; btn.style.pointerEvents = startPointer; } });
  pauseBtns.forEach(btn => { if(btn) { btn.style.opacity = pauseOpacity; btn.style.pointerEvents = pausePointer; } });
  timerMessages.forEach(m => { if(m) { m.textContent = msg; m.style.color = color; } });
}

startBtns.forEach(startBtn => {
  if (startBtn) startBtn.addEventListener('click', () => {
    if (!isRunning) {
      isRunning = true;
      updateBtnStates('0.5', 'none', '1', 'auto', 'Focus mode active. Stay off distractions!', 'var(--accent-secondary)');
      
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplays();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          updateBtnStates('1', 'auto', '1', 'auto', 'Session complete! Take a 5-minute break.', 'var(--success)');
        }
      }, 1000);
    }
  });
});

pauseBtns.forEach(pauseBtn => {
  if (pauseBtn) pauseBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      updateBtnStates('1', 'auto', '0.5', 'none', 'Session paused.', 'var(--text-secondary)');
    }
  });
});

resetBtns.forEach(resetBtn => {
  if (resetBtn) resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplays();
    updateBtnStates('1', 'auto', '1', 'auto', 'Ready to focus? Distracting apps will be blocked.', 'var(--text-secondary)');
  });
});

// Initialize Timer Display
updateDisplays();

// App Toggle Logic (Mock)
const toggles = document.querySelectorAll('.toggle-switch');
toggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    
    const prevSibling = toggle.previousElementSibling;
    if (prevSibling) {
      const statusText = prevSibling.querySelector('.app-time');
      if (statusText && (statusText.textContent.includes('Block') || statusText.textContent.includes('Allowed'))) {
        if (toggle.classList.contains('active')) {
          statusText.textContent = 'Blocked';
          statusText.style.color = 'var(--danger)';
        } else {
          statusText.textContent = 'Allowed';
          statusText.style.color = 'var(--success)';
        }
      }
    }
  });
});

// Preview Switcher Logic
const previewBtns = document.querySelectorAll('.preview-btn');
const previewWrapper = document.getElementById('preview-wrapper');

previewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    previewBtns.forEach(b => b.classList.remove('active'));
    
    // Add active class to clicked button
    btn.classList.add('active');
    
    // Change layout wrapper class
    const device = btn.getAttribute('data-device');
    previewWrapper.className = `device-preview-wrapper ${device}`;
  });
});

// Modal Logic
const newSessionBtn = document.getElementById('new-session-btn');
const sessionModal = document.getElementById('session-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const startNewSessionBtn = document.getElementById('start-new-session-btn');

function openModal() {
  if(sessionModal) sessionModal.classList.add('active');
}

function closeModal() {
  if(sessionModal) sessionModal.classList.remove('active');
}

if(newSessionBtn) newSessionBtn.addEventListener('click', openModal);
if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if(cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
if(startNewSessionBtn) startNewSessionBtn.addEventListener('click', () => {
  // Add logic to start session here
  closeModal();
});

// Close modal when clicking outside
if(sessionModal) {
  sessionModal.addEventListener('click', (e) => {
    if(e.target === sessionModal) {
      closeModal();
    }
  });
}
