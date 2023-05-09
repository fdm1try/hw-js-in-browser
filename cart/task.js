class Storage {
    constructor(name){
        this.name = name;
    }

    getState(){
        let data = window.localStorage.getItem(this.name);
        return JSON.parse(data);
    }

    setState(object){
        return window.localStorage.setItem(this.name, JSON.stringify(object));
    }
}

class Product {
    constructor(id, title, imageURL){
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
    }
}

class CartProduct extends Product {
    constructor(count, ...args){
        super(...args);
        this.count = count;
    }
}

class ProductView {
    constructor(container, btnAddAction) {
        this.container = container;
        this.image = container.querySelector('.product__image');
        this.title = container.querySelector('.product__title');
        this.quantity = container.querySelector('.product__quantity-value');
        this.btnAdd = container.querySelector('.product__add');
        this.btnDecrease = container.querySelector('.product__quantity-control_dec');
        this.btnIncrease = container.querySelector('.product__quantity-control_inc');

        this.btnDecrease.addEventListener('click', () => this.count -= 1);
        this.btnIncrease.addEventListener('click', () => this.count += 1);
        if (btnAddAction)
            this.btnAdd.addEventListener('click', () => btnAddAction(this.product, this.count));
    }

    get count(){
        return Number(this.quantity.textContent);
    }

    set count(value){
        if (value < 1) return;
        this.quantity.textContent = value;
    }

    get product(){
        return new Product(this.container.dataset.id, this.title.textContent, this.image.src);
    }
}

class CartProductView {
    #product;

    constructor(cartProduct){
        this.#product = cartProduct;
        this.container = document.createElement('div');
        this.container.dataset.id = this.#product.id;
        this.container.classList.add('cart__product');
        this.image = document.createElement('img');
        this.image.src = this.#product.imageURL;
        this.image.classList.add('cart__product-image');
        this.quantity = document.createElement('div');
        this.quantity.classList.add('cart__product-count');
        this.quantity.textContent = this.#product.count;
        this.container.appendChild(this.image);
        this.container.appendChild(this.quantity);
    }

    get count(){
        return this.#product.count;
    }

    set count(value){
        this.#product.count = value;
        this.quantity.textContent = value;
    }

    get product(){
        return {
            id: this.#product.id,
            imageURL: this.#product.imageURL,
            count: this.#product.count
        }
    }
}

class Cart {
    #products = new Map();

    constructor(){
        this.container = document.querySelector('.cart');
        this.productListElement = this.container.querySelector('.cart__products');        
    }

    get state(){
        let items = [];
        for (let [id, view] of this.#products){
            items.push(view.product);
        }
        return items;
    }

    set state(items){
        for (let item of items){
            this.add(item, item.count, true);
        }
    }

    getItem(id){
        return this.#products.get(id);
    }

    add(product, count, silent=false){
        let item = this.#products.get(product.id);
        if (item){
            item.count += count;
            if (!silent) this.onChange(item, this);
            return item;
        } else {
            let cartProduct = new CartProduct(count, product.id, product.title, product.imageURL);
            item = new CartProductView(cartProduct);
            this.#products.set(cartProduct.id, item);
            item.container.addEventListener('click', () => this.remove(cartProduct.id));
            this.productListElement.appendChild(item.container);
            if (!silent) this.onAdd(item, this);
        }
        return item;
    }

    #animateRemove(id, duration=200){
        return new Promise((resolve, reject) =>{
            let item = this.#products.get(id);
            if (!item) {
                return reject();
            }
            let start = Date.now();
            function step(){
                let factor = (Date.now() - start) / duration;
                if (factor >= 1){
                    return resolve();
                }
                item.container.style.opacity = 1 - factor;
                window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        })
    }

    remove(id, silent=false){
        let item = this.#products.get(id);
        if (item){
            this.#animateRemove(id).finally(() => {
                item.container.remove();
                this.#products.delete(id);
                if (!silent) this.onRemove(item, this);
            });
        }
    }

    onAdd(item, cart){
        return;
    }

    onChange(item, cart){
        return;
    }

    onRemove(item, cart){
        return;
    }
}

class App {
    #products = new Map();
    constructor(){
        this.storage = new Storage('shopscart');
        this.cart = new Cart();
        let cartState = this.storage.getState();
        if (cartState) {
            this.cart.state = cartState;
        }
        this.cart.onRemove = () => this.storage.setState(this.cart.state);

        for (let element of document.querySelectorAll('.products .product')){
            let productView = new ProductView(element, (product, count) => this.addToCart(product, count));
            this.#products.set(productView.product.id, productView);
        }
    }

    #animateMove(productView, duration=300) {
        return new Promise((resolve, reject) => {
            if (!productView || !productView.image) 
                return reject();
            let srcX = productView.image.offsetLeft;
            let srcY = productView.image.offsetTop;
            let dstX;
            let dstY = this.cart.productListElement.offsetTop;
            
            let cartItem = this.cart.getItem(productView.product.id);
            if (cartItem) {
                dstX = cartItem.image.getBoundingClientRect().left;
            } else {
                dstX = this.cart.productListElement.offsetLeft;
                dstX += this.cart.productListElement.offsetWidth / 2;
                dstX -= productView.image.offsetWidth / 2;
            }
            let image = productView.image.cloneNode();
            image.style.position = 'absolute';
            image.style.left = srcX + 'px';
            image.style.top = srcY + 'px';
            document.body.appendChild(image);
            let dx = dstX - srcX, dy = dstY - srcY;
            let start = Date.now();
            function step(){
                let factor = (Date.now() - start) / duration;
                if (factor >= 1) {
                    image.remove();
                    return resolve();
                }
                image.style.left = (srcX + dx * factor) + 'px';
                image.style.top = (srcY + dy * factor) + 'px';
                image.style.opacity = 1 - factor + 0.3;
                window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        });
    }

    addToCart(product, count){
        let productView = this.#products.get(product.id);
        this.#animateMove(productView).finally(() => {
            this.cart.add(product, count);
            this.storage.setState(this.cart.state);
        });        
    }
}


new App();