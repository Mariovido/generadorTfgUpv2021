// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS

// INITIALIZATION

// EXPORTS
module.exports = (data, length) => {
    let x;
    let y;
    let z;
    if (data.length == 1) {
        x = 5;
        y = 7;
        z = 5;
    } else if (data.length == 2) {
        x = 5;
        y = 7;
        z = 7;
    } else if (data.length == 3) {
        x = 7;
        y = 5;
        z = 5;
    }
    let mandatoriesStep;
    if ((length % x) == 0) {
        mandatoriesStep = 1;
    } else {
        mandatoriesStep = length % x;
    }
    let introducedStep;
    if ((length % y) == 0) {
        introducedStep = 1;
    } else {
        introducedStep = length % y;
    }
    let finalStep;
    if ((length % z) == 0) {
        finalStep = 1;
    } else {
        finalStep = length % z;
    }
    return {
        mandatoriesStep: mandatoriesStep,
        introducedStep: introducedStep,
        finalStep: finalStep
    };
}