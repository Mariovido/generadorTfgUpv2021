// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const sinon = require('sinon');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const ErrorController = require('../controllers/error');

// INITIALIZATION
if (process.env.NODE_ENV) {
    dotenv.config({
        path: process.cwd() + '/.env'
    });
}
let req = {};
let res = {};
let next = {};

// DESCRIBES
describe('CONTROLLERS TEST' , function() {
    before(async function() {
        req = {
            flash: function(message) {
                if (message === 'error') {
                    return [];
                }                    
                return this;
            },
            t: function(message) {
                return message;
            },
            body: {
            },
            params: {
            },
            query: {
                message: null
            },
            session: {
            },
            user: {
                _id: '',
                email: '',
                password: '',
                name: '',
                userInfo: undefined
            }
        };
        res = {
            status: function(status, errors) {
                this.statusValue = status;
                return this;
            },
            render: function() {
                this.renderValue = true;
                this.redirectValue = undefined;
                return this;
            },
            redirect: function() {
                this.redirectValue = true;
                this.renderValue = undefined;
                return this;
            },
            statusValue: undefined,
            renderValue: undefined,
            redirectValue: undefined
        };
        next = function(err) {
            const statusValue = 403;
            const renderValue = true;
            return [
                statusValue,
                renderValue
            ];
        };
        return;
    });

    describe('menus.js', function() {
        describe('get403', function() {
            it('should return statusCode 403 and renderValue true', async function() {
                const get403 = await ErrorController.get403(req, res, next);
                expect(get403.statusValue)
                    .to
                    .be
                    .equal(403);
                expect(get403.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('get404', function() {
            it('should return statusCode 404 and renderValue true', async function() {
                const get404 = await ErrorController.get404(req, res, next);
                expect(get404.statusValue)
                    .to
                    .be
                    .equal(404);
                expect(get404.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('get500', function() {
            it('should return statusCode 500 and renderValue true', async function() {
                const get500 = await ErrorController.get500(req, res, next);
                expect(get500.statusValue)
                    .to
                    .be
                    .equal(500);
                expect(get500.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });
    });

    after(async function() {
        return;
    });
});