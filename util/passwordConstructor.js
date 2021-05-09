// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const errorThrow = require('./error');
const stepUtil = require('./step');
const trasnformToNumber = require('./transformToNumber');
const transformToSymbol = require('./transformToSymbol');

// INITIALIZATION
const regexNumbers = /\d/;
const regexHashSymbols = /[\.\/\$]/;
const regexSymbols = /(?=.*[@$!%*#?&])/;

// EXPORTS
module.exports = async (hashedData, data, length, difficulty, next) => {
    try {
        const steps = stepUtil(data, length);
        const finalStep = steps.finalStep;
        
        const lengthBy2 = (length / 2);

        let mixPassword = '';
        let step = 0;
        let numberOfNumbers = 0;
        let numberOfSymbols = 0;
        while ((mixPassword.length < length)) {
            let character = hashedData.substring(step, step + 1);

            if (difficulty === 'easy') {
                if (!regexHashSymbols.test(character) && !regexNumbers.test(character)) {
                    mixPassword += character;
                }
            }

            const maxNumbersMedium = length / 4;
            const maxSymbolsMedium = length / 8;
            if (difficulty === 'medium') { 
                if (!regexHashSymbols.test(character)) {
                    if (mixPassword.length < lengthBy2 / 2) {
                        if (numberOfNumbers < maxNumbersMedium / 2 && (mixPassword.length % 2) != 0) {
                            character = trasnformToNumber(character);
                        }
                    }
                    if (mixPassword.length >= lengthBy2 / 2 && mixPassword.length < lengthBy2) {
                        if (numberOfSymbols < maxSymbolsMedium / 2 && (mixPassword.length % 2) == 0) {
                            character = transformToSymbol(character);
                        }
                    }
                    if (mixPassword.length >= lengthBy2 && mixPassword.length > 3 * lengthBy2 / 2) {
                        if (numberOfSymbols < maxSymbolsMedium && (mixPassword.length % 2) != 0) {
                            character = transformToSymbol(character);
                        }
                    }
                    if (mixPassword.length >= 3 * lengthBy2 / 2) {
                        if (numberOfNumbers < maxNumbersMedium && (mixPassword.length % 2) == 0) {
                            character = trasnformToNumber(character);
                        }
                    }
                    if (regexNumbers.test(character)) {
                        numberOfNumbers += 1;
                    }
                    if (regexSymbols.test(character)) {
                        numberOfSymbols += 1;
                    }
                    mixPassword += character;
                }
            }

            const maxNumbersHard = length / 4;
            const maxSymbolsHard = length / 4;
            if (difficulty === 'hard') {
                if (!regexHashSymbols.test(character)) {
                    if (mixPassword.length < lengthBy2 / 2) {
                        if (numberOfNumbers < maxNumbersHard / 2 && (mixPassword.length % 2) != 0) {
                            character = trasnformToNumber(character);
                        }
                    }
                    if (mixPassword.length >= lengthBy2 / 2 && mixPassword.length < lengthBy2) {
                        if (numberOfSymbols < maxSymbolsHard / 2 && (mixPassword.length % 2) == 0) {
                            character = transformToSymbol(character);
                        }
                    }
                    if (mixPassword.length >= lengthBy2 && mixPassword.length > 3 * lengthBy2 / 2) {
                        if (numberOfSymbols < maxSymbolsHard && (mixPassword.length % 2) != 0) {
                            character = transformToSymbol(character);
                        }
                    }
                    if (mixPassword.length >= 3 * lengthBy2 / 2) {
                        if (numberOfNumbers < maxNumbersHard && (mixPassword.length % 2) == 0) {
                            character = trasnformToNumber(character);
                        }
                    }
                    if (regexNumbers.test(character)) {
                        numberOfNumbers += 1;
                    }
                    if (regexSymbols.test(character)) {
                        numberOfSymbols += 1;
                    }
                    mixPassword += character;
                }
            }

            step += finalStep;
            if (step > 60) {
                step -= 60;
            } 
        }
        return mixPassword;
    } catch (err) {
        return errorThrow(err, 500, next);
    }
}