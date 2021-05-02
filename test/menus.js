// NODE VANILLA PACKAGES DECLARATIONS

// NPM PACKAGES DECLARATIONS
const dotenv = require('dotenv');
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const MenusController = require('../controllers/menus');
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

    describe('menus.js', function() {
        describe('getIndex', function() {
            it('should return statusCode 200 and renderValue true', async function() {
                const getIndex = await MenusController.getIndex(req, res, next);
                expect(getIndex.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(getIndex.renderValue)
                    .to
                    .be
                    .true;
                return;
            });
        });

        describe('getMenu', function() {
            it('should return statusCode 403 and renderValue true if has no user session', async function() {
                req.user._id = undefined;
                const getMenu = await MenusController.getMenu(req, res, next);
                expect(getMenu[0])
                    .to
                    .be
                    .equal(403);
                expect(getMenu[1])
                    .to
                    .be
                    .true;
                return;
            });
            it('should return statusCode 200 and renderValue true if has user session', async function() {
                req.user._id = reqUser._id;
                const getMenu = await MenusController.getMenu(req, res, next);
                expect(getMenu.statusValue)
                    .to
                    .be
                    .equal(200);
                expect(getMenu.renderValue)
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