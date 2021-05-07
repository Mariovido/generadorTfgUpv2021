const checked = document.querySelector('#difficultyValue');

const difficultyEasy = document.querySelector("#difficultyEasy");
const difficultyMedium = document.querySelector("#difficultyMedium");
const difficultyHard = document.querySelector("#difficultyHard");

if (checked.value === 'easy') {
    difficultyEasy.checked = true;
}
if (checked.value === 'medium') {
    difficultyMedium.checked = true;
}
if (checked.value === 'hard') {
    difficultyHard.checked = true;
}

const data2Name = document.querySelector('#data2Name');
const data2Value = document.querySelector('#data2Value');
const data3Name = document.querySelector('#data3Name');
const data3Value = document.querySelector('#data3Value');

if (!data2Name.value) {
    data2Value.disabled = true;
}
if (!data3Name.value) {
    data3Value.disabled = true;
}