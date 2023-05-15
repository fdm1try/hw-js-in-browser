const storageTag = 'TextEditorCache';
const textEditor = document.getElementById('editor');
const resetButton = textEditor.parentElement.querySelector('.editor__reset');
function onChange(){
    window.localStorage.setItem(storageTag, textEditor.value);
}

let state = window.localStorage.getItem(storageTag);
if (state){
    textEditor.value = state;
}
textEditor.addEventListener('input', onChange);
if (resetButton){
    resetButton.addEventListener('click', () => [textEditor.value = '', onChange()]);
}