// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const Hint = require('../models/hint');
const errorThrow = require('./error');
const stepUtil = require('./step');
const mixer = require('./mixer');

// INITIALIZATION

// EXPORTS
module.exports = async (email, namePass, data, length, next) => {
    try {
        const steps = stepUtil(data, length);
        const mandatoriesStep = steps.mandatoriesStep;
        const introducedStep = steps.introducedStep;

        const hints = [];

        const hashedEmail = await bcrypt.hash(email, 2);
        const emailHint = new Hint({
            hintName: '@Email@',
            hintValue: email,
            hintHash: hashedEmail,
            isIntroducedByUser: false
        });
        const emailHintSaved = await emailHint.save();
        hints.push(emailHintSaved);

        const hashedNamePass = await bcrypt.hash(namePass, 2);
        const namePassHint = new Hint({
            hintName: '@NamePass@',
            hintValue: namePass,
            hintHash: hashedNamePass,
            isIntroducedByUser: false
        });
        const namePassHintSaved = await namePassHint.save();
        hints.push(namePassHintSaved);

        const hashedData = [];
        for (const dato of data) {
            const hashedDato = await bcrypt.hash(dato.dataValue, 2);
            hashedData.push(hashedDato);
            const hintData = new Hint({
                hintName: dato.dataName,
                hintValue: dato.dataValue.toLowerCase(),
                hintHash: hashedDato,
                isIntroducedByUser: true
            });
            const hintDataSaved = await hintData.save();
            hints.push(hintDataSaved);
        }

        const lengthPerData = 60 / (2 + data.length);

        const finalMix = mixer(hashedEmail, hashedNamePass, hashedData, lengthPerData, mandatoriesStep, introducedStep);
        return {
            finalMix: finalMix,
            hints: hints
        };
    } catch (err) {
        return errorThrow(err, 500, next);
    }
}