// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS

// INITIALIZATION

// EXPORTS
module.exports = (hashedEmail, hashedNamePass, hashedData, lengthPerData, mandatoriesStep, introducedStep) => {
    let mixEmail = '';
    let mixNamePass = '';
    let step = 0;
    while ((mixEmail.length < lengthPerData) || (mixNamePass.length < lengthPerData)) {
        if (mixEmail.length < lengthPerData) {
            let character = hashedEmail.substring(step, step + 1);
            if (character !== '.' && character !== '/' && character !== '$') {
                mixEmail += character;
            }
        } 
        if (mixNamePass.length < lengthPerData) {
            let character = hashedNamePass.substring(step, step + 1);
            if (character !== '.' && character !== '/' && character !== '$') {
                mixNamePass += character;
            }
        }
        step += mandatoriesStep;
        if (step > 60) {
            step -= 60;
        } 
    }
    let mixData = '';
    for (const hashedDato of hashedData) {
        let mixDato = '';
        let stepDato = 0;
        while (mixDato.length < lengthPerData) {
            let character = hashedDato.substring(stepDato, stepDato + 1);
            if (character !== '.' && character !== '/' && character !== '$') {
                mixDato += character;
            }
            stepDato += introducedStep;
            if (stepDato > 60) {
                stepDato -= 60;
            }
        }
        mixData += mixDato;
    }

    const finalMix = mixEmail + mixNamePass + mixData;
    return finalMix;
}