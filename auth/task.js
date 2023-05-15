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

class User {
    #storage;
    #state;

    constructor(name){
        this.#storage = new Storage(name || 'app_user');
        this.#state = this.#storage.getState() || { id: null };
    }

    #auth(login, password){
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/auth');
        const formData = new FormData();
        formData.append('login', login);
        formData.append('password', password);
        return new Promise((resolve, reject) => {
            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === xhr.DONE){
                    if (xhr.status < 200 || xhr.status >= 300) {
                        return reject(`HTTP ${xhr.status}: ${xhr.statusText}`);
                    }
                    try {
                        let answer = JSON.parse(xhr.response);
                        return answer.success ? resolve(answer.user_id) : reject();
                    } catch(error){
                        return reject(error);
                    }               
                }
            })
            xhr.send(formData);
        });
    }

    get id(){
        return this.#state.id;
    }

    saveState(){
        this.#storage.setState(this.#state);
    }

    signIn(login, password){
        return new Promise((resolve, reject) => {
            if (this.id !== null){
                return resolve(this.id);
            }
            this.#auth(login, password).then((userId) => {
                this.#state.id = userId;
                this.saveState();
                return resolve(userId);
            }).catch((error) => reject(error));
        });        
    }

    signOut(){
        this.#state.id = null;
        this.saveState();
        return true;
    }
}

class App{
    #inputActive = true;
    #user;

    constructor(){
        this.container = document.getElementById('signin');        
        this.signinForm = document.getElementById('signin__form');
        this.login = this.signinForm.querySelector('input[name="login"]');
        this.password = this.signinForm.querySelector('input[name="password"]');
        this.welcome = document.getElementById('welcome');
        this.userId = this.welcome.querySelector('span');
        this.signoutButton = this.welcome.querySelector('.signout-button');
        this.#user = new User('applicationUserTest');
        this.signinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.signIn();
        });
        this.signoutButton.addEventListener('click', () => this.signOut());
        this.render();
    }

    render(){
        if (this.#user.id){
            this.container.classList.remove('signin_active');
            this.userId.textContent = this.#user.id;
            this.welcome.classList.add('welcome_active');
        } else {
            this.container.classList.add('signin_active');
            this.userId.textContent = '';
            this.welcome.classList.remove('welcome_active');
        }
    }

    set userInputActive(value){
        let state = !!value;
        this.#inputActive = state;
        this.login.disabled = !state;
        this.password.disabled = !state;
    }

    async signIn(){
        try {
            this.userInputActive = false;
            await this.#user.signIn(this.login.value, this.password.value);
            this.render();
        } catch(error){
            if (error){
                console.error(`${error}`);
            }
            alert('Неверный логин/пароль');
            this.userInputActive = true;
        } finally {
            this.login.value = '';
            this.password.value = '';
        }
    }

    signOut(){
        this.#user.signOut();
        this.render();
    }
}

const app = new App();