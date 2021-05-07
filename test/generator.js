// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const sinon = require('sinon');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const GeneratorController = require('../controllers/generator');

// INITIALIZATION
if (process.env.NODE_ENV) {
    dotenv.config({
        path: process.cwd() + '/.env'
    });
}

// DESCRIBES
describe('CONTROLLERS TEST' , function() {
    before(async function() {
        return;
    });

    describe('generator.js', function() {
        // TODO - Hacer test de generator.
    });

    after(async function() {
        return;
    });
});