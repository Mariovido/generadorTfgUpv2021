// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const errorThrow = require('./error');
const stepUtil = require('./step');

// INITIALIZATION

// EXPORTS
module.exports = async (hashedData, data, length, difficulty) => { // TODO - Hacer distintas dificultades
    try {
        const steps = stepUtil(data, length);
        const finalStep = steps.finalStep;
    
        let mixPassword = '';
        let step = 0;
        while ((mixPassword.length < length)) {
            let character = hashedData.substring(step, step + 1);
            if (character !== '.' && character !== '/' && character !== '$') {
                mixPassword += character;
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