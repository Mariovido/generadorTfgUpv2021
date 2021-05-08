// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS

// INITIALIZATION
const firstRegex = /[abcABC]/;
const secondRegex = /[defDEF]/;
const thirdRegex = /[ghiGHI]/;
const fourthRegex = /[jklJKL]/;
const fifthRegex = /[mnoMNO]/;
const sixthRegex = /[pqrPQR]/;
const seventhRegex = /[stuRSU]/;
const eighthRegex = /[vwxVWX]/;
const ninethRegex = /[yzYZ]/
const tenthRegex = /\d/;
const numbers = '0123456789';

// EXPORTS
module.exports = (character) => {
    if (firstRegex.test(character)) {
        return numbers.charAt(0);
    }
    if (secondRegex.test(character)) { 
        return numbers.charAt(1);
    }
    if (thirdRegex.test(character)) {
        return numbers.charAt(2);
    }
    if (fourthRegex.test(character)) {
        return numbers.charAt(3);
    }
    if (fifthRegex.test(character)) {
        return numbers.charAt(4);
    }
    if (sixthRegex.test(character)) {
        return numbers.charAt(5);
    }
    if (seventhRegex.test(character)) {
        return numbers.charAt(6);
    }
    if (eighthRegex.test(character)) {
        return numbers.charAt(7);
    }
    if (ninethRegex.test(character)) {
        return numbers.charAt(8);
    }
    if (tenthRegex.test(character)) {
        return numbers.charAt(9);
    }
    return character;
}