class Storage {
    constructor(name){
        this.name = name;
    }

    getState(){
        return JSON.parse(window.localStorage.getItem(this.name));
    }

    setState(state){
        window.localStorage.setItem(this.name, JSON.stringify(state));
    }
}

class CurrencyRate {
    #storage;
    #date = null;
    #items = null;

    constructor(){
        this.#storage = new Storage('currencys_rates');
        let state = this.#storage.getState();
        if (state){
            this.#date = new Date(state.date);
            this.#items = state.items;
        }
    }

    #saveState(){
        this.#storage.setState({
            date: this.#date,
            items: this.#items
        });
    }

    #parseItem(object){
        return {
            id: object['ID'],
            numCode: object['NumCode'],
            charCode: object['CharCode'],
            nominal: object['Nominal'],
            name: object['Name'],
            value: object['Value'],
            previousValue: object['Previous']
        }
    }

    getAll(){
        return new Promise((resolve, reject) => {
            let items = [];
            if (this.#date && this.#items){
                let now = new Date();
                now = new Date(now - ((now.getTimezoneOffset() - this.#date.getTimezoneOffset()) * 60000));
                if (now < this.#date || now.toLocaleDateString() === this.#date.toLocaleDateString()){
                    try {
                        for (let code in this.#items){
                            items.push(this.#parseItem(this.#items[code]));
                        }
                        
                        return resolve(items);
                    } catch(exception){
                        console.error(`Произошла ошибка парсинга кэша: ${exception}\n Данные будут загружены.`);
                    }                    
                }
            }
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/slow-get-courses');
            let onError = () => reject(`Не удалось загрузить данные (HTTP ${xhr.status}: ${xhr.statusText})`);
            xhr.onerror = onError;
            xhr.onload = () => {
                if (xhr.status !== 200){
                    return onError();
                }
                let data = JSON.parse(xhr.response);
                this.#date = data.response['Date'];
                this.#items = data.response['Valute'];
                for (let code in this.#items){
                    items.push(this.#parseItem(code, this.#items[code]));
                }
                this.#saveState();
                return resolve(items);
            }
            xhr.send();     
        });
    }
}

const rates = new CurrencyRate();
const container = document.getElementById('items');
const loader = document.getElementById('loader');

function renderRates(){
    rates.getAll().then((items) => {
        for (let rate of items){
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <div class="item__code">
                    ${rate.charCode}
                </div>
                <div class="item__value">
                    ${rate.value.toFixed(2).replace('.', ',')}
                </div>
                <div class="item__currency">
                    руб.
                </div> 
            `;
            container.appendChild(item);
        }
        loader.classList.remove('loader_active');

    }).catch((error) => {
        if (confirm(`Произошла ошибка загрузки: ${error}\nПопробовать ещё раз?`)){
            return renderRates();
        }
    })
}

renderRates();