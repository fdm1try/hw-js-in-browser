class CookieClicker {
    #count;
    #speed = 0;
    #width;
    #height;

    constructor(element, onclick = null) {
        this.#count = 0;
        this.#width = element.width;
        this.#height = element.height;
        let lastClickTime = Date.now();
        element.onclick = () => {
            this.#count++;
            let now = Date.now();
            this.#speed = 1 / ((now - lastClickTime) / 1000);
            lastClickTime = now;
            let k = this.#count % 2 === 0 ? -1 : 1;
            element.width = this.#width + this.#width * 0.04 * k;
            element.height = this.#height + this.#height * 0.04 * k;
            if (onclick) {
                onclick(this);
            }
        }
    }

    get speed(){
        return this.#speed;
    }

    get count(){
        return this.#count;
    }
}

const elementTarget = document.getElementById('cookie');
const elementCount = document.getElementById('clicker__counter');
const elementSpeed = document.getElementById('clicker__speed');

function run(){
    const clicker = new CookieClicker(elementTarget, function(clicker){
        elementCount.innerText = clicker.count;
        elementSpeed.innerText = clicker.speed.toFixed(2);
    });
}

if (!elementTarget.complete)
    elementTarget.onload = run;
else
    run();