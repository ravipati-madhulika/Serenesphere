class PomodoroTimer {
    constructor() {
        this.selectedTime = null;
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.isRunning = false;

        this.startScreen = document.getElementById('start-screen');
        this.timerScreen = document.getElementById('timer-screen');
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.balloons = document.querySelectorAll('.balloon');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.balloons.forEach(balloon => {
            balloon.addEventListener('click', () => {
                this.selectBalloon(balloon);
            });
        });

        this.startBtn.addEventListener('click', () => {
            if (!this.selectedTime) {
                alert('Please select a time balloon first!');
                return;
            }
            this.startTimer();
        });

        this.stopBtn.addEventListener('click', () => {
            this.stopTimer();
        });
    }

    selectBalloon(balloon) {
        this.balloons.forEach(b => b.classList.remove('selected'));
        balloon.classList.add('selected');
        this.selectedTime = parseInt(balloon.dataset.minutes);
    }

    startTimer() {
        this.timeRemaining = this.selectedTime * 60;
        this.startScreen.classList.add('hidden');
        this.timerScreen.classList.remove('hidden');

        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                alert("Time's up!");
                this.stopTimer();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.selectedTime = null;
        this.balloons.forEach(b => b.classList.remove('selected'));

        this.timerScreen.classList.add('hidden');
        this.startScreen.classList.remove('hidden');

        document.getElementById('minutes-tens').textContent = '0';
        document.getElementById('minutes-ones').textContent = '0';
        document.getElementById('seconds-tens').textContent = '0';
        document.getElementById('seconds-ones').textContent = '0';
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        document.getElementById('minutes-tens').textContent = Math.floor(minutes / 10);
        document.getElementById('minutes-ones').textContent = minutes % 10;
        document.getElementById('seconds-tens').textContent = Math.floor(seconds / 10);
        document.getElementById('seconds-ones').textContent = seconds % 10;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
