const mainPopup = document.getElementById('modal_main');
mainPopup.classList.add('modal_active');

document.onclick = function(event){
    if (event.target.classList.contains('modal__close')){
        let popup = event.target.closest('.modal');
        popup.classList.remove('modal_active');
    }
    if (event.target.classList.contains('show-success')){
        let popup = document.getElementById('modal_success');
        popup.classList.add('modal_active');
    }
}