const Course = require('../models/Course');
const { mongooseToObject } = require('../../utils/mongoose');

class MeController {
    // GET /me/stored/courses
    storedCourses(req, res, next) {
        Course.find({})
            .lean()
            .then(courses => {
                res.render('me/stored-courses', {
                    courses,
                });
            })
            .catch(err => console.log('err: ', err));
    }
    // GET /me/trash/courses
    trashCourses(req, res, next) {
        Course.findWithDeleted({ deleted: true })
            .lean()
            .then(courses => {
                res.render('me/trash-courses', {
                    courses,
                });
            })
            .catch(err => console.log('err: ', err));
    }
}

module.exports = new MeController();
