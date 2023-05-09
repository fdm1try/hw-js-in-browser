const State = {
    UNCHECKED: 0,
    CHECKED: 1,
    INDETERMINATE: 2
}

class TreeElement{
    constructor(container){
        this.container = container;
        this.checkbox = container.querySelector('.interest__check');
    }

    get state(){
        return Number(!!this.checkbox.checked) + Number(!!this.checkbox.indeterminate);
    }

    set state(newState){
        this.checkbox.checked = !!(State.CHECKED & newState);
        this.checkbox.indeterminate = !!(State.INDETERMINATE & newState);
    }

    get parent(){
        let parentNode = this.container.closest('.interests');
        let element = parentNode ? parentNode.closest('.interest') : null;
        return element ? new TreeElement(element) : null;
    }

    get children(){
        let children = [];
        for (let child of this.container.querySelectorAll('.interests')){
            for (let interest of child.querySelectorAll('.interest')){
                children.push(new TreeElement(interest));
            }
        }
        return children;
    }

    changeChildrenState(newState){
        for (let child of this.children){
            child.state = newState;
            child.changeChildrenState(newState);
        }
    }
}


class Tree {
    constructor(container){
        this.container = container;
        container.addEventListener('click', (event) => {
            if (event.target.classList.contains('interest__check')){
                event.stopPropagation();
                if (event.target.indeterminate) event.target.checked = true;
                event.target.indeterminate = false;
                this.onStateChange(new TreeElement(event.target.closest('.interest')))
            }
        });
    }

    onStateChange(element){
        element.changeChildrenState(element.state);
        let parent = element.parent; 
        while (parent){
            let children = parent.children;
            let maxWeight = children.length;
            let weight = 0;
            for (let child of children){
                weight += [0, 1, 0.5][child.state];
                if ((child.state == State.UNCHECKED && weight) || child.state == State.INDETERMINATE) break;
            }
            parent.state = !weight ? State.UNCHECKED : weight < maxWeight ? State.INDETERMINATE : State.CHECKED;
            parent = parent.parent;
        }
    }

}

window.onload = function(){
    const container = document.querySelector('.interests_main');
    const tree = new Tree(container);
}