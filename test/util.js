// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const expect = require('chai').expect;

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const errorMessage = require('../util/errorMessage');
const error = require('../util/error');
const infoMessage = require('../util/infoMessage');

//INITIALIZATION

// DESCRIBES
describe('UTIL TEST', function() {
    describe('errorMessage.js tests:', function() {
        it('should return the first message if have multiple', function() {
            const req = {
                flash: function(message) {
                    if (message === 'error') {
                        return [
                            'Mensaje1',
                            'Mensaje2'
                        ];
                    }                    
                    return null;
                }
            };
            const message = errorMessage(req);
            expect(message)
                .to
                .be
                .equal('Mensaje1');
        });
        it('should return null if dont have messages', function() {
            const req = {
                flash: function(message) {
                    if (message === 'error') {
                        return [];
                    }                    
                    return null;
                }
            };
            const message = errorMessage(req);
            expect(message)
                .to
                .be
                .equal(null);
        });
    });

    describe('error.js tests:', function() {
        it('should return statusCode 500 if it is not defined', function() {
            const err = new Error('Error de prueba');
            const statusCode = null;
            const next = function(err) {
                return err.statusCode;
            };
            const nextError = error(err, statusCode, next);
            expect(nextError)
                .to
                .be
                .equal(500);
        });
        it('should return statusCode defined', function() {
            const err = new Error('Error de prueba');
            const statusCode = 403;
            const next = function(err) {
                return err.statusCode;
            };
            const nextError = error(err, statusCode, next);
            expect(nextError)
                .to
                .be
                .equal(statusCode);
        });
    });

    describe('infoMessage.js tests:', function() {
        it('should return the message of the query', function() {
            const message = 'Soy el mensaje';
            const req = {
                query: {
                    message: message
                }
            };
            const newMessage = infoMessage(req);
            expect(newMessage)
                .to
                .be
                .equal(message);
        });
    });
});