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
const ninethRegex = /[yzYZ\d]/
const symbols = '@$!%*#?&@';

// EXPORTS
module.exports = (character) => {
    if (firstRegex.test(character)) {
        return symbols.charAt(0);
    }
    if (secondRegex.test(character)) { 
        return symbols.charAt(1);
    }
    if (thirdRegex.test(character)) {
        return symbols.charAt(2);
    }
    if (fourthRegex.test(character)) {
        return symbols.charAt(3);
    }
    if (fifthRegex.test(character)) {
        return symbols.charAt(4);
    }
    if (sixthRegex.test(character)) {
        return symbols.charAt(5);
    }
    if (seventhRegex.test(character)) {
        return symbols.charAt(6);
    }
    if (eighthRegex.test(character)) {
        return symbols.charAt(7);
    }
    if (ninethRegex.test(character)) {
        return symbols.charAt(8);
    }
    return character;
}