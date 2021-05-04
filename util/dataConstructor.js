// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const errorThrow = require('./error');
const stepUtil = require('./step');
const mixer = require('./mixer');

// INITIALIZATION

// EXPORTS
module.exports = async (email, namePass, data, length) => {
    try {
        const steps = stepUtil(data, length);
        const mandatoriesStep = steps.mandatoriesStep;
        const introducedStep = steps.introducedStep;
        const hashedEmail = await bcrypt.hash(email, 2);
        const hashedNamePass = await bcrypt.hash(namePass, 2);
        const hashedData = [];
        for (const dato of data) {
            const hashedDato = await bcrypt.hash(dato, 2);
            hashedData.push(hashedDato);
        }
        const lengthPerData = 60 / (2 + data.length);
        // TODO - GUARDAR HASHED DATOS.

        const finalMix = mixer(hashedEmail, hashedNamePass, hashedData, lengthPerData, mandatoriesStep, introducedStep);
        return finalMix;
    } catch (err) {
        return errorThrow(err, 500, next);
    }
}