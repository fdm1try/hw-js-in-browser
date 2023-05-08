class TabUI{
  #tabs;
  #contentItems;

  constructor(navContainer, contentContainer){
    this.#tabs = Array.from(navContainer.getElementsByClassName('tab'));
    this.#contentItems = Array.from(contentContainer.getElementsByClassName('tab__content'));
    for (let i=0; i < this.#tabs.length; i++){
      this.#tabs[i].addEventListener('click', () => this.switchTab(i));
    }
  }

  switchTab(tabIndex){
    if (!(tabIndex in this.#tabs) || !(tabIndex in this.#contentItems)){
      throw new Error('Ivalid tab index!');
    }
    for (let i=0; i < this.#tabs.length; i++){
      if (i == tabIndex){
        this.#tabs[i].classList.add('tab_active');
        this.#contentItems[i].classList.add('tab__content_active');
      } else {
        this.#tabs[i].classList.remove('tab_active');
        this.#contentItems[i].classList.remove('tab__content_active');
      }
    }
  }
}

window.onload = function(){
  const nav = document.querySelector('.tab__navigation');
  const content = document.querySelector('.tab__contents');
  let tabUI = new TabUI(nav, content);
}