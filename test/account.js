// NODE VANILLA PACKAGES DECLARATIONS
const crypto = require('crypto');

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const sendGrid = require('@sendgrid/mail');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const AccountController = require('../controllers/account');
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
let userInfoSaved = undefined;

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
                userAlias: '',
                userName: '',
                userAge: '',
                userCity: '',
                actualPassword: '',
                newPassword: '',
                confirmNewPassword: ''
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
        userInfoSaved = await userInfo.save();
        reqUserInfo = {
            _id: userInfoSaved._id,
            userAlias: userInfoSaved.userAlias,
            userName: userInfoSaved.userName,
            userAge: userInfoSaved.userAge,
            userCity: userInfoSaved.userCity
        }
        const user = new User({
            email: 'test@test.com',
            password: 'testtest1@',
            name: 'Test',
            userInfo: userInfoSaved
        });
        userSaved = await user.save();
        reqUser = {
            _id: userSaved._id,
            email: userSaved.email,
            userInfo: userSaved.userInfo,
            isConfirm: userSaved.isConfirm
        }
        return;
    });
    
    describe('account.js', function() {
        describe('getAccount', function() {
            it('should return statusCode 403 and renderValue true if has no user session', async function () {
                req.user._id = undefined;
                const getAccount = await AccountController.getAccount(req, res, next);
                expect(getAccount[0])
                    .to
                    .be
                    .equal(403);
                expect(getAccount[1])
                    .to
                    .be
                    .true;
                return;
            });
            it('should return statusCode 200 and renderValue true if has user session', async function() {
                req.user._id = reqUser._id;
                const getAccount = await AccountController.getAccount(req, res, next);
                expect(getAccount.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(getAccount.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('postAccount', function() {
            it('should return statusCode 403 and renderValue true if has no user session', async function () {
                req.user._id = undefined;
                const postAccount = await AccountController.postAccount(req, res, next);
                expect(postAccount[0])
                    .to
                    .be
                    .equal(403);
                expect(postAccount[1])
                    .to
                    .be
                    .true;
                return;
            });
            it('should return statusCode 201 and redirectValue true if has user session', async function() {
                req.body = {
                    userAlias: 'testAlias',
                    userName: 'testName',
                    userAge: 19,
                    userCity: 'testCity'
                };
                req.user._id = reqUser._id;
                req.user.userInfo = reqUserInfo;
                const postAccount = await AccountController.postAccount(req, res, next);
                expect(postAccount.statusValue)
                    .to
                    .be
                    .equal(201);
                expect(postAccount.redirectValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('getChangePassword', function() {
            it('should return statusCode 403 and renderValue true if has no user session', async function() {
                req.user._id = undefined;
                const getChangePassword = await AccountController.getChangePassword(req, res, next);
                expect(getChangePassword[0])
                    .to
                    .be
                    .equal(403);
                expect(getChangePassword[1])
                    .to
                    .be
                    .true;
                return;
            });
            it('should return statusCode 200 and renderValue true if has user session', async function() {
                req.user._id = reqUser._id;
                const getChangePassword = await AccountController.getChangePassword(req, res, next);
                expect(getChangePassword.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(getChangePassword.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('postChangePassword', function() {
            it('should return statusCode 403 and renderValue true if has no user session', async function() {
                req.user._id = undefined;
                const postChangePassword = await AccountController.postChangePassword(req, res, next);
                expect(postChangePassword[0])
                    .to
                    .be
                    .equal(403);
                expect(postChangePassword[1])
                    .to
                    .be
                    .true;
                return;
            });
            it('should return statusCode 200 and redirectValue true if has user session', async function() {
                req.body = {
                    actualPassword: 'testtest1@',
                    newPassword: 'testtest2@',
                    confirmNewPassword: 'testtest2@'
                };
                req.user._id = reqUser._id;
                sinon.stub(sendGrid, 'send').callsFake(async function() {
                        return [
                            200,
                            true
                        ];
                    }
                );
                const postChangePassword = await AccountController.postChangePassword(req, res, next);
                expect(postChangePassword[0])
                    .to
                    .be
                    .equal(200);
                expect(postChangePassword[1])
                    .to
                    .be
                    .true;
                sendGrid.send.restore();
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