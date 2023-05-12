class Robot {
    constructor(){
        this.variants = [
            'Здравствуйте, мы не работаем!', 
            'Привет, мы работали вчера и больше не захотели.', 
            'Ну началось...', 
            'Ваше сообщение очень важно для нас, но ответить не можем.', 
            'Полезли за словом в карман, напишу когда вылезем.'
        ];
        this.lastVariant = -1;
    }

    ask(question){
        let i = null;
        while(!i || i === this.lastVariant){
            i = Math.floor(Math.random() * this.variants.length);
        }
        this.lastVariant = i;
        return this.variants[i];
    }
}


class Message{
    constructor(text, time, fromClient){
        this.text = text;
        this.time = time;
        this.fromClient = fromClient;
    }

    html(){
        let hours = ('0' + this.time.getHours()).slice(-2);
        let minutes = ('0' + this.time.getMinutes()).slice(-2);
        return `
            <div class="message ${this.fromClient ? 'message_client' : ''}">
                <div class="message__time">${hours}:${minutes}</div>
                <div class="message__text">
                    ${this.text}
                 </div>
            </div>
        `;
    }
}


class Chat{
    #timerHandler;
    #lastUserActivity;
    #messages = [];

    constructor(container, inactivityTimeout=60_000){
        this.container = container;
        this.inactivityTimeout = inactivityTimeout;
        this.inputFocus = false;
        this.chatWrapper = container.querySelector('.chat-widget__messages-container');
        this.messagesContainer = this.chatWrapper.querySelector('#chat-widget__messages');
        this.inputElement = container.querySelector('.chat-widget__input');

        this.container.querySelector('.chat-widget__side').addEventListener('click', () => this.visible = true);
        window.addEventListener('keyup', (event) => {
            if (event.target.id === 'chat-widget__input' && ['Enter', 'NumpadEnter'].indexOf(event.code) >= 0){
                this.sendClientMessage();
            }
        })
    }

    get visible(){
        return this.container.classList.contains('chat-widget_active');
    }

    set visible(value){
        if (!!value){
            this.container.classList.add('chat-widget_active');
        } else {
            this.container.classList.remove('chat-widget_active');
        }
        if (value) this.registerUserActivity();
    }

    get lastMessage(){
        return this.#messages.length ? this.#messages[this.#messages.length - 1] : null;
    }

    registerUserActivity(){
        clearTimeout(this.#timerHandler);
        this.#lastUserActivity = new Date();
        this.#timerHandler = setTimeout(() => {
            if (this.visible) this.onClientInactivity();
        }, this.inactivityTimeout);
    }    

    onClientMessage(text, time){
        return;
    }

    onClientInactivity(){
        this.sendAnswer('У Вас есть вопросы?');
    }

    sendAnswer(text){        
        this.addMessage(new Message(text, new Date(), false));
    }

    sendClientMessage(){
        if (!this.inputElement.checkValidity() || /^\s*$/.test(this.inputElement.value)) return;
        this.addMessage(new Message(this.inputElement.value.trim(), new Date(), true));
        this.inputElement.value = '';
        this.registerUserActivity();
    }

    addMessage(message){
        this.messagesContainer.innerHTML += message.html();
        this.chatWrapper.scrollTop = this.chatWrapper.scrollHeight;
        if (message.fromClient) this.onClientMessage(message.text, message.time);
        this.#messages.push(message);
    }
}

const bot = new Robot();
const chatWidgetElement = document.querySelector('.chat-widget');
const chat = new Chat(chatWidgetElement, 30_000);
chat.onClientMessage = function(text, time){
    chat.sendAnswer(bot.ask(text));
}
chat.onClientInactivity = function(){
    let text = chat.lastMessage ? 'Вопросы есть?' : 'Что-то хотели спросить?';
    chat.sendAnswer(text);
}