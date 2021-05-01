const edit = document.querySelector('#edit');
const save = document.querySelector('#save');
const revert = document.querySelector('#revert');
const changePassword = document.querySelector('#changePassword');
const userAlias = document.querySelector('#userAlias');
const userName = document.querySelector('#userName');
const userAge = document.querySelector('#userAge');
const userCity = document.querySelector('#userCity');

let userAliasValue;
let userNameValue;
let userAgeValue;
let userCityValue;

function editClickHandler() {
    if (userAlias.disabled) {
        save.disabled = false;
        revert.disabled = false;
        changePassword.disabled = false;
        userAlias.disabled = false;
        userName.disabled = false;
        userAge.disabled = false;
        userCity.disabled = false;
        userAliasValue = userAlias.value;
        userNameValue = userName.value;
        userAgeValue = userAge.value;
        userCityValue = userCity.value;
    } else {
        save.disabled = true;
        revert.disabled = true;
        changePassword.disabled = true;
        userAlias.disabled = true;
        userName.disabled = true;
        userAge.disabled = true;
        userCity.disabled = true;
        userAlias.value = userAliasValue;
        userName.value = userNameValue;
        userAge.value = userAgeValue;
        userCity.value = userCityValue;
    }
}

function revertClickHandler() {
    userAlias.value = userAliasValue;
    userName.value = userNameValue;
    userAge.value = userAgeValue;
    userCity.value = userCityValue;
}

edit.addEventListener('click', editClickHandler);
revert.addEventListener('click', revertClickHandler);