function isVisible(nodeElement){    
    let {top, bottom} = nodeElement.getBoundingClientRect();
    return (top > 0 && top < window.innerHeight) || (bottom > 0 && bottom < window.innerHeight);
}

document.addEventListener('scroll', function(){
    for(let revealElement of document.querySelectorAll('.reveal')){
        if (isVisible(revealElement)){
            revealElement.classList.add('reveal_active');
        } else {
            revealElement.classList.remove('reveal_active');
        }
    }
});