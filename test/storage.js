// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const StorageController = require('../controllers/storage');
const User = require('../models/user');
const UserInfo = require('../models/userInfo');
const Password = require('../models/password');
const Hint = require('../models/hint');

// INITIALIZATION
if (process.env.NODE_ENV) {
    dotenv.config({
        path: process.cwd() + '/.env'
    });
}
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tfgupv2021.oabkr.mongodb.net/${process.env.MONGO_TEST_DATABASE}?retryWrites=true&w=majority`;
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
                email: '',
                password: ''
            },
            params: {
                passwordId: ''
            },
            query: {
                message: ''
            },
            session: {
                isLoggedIn: false,
                user: undefined,
                save: function() {
                    return this;
                },
                destroy: function() {
                    return [
                        200,
                        true
                    ]
                }
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
            const statusValue = 500;
            const renderValue = true;
            return [
                statusValue,
                renderValue
            ];
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
            userInfo: userInfoSaved,
            isConfirm: true
        });
        userSaved = await user.save();
        return;
    });

    describe('storage.js', function() {
        describe('getStorage', function() {
            it('should return statusCode 200 and renderValue true', async function() {
                req.user = userSaved;
                const storage = await StorageController.getStorage(req, res, next);
                expect(storage.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(storage.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('getRecreate', function() {
            it('should return statusCode 200 and renderValue true if exists the password', async function() {
                let hints = [];
                const hintEmail = new Hint({
                    hintName: '@Email@',
                    hintValue: req.user.email,
                    hintHash: 'ijoijffnpfcfnwehifchwe9w2r92psfchaep9faafosdffaosdphfashevbd',
                    isIntroducedByUser: false
                });
                const hintEmailSaved = await hintEmail.save();
                hints.push(hintEmailSaved);
                const hintNamePass = new Hint({
                    hintName: '@NamePass@',
                    hintValue: 'Contraseña',
                    hintHash: 'ijoijffnpfcfnwehifchwe9w2r92psfchaep9faafosdffaosdphfashevbd',
                    isIntroducedByUser: false
                });
                const hintNamePassSaved = await hintNamePass.save();
                hints.push(hintNamePassSaved);
                const hintMix = new Hint({
                    hintName: '@Mix@',
                    hintHash: 'ijoijffnpfcfnwehifchwe9w2r92psfchaep9faafosdffaosdphfashevbd',
                    isIntroducedByUser: false
                });
                const hintMixSaved = await hintMix.save();
                hints.push(hintMixSaved);
                const hintData = new Hint({
                    hintName: 'Data 1',
                    hintHash: 'ijoijffnpfcfnwehifchwe9w2r92psfchaep9faafosdffaosdphfashevbd',
                    isIntroducedByUser: true
                });
                const hintDataSaved = await hintData.save();
                hints.push(hintDataSaved);
                const password = new Password({
                    passwordName: 'Contraseña',
                    passwordHash: 'ijoijffnpfcfnwehifchwe9w2r92psfchaep9faafosdffaosdphfashevbd',
                    length: 8,
                    difficulty: 'easy',
                    hints: hints
                });
                const passwordSaved = await password.save();
                req.params.passwordId = passwordSaved._id;
                const storage = await StorageController.getRecreate(req, res, next);
                expect(storage.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(storage.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('postRecreate', function() {
            it('should return statusCode 200 and renderValue true if data is correct', async function() {
                req.body = {
                    passwordId: req.params.passwordId,
                    difficulty: 'easy',
                    data1Value: 'primer dato',
                    data2Value: '',
                    data3Value: ''
                };
                sinon.stub(bcrypt, 'compare');
                bcrypt.compare.returns(true);
                const storage = await StorageController.postRecreate(req, res, next);
                expect(storage.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(storage.renderValue)
                    .to
                    .be
                    .true;
                bcrypt.compare.restore();
                return;
            });
        });

        describe('postDeletePassword', function() {
            it('should', async function() {
                req.body.passwordId = req.params.passwordId;
                const storage = await StorageController.postDeletePassword(req, res, next);
                expect(storage.statusValue)
                    .to
                    .be
                    .equal(202);
                expect(storage.redirectValue)
                    .to
                    .be
                    .true;
            });
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