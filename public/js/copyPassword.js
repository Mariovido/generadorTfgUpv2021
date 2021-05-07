const copy = document.querySelector('#copy');

function copyToClipboard(text) {
    const type = 'text/plain';
    const blob = new Blob([text], {type});
    let data = [new ClipboardItem({[type]: blob})];

    navigator.clipboard.write(data);
    
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}
  
//
copy.addEventListener('click', function() {
    copyToClipboard(document.getElementById('password').innerHTML);
});