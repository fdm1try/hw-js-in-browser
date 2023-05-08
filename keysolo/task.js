class Game {
    #failAt = null;
    #timer = null;

    constructor(container) {
      this.container = container;
      this.wordElement = container.querySelector('.word');
      this.winsElement = container.querySelector('.status__wins');
      this.lossElement = container.querySelector('.status__loss');
      this.timerElement = container.querySelector('.status__timer');
  
      this.reset();
  
      this.registerEvents();
    }
  
    reset() {
      this.setNewWord();
      this.winsElement.textContent = 0;
      this.lossElement.textContent = 0;
    }
  
    registerEvents() {
      document.addEventListener('keyup', (event) => {
        let key = event.key === 'Space' ? ' ' : event.key.toLowerCase();
        if (event.key.length > 1) return;
        return key === this.currentSymbol.innerText.toLowerCase() ? this.success() : this.fail();
      });
    }
  
    success() {
      if(this.currentSymbol.classList.contains("symbol_current")) this.currentSymbol.classList.remove("symbol_current");
      this.currentSymbol.classList.add('symbol_correct');
      this.currentSymbol = this.currentSymbol.nextElementSibling;
  
      if (this.currentSymbol !== null) {
        this.currentSymbol.classList.add('symbol_current');
        return;
      }
  
      if (++this.winsElement.textContent === 10) {
        alert('Победа!');
        this.reset();
      }
      this.setNewWord();
    }
  
    fail() {
      if (++this.lossElement.textContent === 5) {
        alert('Вы проиграли!');
        this.reset();
      }
      this.setNewWord();
    }

    resetTimer(){
        if (this.#timer !== null) clearInterval(this.#timer);
        let wordLength = this.wordElement.innerText.length;
        this.timerElement.innerText = wordLength;
        this.#failAt = Date.now() + wordLength * 1000;
        this.#timer = setInterval(() => {
            let now = Date.now();
            let elapsed = Math.ceil((this.#failAt - now) / 1000);
            this.timerElement.innerText = elapsed > 0 ? elapsed : 0;
            if (elapsed <= 0){
              clearInterval(this.#timer);
              this.fail();
            }        
          }, 1000);
    }
  
    setNewWord() {
      const word = this.getWord();      
      this.renderWord(word);
      this.resetTimer();      
    }
  
    getWord() {
      const words = [
          'bob',
          'awesome',
          'netology',
          'hello',
          'kitty',
          'rock',
          'youtube',
          'popcorn',
          'cinema',
          'love',
          'javascript'
        ],
        index = Math.floor(Math.random() * words.length);
  
      return words[index];
    }
  
    renderWord(word) {
      const html = [...word]
        .map(
          (s, i) =>
            `<span class="symbol ${i === 0 ? 'symbol_current': ''}">${s}</span>`
        )
        .join('');
      this.wordElement.innerHTML = html;
  
      this.currentSymbol = this.wordElement.querySelector('.symbol_current');
    }
  }
  
  new Game(document.getElementById('game'))