const newsRouter = require('./news');
const coursesRouter = require('./courses');
const userRouter = require('./users');
const siteRouter = require('./site');
const meRouter = require('./me');

function route(app) {
    app.use('/me', meRouter);
    app.use('/news', newsRouter);
    app.use('/courses', coursesRouter);
    app.use('/users', userRouter);
    app.use('/', siteRouter);
}

module.exports = route;
