class Timer {
    constructor(seconds, element){
        this.count = seconds;
        this.element = element;
    }

    start(){
        let now = Date.now();
        this.timerEnd = now + this.count * 1000;
        this.elapsed = this.timerEnd - now;
        this.render();
        let self = this;
        return new Promise((resolve) => {
            self.interval = setInterval(() => {
                self.elapsed = self.timerEnd - Date.now();
                if (self.elapsed <= 0){
                    self.elapsed = 0;
                    self.render();
                    clearInterval(self.interval);
                    return resolve();
                }
                self.elapsed = self.timerEnd - Date.now();
                self.render();
            }, 1000);
        });
    }

    format(ms){
        let seconds = Math.ceil(ms / 1000);
        let h = Math.floor(seconds / 3_600);
        seconds = seconds % 3_600;
        let m = Math.floor(seconds / 60);
        let s = seconds % 60;
        return `${('0' + h).slice(-2)}:${('0' + m).slice(-2)}:${('0' + s).slice(-2)}`;
    }

    render(){
        this.element.innerText = this.format(this.elapsed);
    }
}

const element = document.getElementById('timer');
const timer = new Timer(Number(element.innerText), element);
timer.start().then(function(){
    setTimeout(() => alert('Вы победили в конкурсе!'), 0);
})