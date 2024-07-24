const Course = require('../models/Course');
const { mongooseToObject } = require('../../utils/mongoose');

class CourseController {
    // GET / courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .lean()
            .then((course) => {
                res.render('courses/show', {
                    // course: mongooseToObject(course),
                    course,
                });
            })
            .catch(next);
    }
}

module.exports = new CourseController();
