const slider = document.querySelector("#lengthSlider");
const number = document.querySelector("#lengthNumber");

function sliderClickHandler() {
    let sliderValue = document.querySelector("#lengthSlider").value;
    number.value = sliderValue;
}

function numberClickHandler() {
    let numberValue = document.querySelector("#lengthNumber").value;
    slider.value = numberValue;
}

slider.addEventListener('change', sliderClickHandler);
slider.addEventListener('mousemove', sliderClickHandler);
number.addEventListener('change', numberClickHandler);