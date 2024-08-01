const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const SortMiddleware = require('./app/middlewares/SortMiddleware');

const moment = require('moment');
const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

db.connect();

// Use file static
app.use(express.static(path.join(__dirname, 'public')));

// Use to submit
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));
app.use(cookieParser());
dotenv.config();

// Custom middlewares
app.use(SortMiddleware);

app.get(
    '/middleware',
    function (req, res, next) {
        if (['vethuong', 'vevip'].includes(req.query.ve)) {
            return next();
        }
        res.status(403).send({ message: 'Access denied' });
    },
    function (req, res, next) {
        res.json({ message: 'Success' });
    },
);

// HTTP logger
// app.use(morgan('combined'));

// Template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: require('./app/helpers/handlebars'),
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Init routes
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
