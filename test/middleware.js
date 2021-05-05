// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const expect = require('chai').expect;
const sinon = require('sinon');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const errorHandler = require('../middleware/errorHandler');
const isAuth = require('../middleware/is-auth');
const isNotAuth = require('../middleware/is-not-auth');

// INITIALIZATION

// DESCRIBES
describe('MIDDLEWARE TEST', function() {
    describe('errorHandler.js', function() {
        it('should return true if have an error', async function() {
            sinon.stub(console, 'log');
            console.log.returns(null);
            const err = new Error('Error de prueba');
            const req = {
                session: 'Soy una session',
                t: function(message) {
                    return message;
                }
            }
            const res = {
                status: function() {
                    this.statusValue = 500;
                    return this;
                },
                render: function() {
                    this.renderValue = true;
                    return this;
                },
                statusValue: undefined,
                renderValue: undefined
            }
            const next = function() {
                return;
            }
            const error = await errorHandler(err, req, res, next);
            expect(error)
                .to
                .have
                .property('statusValue', 500);
            expect(error)
                .to
                .have
                .property('renderValue', true);
            console.log.restore();
        });
        it('should destroy session if have an error 403', async function() {
            sinon.stub(console, 'log');
            console.log.returns(null);
            const err = new Error('Error de prueba');
            err.statusCode = 403;
            const req = {
                session: {
                    destroy: function() {
                        res.session = true;
                        return res;
                    }
                },
                t: function(message) {
                    return message;
                }
            };
            const res = {
                status: function() {
                    return this;
                },
                render: function() {
                    return this;
                },
                session: undefined
            };
            const next = function() {
                return;
            };
            const error = await errorHandler(err, req, res, next);
            expect(error)
                .to
                .have
                .property('session', true);
            console.log.restore();
        });
    });

    describe('is-auth.js', function() {
        it('should return true if it is logged in', async function() {
            const req = {
                session: {
                    isLoggedIn: true
                },
                t: function(message) {
                    return message;
                }
            };
            const res = {
                status: function() {
                    return this;
                },
                render: function() {
                    return this;
                },
                session: undefined
            };
            const next = function(err) {
                if (err) {
                    return err;
                }
                return true;
            };
            const auth = isAuth(req, res, next);
            expect(auth)
                .to
                .be
                .true;
        });
        it('should return false if it is not logged in', async function() {
            const req = {
                session: {
                    isLoggedIn: false
                },
                t: function(message) {
                    return message;
                }
            };
            const res = {
                status: function() {
                    return this;
                },
                render: function() {
                    return this;
                },
                session: undefined
            };
            const next = function(err) {
                if (err) {
                    return false;
                }
                return true;
            };
            const auth = isAuth(req, res, next);
            expect(auth)
                .to
                .be
                .false;
        });
    });

    
    describe('is-auth.js', function() {
        it('should return true if it is logged in', async function() {
            const req = {
                session: {
                    isLoggedIn: false
                },
                t: function(message) {
                    return message;
                }
            };
            const res = {
                status: function() {
                    return this;
                },
                render: function() {
                    return this;
                },
                session: undefined
            };
            const next = function(err) {
                if (err) {
                    return err;
                }
                return true;
            };
            const auth = isNotAuth(req, res, next);
            expect(auth)
                .to
                .be
                .true;
        });
        it('should return the false if it is not logged in', async function() {
            const req = {
                session: {
                    isLoggedIn: true
                },
                t: function(message) {
                    return message;
                }
            };
            const res = {
                status: function() {
                    return this;
                },
                render: function() {
                    return this;
                },
                session: undefined
            };
            const next = function(err) {
                if (err) {
                    return false;
                }
                return true;
            };
            const auth = isNotAuth(req, res, next);
            expect(auth)
                .to
                .be
                .false;
        });
    });

    // TODO - is-not-auth.js
});