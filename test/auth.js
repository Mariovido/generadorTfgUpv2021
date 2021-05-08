// NODE VANILLA PACKAGES DECLARATIONS
const crypto = require('crypto');

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const sendGrid = require('@sendgrid/mail');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const AuthController = require('../controllers/auth');
const User = require('../models/user');
const UserInfo = require('../models/userInfo');

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
let userSaved = undefined;


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
                token: ''
            },
            query: {
                message: null
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
            userInfo: userInfoSaved
        });
        userSaved = await user.save();
        return;
    });

    describe('auth.js', function() {
        describe('getLogin', function() {
            it('should return statusCode 200 and render true', async function() {
                const getLogin = await AuthController.getLogin(req, res, next);
                expect(getLogin)
                    .to
                    .have
                    .property('statusValue', 200);
                expect(getLogin)
                    .to
                    .have
                    .property('renderValue', true);
                return;
            });
        });

        describe('postLogin', function() {
            it('should return status 422 and render true if doesnt exist the user', async function() {
                req.body = {
                    email: 'test1@test.com',
                    password: 'testtest1@'
                };
                const postLogin = await AuthController.postLogin(req, res, next);
                expect(postLogin.statusValue)
                    .to
                    .be
                    .equal(422)
                expect(postLogin.renderValue)
                    .to
                    .be
                    .true
                return;
            });
            it('should return status 422 and render true if the passwords are not the same', async function() {
                req.body = {
                    email: 'test@test.com',
                    password: 'testtest2@'
                };
                const postLogin = await AuthController.postLogin(req, res, next);
                expect(postLogin.statusValue)
                    .to
                    .be
                    .equal(422)
                expect(postLogin.renderValue)
                    .to
                    .be
                    .true
                return;
            });
        });

        describe('getSignup', function() {
            it('should return statusCode 200 and render true', async function() {
                const getSignup = await AuthController.getSignup(req, res, next);
                expect(getSignup.statusValue)
                    .to
                    .be
                    .equal(200)
                expect(getSignup.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });
        
        describe('postSignup', function() {
            it('should return statusCode 200 and redirect true if the email and password is correct', async function() {
                req.body = {
                    email: 'test2@test.com',
                    alias: 'test',
                    password: 'testtest2@',
                    confirmPassword: 'testtest2@'
                };
                sinon.stub(crypto, 'randomBytes');
                crypto.randomBytes.returns({
                    statusValue: 200,
                    redirectValue: true
                });
                const postSignup = await AuthController.postSignup(req, res, next);
                expect(postSignup.statusValue)
                    .to
                    .be
                    .equal(200)
                expect(postSignup.redirectValue)
                    .to
                    .be
                    .true;
                crypto.randomBytes.restore();
                return;
            });
        });

        describe('getConfirm', function() {
            it('should return statusCode 200 and render true if the tokens match', async function() {
                req.params = {
                    token: 'The token'
                };
                userSaved.confirmToken = 'The token';
                userSaved.isConfirm = false;
                userSaved = await userSaved.save();
                const getConfirm = await AuthController.getConfirm(req, res, next);
                expect(getConfirm.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(getConfirm.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
            it('should return statusCode 500 and render true if the tokens dont match', async function() {
                req.params = {
                    token: 'The token failed'
                };
                userSaved.confirmToken = 'The token';
                userSaved.isConfirm = false;
                userSaved = await userSaved.save();
                const getConfirm = await AuthController.getConfirm(req, res, next);
                expect(getConfirm[0])
                    .to
                    .be
                    .equal(500);
                expect(getConfirm[1])
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('getResetPassword', function() {
            it('should return statusCode 200 and render true', async function() {
                const getResetPassword = await AuthController.getResetPassword(req, res, next);
                expect(getResetPassword.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(getResetPassword.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('postResetPassword', function() {
            it('should return statusCode 200 and render true if email exist', async function() {
                req.body = {
                    email: 'test@test.com'
                };
                sinon.stub(crypto, 'randomBytes').callsFake(async function() {
                        const user = await User.findOne({
                            email: 'test@test.com'
                        });
                        if (!user) {
                            return;
                        }
                        return [
                            200,
                            true
                        ];
                   }
                );
                const postResetPassword = await AuthController.postResetPassword(req, res, next);
                expect(postResetPassword[0])
                    .to
                    .be
                    .equal(200);
                expect(postResetPassword[1])
                    .to
                    .be
                    .true;
                crypto.randomBytes.restore();
                return;
            });
        });

        describe('getNewPassword', function() {
            it('should return statusCode 200 and renderValue true if the tokens match', async function() {
                req.params = {
                    token: 'The token'
                };
                userSaved.resetToken = 'The token';
                userSaved.resetTokenExpiration = Date.now() + 360000;
                userSaved = await userSaved.save();
                const getNewPassword = await AuthController.getNewPassword(req, res, next);
                expect(getNewPassword.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(getNewPassword.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
            it('should return statusCode 500 and renderValue true if the tokens dont match', async function() {
                req.params = {
                    token: 'The token failed'
                };
                userSaved.resetToken = 'The token';
                userSaved.resetTokenExpiration = Date.now() + 360000;
                userSaved = await userSaved.save();
                const getNewPassword = await AuthController.getNewPassword(req, res, next);
                expect(getNewPassword[0])
                    .to
                    .be
                    .equal(500);
                expect(getNewPassword[1])
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('postNewPassword', function() {
            it('should return statusCode 200 and rendervalue true if the tokens match', async function() {
                req.body = {
                    newPassword: 'test1test@',
                    token: 'The token',
                    userId: userSaved._id.toString()
                };
                sinon.stub(sendGrid, 'send').callsFake(async function() {
                        return [
                            200,
                            true
                        ];
                    }
                );
                userSaved.resetToken = 'The token';
                userSaved.resetTokenExpiration = Date.now() + 360000;
                userSaved = await userSaved.save();
                const postNewPassword = await AuthController.postNewPassword(req, res, next);
                expect(postNewPassword[0])
                    .to
                    .be
                    .equal(200);
                expect(postNewPassword[1])
                    .to
                    .be
                    .true;
                sendGrid.send.restore();
                return;
            });
            it('should return statusCode 500 and renderValue true if the tokens match', async function() {
                req.body = {
                    newPassword: 'test1test@',
                    token: 'The token failed',
                    userId: userSaved._id.toString()
                };
                userSaved.resetToken = 'The token';
                userSaved.resetTokenExpiration = Date.now() + 360000;
                userSaved = await userSaved.save();
                const postNewPassword = await AuthController.postNewPassword(req, res, next);
                expect(postNewPassword[0])
                    .to
                    .be
                    .equal(500);
                expect(postNewPassword[1])
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('getLogout', function() {
            it('should return statusCode 200 and render true', async function() {
                const postLogout = await AuthController.postLogout(req, res, next);
                expect(postLogout[0])
                    .to
                    .be
                    .equal(200);
                expect(postLogout[1])
                    .to
                    .be
                    .true;
                return;
            });
        });
    });

    after(async function() {
        await User.deleteMany({});
        await UserInfo.deleteMany({});
        await mongoose.disconnect();
        return;
    });
});