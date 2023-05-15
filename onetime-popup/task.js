class Cookies {
    #cookieOptionList = ['expires', 'max-age', 'domain', 'path', 'secure', 'httponly', 'samesite'];

    setCookie(name, value, options){
        name = name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
        let cookie = `${name}=${encodeURIComponent(value)};`;
        for (let option in options) {
            if (option.toLowerCase() in this.#cookieOptionList) {
                cookie += `${option}=${options[option]}`
            }
        }
        document.cookie = cookie;
        return true;
    }

    getCookie(name){
        name = name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
        let matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`, 'i'));
        return matches ? decodeURIComponent(matches[1]) : null;
    }
}


let cookies = new Cookies();
document.querySelectorAll('.modal').forEach((modalWindow) => {
    if (!cookies.getCookie(`${modalWindow.id}-modalClosed`)){
        modalWindow.classList.add('modal_active');
    }
    let closeButton = modalWindow.querySelector('.modal__close');
    if (closeButton){
        closeButton.addEventListener('click', () => {
            cookies.setCookie(`${modalWindow.id}-modalClosed`, true);
            modalWindow.classList.remove('modal_active');
        });
    }    
});
