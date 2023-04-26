class CookieClicker {
    #count;
    #startTime;
    #width;
    #height;

    constructor(element, onclick = null) {
        this.#count = 0;
        this.#width = element.width;
        this.#height = element.height;
        this.#startTime = Date.now();

        element.onclick = (event) => {
            this.#count++;
            let k = this.#count % 2 === 0 ? -1 : 1;
            element.width = this.#width + (this.#width * 0.04 * k);
            element.height = this.#height + (this.#height * 0.04 * k);
            if (onclick) {
                onclick(this);
            }
        }
    }

    get speed(){
        return this.#count / ((Date.now() - this.#startTime) / 1000);
    }

    get count(){
        return this.#count;
    }
}

const elementTarget = document.getElementById('cookie');
const elementCount = document.getElementById('clicker__counter');
const elementSpeed = document.getElementById('clicker__speed');
function onclick(clicker){
    elementCount.innerText = clicker.count;
    elementSpeed.innerText = clicker.speed.toFixed(2);
}
clicker = new CookieClicker(elementTarget, onclick);
