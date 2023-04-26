const elementDeadCount = document.getElementById('dead');
const elementLostCount = document.getElementById('lost');

let tryCount = 0;
let deadCount = 0;

document.onclick = function(event){
    console.log(event)
    if (event.target.classList.contains('hole')){
        tryCount++;
        if (event.target.classList.contains('hole_has-mole')){
            deadCount++;
        }
        let lostCount = tryCount - deadCount;
        if (lostCount > 4) {
            alert('Поражение...');
            tryCount = 0;
            deadCount = 0;
        } else if (deadCount > 9) {
            alert('Победа!');            
            tryCount = 0;
            deadCount = 0;
        }
        elementDeadCount.innerText = deadCount;
        elementLostCount.innerText = lostCount;
    }
}