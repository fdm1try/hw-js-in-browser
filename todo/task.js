class Task {
    constructor(title){
        this.container = document.createElement('div');
        this.container.classList.add('task');
        let taskTitle = document.createElement('div');
        taskTitle.classList.add('task__title');
        taskTitle.textContent = title;
        this.container.appendChild(taskTitle);
        let removeButton = document.createElement('a');
        removeButton.href = '#';
        removeButton.classList.add('task__remove');
        removeButton.innerHTML = '&times;'
        removeButton.addEventListener('click', (event) => [event.preventDefault(), this.remove()]);
        this.container.appendChild(removeButton);
    }

    remove(){
        this.container.remove();
    }
}

class App {
    constructor(){
        this.form = document.getElementById('tasks__form');
        this.input = document.getElementById('task__input');
        this.tasks = document.getElementById('tasks__list');
        this.form.addEventListener('submit', (event) => [event.preventDefault(), this.addTask()]);
    }

    validateInput(){
        return /^\w\w+.*/.test(this.input.value.trim())
    }

    addTask(){
        if (!this.validateInput()) return;
        let title = this.input.value.trim();
        this.input.value = '';
        let task = new Task(title);
        this.tasks.appendChild(task.container);
    }
}

new App();
