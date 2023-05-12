class Poll {
    #answer;
    #stat = null;

    constructor(id, title, answers){
        this.id = id;
        this.title = title;
        this.answers = answers;
    }

    vote(answer){
        return new Promise((resolve, reject) => {
            if (this.#answer){
                return reject('Выбор уже сделан.');
            }
            if (Number.isInteger(answer) && answer in this.answers){
                this.#answer = answer;
            } else {
                this.#answer = this.answers.indexOf(answer);
            }
            if (this.#answer < 0 || this.#answer >= this.answers.length){
                return reject('Ошибка: ответ не найден.');
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/poll');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            const onError = () => reject(`Не удалось опубликовать выбор(HTTP ${xhr.status}: ${xhr.statusText})`);
            xhr.onload = () => {
                if (xhr.status !== 201){
                    return onError();
                }
                let data = JSON.parse(xhr.response);
                this.#stat = data.stat;
                return resolve(this.getVoteResults());
            }
            xhr.send(`vote=${this.id}&answer=${this.#answer}`);         
        })
    }

    getVoteResults(){
        if (!this.#stat || !Array.isArray(this.#stat)){
            return null;
        }
        return this.#stat.map(item=> ({answer: item.answer, votes: item.votes}));
    }
}

class App {
    getRandomPoll(){
        return new Promise(function(resolve, reject){
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/poll');
            let onError = () => reject(`Не удалось загрузить данные (HTTP ${xhr.status}: ${xhr.statusText})`);
            xhr.onerror = onError;
            xhr.onload = () => {
                if (xhr.status !== 200){
                    return onError();
                }
                let data = JSON.parse(xhr.response);
                return resolve(new Poll(data.id, data.data.title, data.data.answers));
            }
            xhr.send();     
        })
    }
}

(async function(){
    let app = new App();
    let titleElement = document.getElementById('poll__title');
    let answersElement = document.getElementById('poll__answers');
    let poll = await app.getRandomPoll();
    titleElement.textContent = poll.title;
    for (let i = 0; i < poll.answers.length; i++){
        let answer = document.createElement('button');
        answer.classList.add('poll__answer');
        answer.textContent = poll.answers[i];
        answer.addEventListener('click', () => {
            poll.vote(i).then((result) => {
                alert('Спасибо, ваш голос засчитан!');
                answersElement.innerHTML = ``;
                let count= result.reduce((acc, value) => acc + value.votes, 0);
                for (let vote of result){
                    let p = document.createElement('p');
                    p.innerHTML = `${vote.answer}: <b>${(vote.votes / count * 100).toFixed(2)}%</b>`;
                    answersElement.appendChild(p);
                }
                
            }).catch((error) => {
                alert(`Ошибка: ${error}`);
            });
        });
        answersElement.appendChild(answer);
    }
})()

