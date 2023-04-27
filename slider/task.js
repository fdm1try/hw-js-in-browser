class Slider {
    #activeSlideId;
    #items;
    #dotItems;

    constructor(wrapperElement){
        this.#items = Array.from(wrapperElement.querySelectorAll('.slider__item'));
        this.#dotItems = Array.from(wrapperElement.querySelectorAll('.slider__dot'));
        if (!this.#items.length || this.#items.length !== this.#dotItems.length){
            throw new Error('Empty slider or count of dots is not equal to the count of slides!');
        }

        const nextBtn = wrapperElement.querySelector('.slider__arrow_next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }
        const prevBtn = wrapperElement.querySelector('.slider__arrow_prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }

        let activeSlider = wrapperElement.querySelector('.slider__item_active');
        this.#activeSlideId = activeSlider ? this.#items.indexOf(activeSlider) : 0;

        for (let i = 0; i < this.#items.length; i++){
            if (i == this.#activeSlideId){
                // activate the first one, if there are no active slides
                this.#items[i].classList.add('slider__item_active');
                this.#dotItems[i].classList.add('slider__dot_active');
            } else {
                // Only one slide can be active
                this.#items[i].classList.remove('slider__item_active');
                this.#dotItems[i].classList.remove('slider__dot_active');
            }
            this.#dotItems[i].addEventListener('click', () => this.switchTo(i));
        }
    }

    get activeSlide(){
        return this.#items[this.#activeSlideId];
    }

    next(){
        let slideId = this.#activeSlideId + 1 >= this.#items.length ? 0 : this.#activeSlideId + 1;
        return this.switchTo(slideId)
    }

    prev(){
        let slideId = this.#activeSlideId <= 0 ? this.#dotItems.length - 1 : this.#activeSlideId - 1;
        return this.switchTo(slideId)
    }

    switchTo(slideId){ 
        if (this.#activeSlideId === slideId){
            return;
        }
        if (!(slideId in this.#items)){
            throw new Error(`SLIDER_ERROR: Slide with id <${slideId}> does not exist!`);
        }
        this.#dotItems[this.#activeSlideId].classList.remove('slider__dot_active');
        this.activeSlide.classList.remove('slider__item_active');
        this.#activeSlideId = slideId;
        this.activeSlide.classList.add('slider__item_active');
        this.#dotItems[this.#activeSlideId].classList.add('slider__dot_active');
    }
}

const slider = new Slider(document.querySelector('.slider'));