// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const mongoose = require('mongoose');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const GeneratorController = require('../controllers/generator');
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

    describe('generator.js', function() {
        describe('getGenerator', function() {
            it('should return statusCode 200 and renderValue true', async function() {
                req.user = userSaved;
                const generator = await GeneratorController.getGenerator(req, res, next);
                expect(generator.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(generator.renderValue)
                    .to
                    .be
                    .true;
            });
        });

        describe('postGenerator', function() {
            it('should return the statusCode 200 and renderValue true if data is correct', async function() {
                req.body = {
                    namePass: 'Contraseña',
                    length: [
                        8,
                        8
                    ],
                    difficulty: 'easy',
                    data1Name: 'Data 1',
                    data1Value: 'Data 1 Value',
                    data2Name: 'Data 2',
                    data2Value: 'Data 2 Value',
                    data3Name: 'Data 3',
                    data3Value: 'Data 3 Value'
                };
                let generator = await GeneratorController.postGenerator(req, res, next);
                expect(generator.statusValue)
                    .to
                    .be
                    .equal(201);
                expect(generator.renderValue)
                    .to
                    .be
                    .true;
                req.body.difficulty = 'medium';
                generator = await GeneratorController.postGenerator(req, res, next);
                expect(generator.statusValue)
                    .to
                    .be
                    .equal(201);
                expect(generator.renderValue)
                    .to
                    .be
                    .true;
                req.body.difficulty = 'hard';
                generator = await GeneratorController.postGenerator(req, res, next);
                expect(generator.statusValue)
                    .to
                    .be
                    .equal(201);
                expect(generator.renderValue)
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