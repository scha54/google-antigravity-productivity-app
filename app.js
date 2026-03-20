const MODES = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

let currentMode = 'pomodoro';
let timeLeft = MODES[currentMode];
let timerInterval = null;
let isRunning = false;

// DOM Elements
const timeDisplay = document.getElementById('time-display');
const modeButtons = document.querySelectorAll('.mode-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const bgOverlay = document.getElementById('bg-overlay');

// Initialize Display
updateDisplay();

// Mode Selection Event Listeners
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Automatically pause the timer if mode is swapped
        if (isRunning) {
            pauseTimer();
        }
        
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentMode = btn.dataset.mode;
        timeLeft = MODES[currentMode];
        updateDisplay();
        
        // Update background
        bgOverlay.style.background = `var(--bg-${currentMode})`;
        
        // Update primary button color based on mode
        updatePrimaryColor();
    });
});

function updatePrimaryColor() {
    let color;
    let hoverColor;
    switch(currentMode) {
        case 'pomodoro': 
            color = '#ffccd5'; 
            hoverColor = '#ffb3c1';
            break;
        case 'shortBreak': 
            color = '#bde0fe'; 
            hoverColor = '#a2d2ff';
            break;
        case 'longBreak': 
            color = '#cdb4db'; 
            hoverColor = '#bca0cd';
            break;
    }
    document.documentElement.style.setProperty('--btn-primary-bg', color);
    document.documentElement.style.setProperty('--btn-primary-hover', hoverColor);
}

// Timer Controls
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    timeDisplay.classList.remove('pulse'); // Remove pulse if resumed
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    startBtn.textContent = "Resume";
}

function resetTimer() {
    pauseTimer();
    timeLeft = MODES[currentMode];
    updateDisplay();
    startBtn.textContent = "Start";
    startBtn.style.display = 'inline-block';
    // Ensure pause button handles state nicely
    pauseBtn.style.display = 'none'; 
    timeDisplay.classList.remove('pulse');
}

function completeTimer() {
    pauseTimer();
    // Start pulsing the timer when completed
    timeDisplay.classList.add('pulse');
    resetBtn.textContent = "New Session";
    
    // Play a short browser beep/sound if we wanted, or simply rely on visual cues
    setTimeout(() => {
        resetBtn.textContent = "Reset";
    }, 5000);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update Page Title
    const formattedMode = currentMode.charAt(0).toUpperCase() + currentMode.slice(1).replace(/([A-Z])/g, ' $1').trim();
    document.title = `${timeDisplay.textContent} - ${formattedMode} - Calm Pomodoro`;
}
