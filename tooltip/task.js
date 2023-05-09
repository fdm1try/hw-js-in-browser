class Tooltip{
    constructor(){
        this.container = document.createElement('div');
        this.container.classList.add('tooltip');
        this.container.style.position = 'absolute';
        document.body.appendChild(this.container);
    }

    show(anchor, position='bottom'){
        let top, left, right, bottom;
        top = left = right = bottom = null;
        switch (position){
            case 'top':
                bottom = document.body.offsetHeight - anchor.offsetTop + 2;
                left = anchor.offsetLeft;
                break;
            case 'left':
                top = anchor.offsetTop;
                right = document.body.offsetWidth - anchor.offsetLeft + 2;
                break;
            case 'right':
                top = anchor.offsetTop;
                left = anchor.offsetLeft + anchor.offsetWidth + 2;
                break;
            default:
                top = anchor.offsetTop + anchor.offsetHeight + 2;
                left = anchor.offsetLeft;
        }
        let style = this.container.style;
        style.top = top ? top + 'px' : 'auto';
        style.left = left ? left + 'px' : 'auto';
        style.right = right ? right + 'px' : 'auto';
        style.bottom = bottom ? bottom + 'px' : 'auto';
        this.container.classList.add('tooltip_active');
    }

    hide(){
        this.container.classList.remove('tooltip_active');
    }

    set text(value){
        this.container.textContent = value;
    }
}

class TooltipController{
    #attachedAt = null;

    constructor(anchorClassName){
        this.tooltip = new Tooltip();
        document.body.style.position = 'relative';
        const handler = (event) => {
            if (!event.target.classList.contains(anchorClassName)) return;
            event.preventDefault();
            if (event.type === 'click') return this.onClick(event.target);
            if (event.type === 'mouseover') return this.onMouseOver(event.target);
            if (event.type === 'mouseout') return this.onMouseOut(event.target);
        }
        ['mouseover', 'mouseout', 'click'].forEach((eventType) => {
            document.body.addEventListener(eventType, handler);
        });
    }

    onClick(anchor){
        if (this.#attachedAt){
            if (anchor === this.#attachedAt) this.#attachedAt = null;
        } else {
            this.#attachedAt = anchor;
        }
    }

    onMouseOver(anchor){
        if (this.#attachedAt) return;
        this.tooltip.text = anchor.textContent;
        this.tooltip.show(anchor, anchor.dataset.position)
    }

    onMouseOut(anchor){
        if (!this.#attachedAt) this.tooltip.hide();
    }
}

new TooltipController('has-tooltip');