const elementDeadCount = document.getElementById('dead');
const elementLostCount = document.getElementById('lost');

let tryCount = 0;
let deadCount = 0;
const gameOver = (title) => {
    tryCount = 0;
    deadCount = 0;
    alert(title);
}

document.onclick = function(event){
    if (event.target.classList.contains('hole')){
        tryCount++;
        if (event.target.classList.contains('hole_has-mole')){
            deadCount++;
        }
        if (tryCount - deadCount > 4)
            gameOver('Поражение...');
        else if (deadCount > 9)
            gameOver('Победа!');
        elementDeadCount.innerText = deadCount;
        elementLostCount.innerText = tryCount - deadCount;
    }
}