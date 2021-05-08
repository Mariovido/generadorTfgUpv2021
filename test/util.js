// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const Password = require('../models/password');
const Hint = require('../models/hint');
const errorMessage = require('../util/errorMessage');
const error = require('../util/error');
const infoMessage = require('../util/infoMessage');
const transformToNumber = require('../util/transformToNumber');
const transformToSymbol = require('../util/transformToSymbol');
const step = require('../util/step');
const dataConstructor = require('../util/dataConstructor');
const mixer = require('../util/mixer');
const passwordConstructor = require('../util/passwordConstructor');

// INITIALIZATION
if (process.env.NODE_ENV) {
    dotenv.config({
        path: process.cwd() + '/.env'
    });
}
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tfgupv2021.oabkr.mongodb.net/${process.env.MONGO_TEST_DATABASE}?retryWrites=true&w=majority`;
let next;
let userSaved = undefined;
let regexEasy = /^(?=.*[A-Za-z])[A-Za-z]/;
let regexMediumAndHard = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/;

// DESCRIBES
describe('UTIL TEST', function() {
    before(async function() {
        next = function() {
            return;
        };
        await mongoose
            .connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        const userInfo = new UserInfo({
            userAlias: 'testAlias',
            userName: 'testName',
            userAge: 19,
            userCity: 'testCity'
        });
        const userInfoSaved = await userInfo.save();
        const user = new User({
            email: 'test@test.com',
            password: 'testtest1@',
            name: 'Test',
            userInfo: userInfoSaved
        });
        userSaved = await user.save();
        return;
    });

    describe('errorMessage.js', function() {
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
            return;
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
            return;
        });
    });

    describe('error.js', function() {
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
            return;
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
            return;
        });
    });

    describe('infoMessage.js', function() {
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
            return;
        });
    });

    describe('transformToNumber.js', function() {
        it('should return one number', function() {
            let character = 'a';
            let number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('0');
            character = 'd';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('1');
            character = 'g';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('2');
            character = 'j';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('3');
            character = 'm';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('4');
            character = 'p';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('5');    
            character = 's';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('6');  
            character = 'v';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('7');
            character = 'y';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('8');
            character = '1';
            number = transformToNumber(character);
            expect(number)
                .to
                .be
                .equal('9');    
            return;  
        });
    });

    describe('transformToNumber.js', function() {
        it('should return one symbol', function() {
            let character = 'a';
            let symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('@');
            character = 'd';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('$');
            character = 'g';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('!');
            character = 'j';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('%');
            character = 'm';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('*');
            character = 'p';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('#');    
            character = 's';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('?');  
            character = 'v';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('&');
            character = 'y';
            symbol = transformToSymbol(character);
            expect(symbol)
                .to
                .be
                .equal('@'); 
            return;  
        });
    });

    describe('step.js', function() {
        it('should return an array with the steps', function() {
            let data = [
                0,
                1,
                2
            ];
            const length = 8;
            let steps = step(data, length);
            expect(steps.mandatoriesStep)
                .to
                .be
                .equal(1);
            expect(steps.introducedStep)
                .to
                .be
                .equal(3);
            expect(steps.finalStep)
                .to
                .be
                .equal(3);
            data = [
                    0,
                    1
                ];
            steps = step(data, length);
            expect(steps.mandatoriesStep)
                .to
                .be
                .equal(3);
            expect(steps.introducedStep)
                .to
                .be
                .equal(1);
            expect(steps.finalStep)
                .to
                .be
                .equal(1);
            data = [
                1
            ];
            steps = step(data, length);
            expect(steps.mandatoriesStep)
                .to
                .be
                .equal(3);
            expect(steps.introducedStep)
                .to
                .be
                .equal(1);
            expect(steps.finalStep)
                .to
                .be
                .equal(3);
            return;
        });
    });

    describe('dataConstructor.js', function() {
        it('should return the finalMix and the hints', async function() {
            const email = userSaved.email;
            const namePass = 'Contraseña';
            data = [
                {
                    dataName: 'Hint 1',
                    dataValue: 'hintValue'
                }
            ];
            const length = 8;
            const dataMix = await dataConstructor(email, namePass, data, length, next);
            expect(dataMix.finalMix)
                .to
                .have
                .lengthOf(60);
            expect(dataMix.hints)
                .to
                .have
                .length(3);
            return;
        });
    });

    describe('mixer.js', function() {
        it('should return a mix of length 60', async function() {
            const email = await Hint.findOne({
                hintName: '@Email@'
            });
            const hashedEmail = email.hintHash;
            const namePass = await Hint.findOne({
                hintName: '@NamePass@'
            });
            const hashedNamePass = namePass.hintHash;
            const data1 = await Hint.findOne({
                hintName: 'Hint 1'
            })
            const hashedData = [
                data1.hintHash
            ];
            const lengthPerData = 60 / (2 + hashedData.length);
            mandatoriesStep = 2;
            introducedStep = 2;

            const finalMix = mixer(hashedEmail, hashedNamePass, hashedData, lengthPerData, mandatoriesStep, introducedStep);
            expect(finalMix)
                .to
                .have
                .lengthOf(60);
            const hashedMix = await bcrypt.hash(finalMix, 2);
            const mixHint = new Hint({
                hintName: '@Mix@',
                hintHash: hashedMix,
                isIntroducedByUser: false
            });
            await mixHint.save();
            return;
        });
    });

    describe('passwordConstructor.js', function() {
        it('should return the final password', async function() {
            const mix = await Hint.findOne({
                hintName: '@Mix@'
            });
            const hashedMix = mix.hintHash;
            const data = [
                1
            ];
            const length = 8;

            let difficulty = 'easy';
            let password = await passwordConstructor(hashedMix, data, length, difficulty, next);
            expect(password)
                .to
                .have
                .lengthOf(8)
                .and
                .match(regexEasy);
            difficulty = 'medium';
            password = await passwordConstructor(hashedMix, data, length, difficulty, next);
            expect(password)
                .to
                .have
                .lengthOf(8)
                .and
                .match(regexMediumAndHard);
            difficulty = 'hard';
            password = await passwordConstructor(hashedMix, data, length, difficulty, next);
            expect(password)
                .to
                .have
                .lengthOf(8)
                .and
                .match(regexMediumAndHard);
            return;
        });
    });
    
    after(async function() {
        await User.deleteMany({});
        await UserInfo.deleteMany({});
        await Password.deleteMany({});
        await Hint.deleteMany({});
        await mongoose.disconnect();
        return;
    });
});