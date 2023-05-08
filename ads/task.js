class Rotator{
  #timerHandler = null;
  #currentCaseIndex = 0;

  constructor(containerElement){
    this.defaultSpeed = 1000;
    this.defaultColor = 'black';
    this.container = containerElement;
    this.currentElement = containerElement.querySelector('.rotator__case_active') || containerElement.querySelector('.rotator');
    let rotatorCaseList = Array.from(containerElement.querySelectorAll('.rotator__case'));
    for (let i=0; i < rotatorCaseList.length; i++){
      rotatorCaseList[i].style.color = rotatorCaseList[i].dataset.color || this.defaultColor;
      if (rotatorCaseList[i] === this.currentElement) this.#currentCaseIndex = i;
    }
    rotatorCaseList[this.#currentCaseIndex].classList.add('rotator__case_active');
    let speed = this.currentElement.dataset.speed || this.defaultSpeed;
    this.#timerHandler = setTimeout(() => this.next(), speed);
  }

  next(){
    clearTimeout(this.#timerHandler);
    this.currentElement.classList.remove('rotator__case_active');
    this.#currentCaseIndex++;
    this.currentElement = this.container.querySelector(`.rotator__case:nth-child(${this.#currentCaseIndex + 1})`);
    if (!this.currentElement){
      this.currentElement = this.container.querySelector('.rotator__case');
      this.#currentCaseIndex = 0;
    }
    this.currentElement.classList.add('rotator__case_active');
    let speed = this.currentElement.dataset.speed || this.defaultSpeed;
    this.#timerHandler = setTimeout(() => this.next(), speed);
  }
}

window.onload = function(){
  for (let rotatorContainer of document.querySelectorAll('.rotator')){
    new Rotator(rotatorContainer);
  }
}