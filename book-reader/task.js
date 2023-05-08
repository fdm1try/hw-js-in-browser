class UISetting {
  #value = null;
  #elementsClassName;
  #options = {};

  constructor(containerElement, elementsClassName, settingName, callback) {
    this.container = containerElement;
    this.#elementsClassName = elementsClassName;
    this.onChange = callback;

    for (let element of containerElement.querySelectorAll('.' + elementsClassName)) {
      let data = element.getAttribute('data-' + settingName) || 'default';
      if (element.classList.contains(elementsClassName + '_active')) {
        this.#value = data;
      }
      this.#options[data] = element;
      element.addEventListener('click', (event) => {
        event.preventDefault();
        if (element.classList.contains(elementsClassName + '_active')) return;
        this.switchTo(data);
      });
    }
  }

  switchTo(option){
    let current = this.#options[this.#value];
    if (current){
      current.classList.remove(this.#elementsClassName + '_active');
    }
    let element = this.#options[option];
    if (!element){
      throw new Error(`Option ${option} not exists!`);
    }
    this.#value = option;
    element.classList.add(this.#elementsClassName + '_active');
    this.onChange(option);
  }
}


class BookReader{
  fontSizePrefix = 'book_fs-';
  fontColorPrefix = 'book_color-';
  bgColorPrefix = 'book_bg-';

  constructor(containerElement){
    this.container = containerElement;
    /* Font size switch */
    this.fontSizeSettings = new UISetting(
      document.querySelector('.book__control_font-size'), 
      'font-size',
      'size',
      (fontSize) => this.changeFontSize(fontSize)
    );
    /* Font color switch */
    this.fontColorSettings = new UISetting(
      document.querySelector('.book__control_color'),
      'color',
      'text-color',
      (color) => this.changeFontColor(color)
    );
    /* Background color switch */
    this.backgroundColorSettings = new UISetting(
      document.querySelector('.book__control_background'),
      'color',
      'bg-color',
      (color) => this.changeBackgroundColor(color)
    );
  }

  changeFontSize(size){
    for (let className of this.container.classList){
      if (className.startsWith(this.fontSizePrefix)){
        this.container.classList.remove(className);
      }
    }
    this.container.classList.add(this.fontSizePrefix + size);
  }

  changeFontColor(color){
    for (let className of this.container.classList){
      if (className.startsWith(this.fontColorPrefix)){
        this.container.classList.remove(className);
      }
    }
    this.container.classList.add(this.fontColorPrefix + color);
  }

  changeBackgroundColor(color){
    for (let className of this.container.classList){
      if (className.startsWith(this.bgColorPrefix)){
        this.container.classList.remove(className);
      }
    }
    this.container.classList.add(this.bgColorPrefix + color);
  }
}

const reader = new BookReader(document.querySelector('.book'));