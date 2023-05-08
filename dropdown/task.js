class DropdownMenu {
    #itemList;
    #valueNode;

    constructor(nodeElement) {
        this.#itemList = nodeElement.querySelector('.dropdown__list');
        this.#valueNode = nodeElement.querySelector('.dropdown__value');
        for (let item of nodeElement.querySelectorAll('.dropdown__item')){

        }
        this.#valueNode.addEventListener('click', () => this.isActive ? this.hide() : this.show());
        this.#itemList.addEventListener('click', (event) => {
            if (event.target.classList.contains('dropdown__link')){
                event.preventDefault();
                event.stopPropagation();
                this.value = event.target.innerText;
                this.hide();
            }
        })
    }

    show(){
        this.#itemList.classList.add('dropdown__list_active');
    }

    hide(){
        this.#itemList.classList.remove('dropdown__list_active');
    }

    get isActive(){
        return this.#itemList.classList.contains('dropdown__list_active');
    }

    get value(){
        return this.#valueNode.innerText;
    }

    set value(newValue){
        this.#valueNode.innerText = newValue;
    }  
}

window.onload = function(){
    for (dropdownMenuContainer of document.querySelectorAll('.dropdown')){
        new DropdownMenu(dropdownMenuContainer);
    }
}