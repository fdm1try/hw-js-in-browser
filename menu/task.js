document.onclick = function(event){
    if (event.target.classList.contains('menu__link')){
        let menuItem = event.target.closest('.menu__item')
        if (!menuItem) return;
        let submenu = menuItem.querySelector('.menu_sub');
        if (submenu){
            event.preventDefault();
            if (!submenu.classList.contains('menu_active')){
                for (let activeSubmenu of document.querySelectorAll('.menu_sub.menu_active')){
                    activeSubmenu.classList.remove('menu_active');
                }
            }
            submenu.classList.toggle('menu_active');
        }        
    }
}