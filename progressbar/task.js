const progressbar = document.querySelector('progress');
const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
    progressbar.value = 0;
    event.preventDefault();
    let formData = new FormData(form);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/upload');
    xhr.upload.onprogress = (event) => progressbar.value = (event.loaded / event.total).toFixed(1);
    xhr.send(formData);
})