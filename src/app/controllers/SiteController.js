const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../utils/mongoose');

class SiteController {
    // GET / home
    async index(req, res, next) {
        // try {
        //     const courses = await Course.find({}).lean();
        //     res.render('home', { courses });
        // } catch (err) {
        //     next(err);
        //     console.log('err: ', err);
        // }

        Course.find({})
            .lean()
            .then((courses) => {
                // courses = courses.map((course) => course.toObject());
                res.render('home', {
                    courses,
                    // courses: multipleMongooseToObject(courses),
                });
            })
            .catch((err) => next(err));
    }

    // GET / search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
