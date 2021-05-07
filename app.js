// NODE VANILLA PACKAGES DECLARATIONS
const path = require('path');

// NPM PACKAGES DECLARATIONS
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
// const morgan = require('morgan');

// CONTROLLERS, MODELS, MIDDLEWARES DECLARATIONS
const User = require('./models/user');
const errorThrow = require('./util/error');
const errorHandler = require('./middleware/errorHandler');

// INITIALIZATION
if (process.env.NODE_ENV) {
    dotenv.config({
        path: __dirname + '/.env'
    });
}
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tfgupv2021.oabkr.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json'
        },
        fallbackLng: 'es',
        preload: ['es, en'],
        returnObjects: true
    });
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();
app.set('view engine', 'pug');
app.set('views', 'views');

// ROUTES DECLARATIONS
const menusRoutes = require('./routes/menus');
const authRoutes = require('./routes/auth');
const generatorRoutes = require('./routes/generator');
const storageRoutes = require('./routes/storage');
const accountRoutes = require('./routes/account');
const errorRoutes = require('./routes/error');

// PARSER
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// PUBLIC FOLDERS
app.use(express.static(path.join(__dirname, 'public')));

// LANGUAGE
app.use(i18nextMiddleware.handle(i18next));

// SESSION
app.use(session({
    secret: 'misecreto', // FIXME - Change the password for the sessions.
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(async (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    return next();
});
app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return next();
        }
        req.user = user;
        return next();
    } catch (err) {
        errorThrow(err, 500, next);
    }
});

// ERROR MESSAGES
app.use(flash());

// SECURITY, OPTIMIZATION & LOGS
app.use(helmet());
app.use(compression());
app.use(csrfProtection);
app.use(async (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    return next();
});
// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'access.log'),
//     {
//         flags: 'a'
//     }
// );
// app.use(morgan(
//     'combined',
//     {
//         stream: accessLogStream
//     }
// ));

// ROUTES
app.use(menusRoutes);
app.use(authRoutes);
app.use('/generator', generatorRoutes);
app.use('/storage', storageRoutes);
app.use('/account', accountRoutes);

// ERROR ROUTES
app.use(errorRoutes);
app.use(errorHandler);

// SERVER & DATABASE CONNECTION
mongoose.connect(
    MONGODB_URI,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
)
.then((result) => {
    app.listen(process.env.PORT || 3000);
})
.catch((err) => {
    console.log(err);
})