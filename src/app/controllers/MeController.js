const Course = require('../models/Course');
const { mongooseToObject } = require('../../utils/mongoose');

class MeController {
    // GET /me/stored/courses
    async storedCourses(req, res, next) {
        //Without Promise, two Course execute async approximately at the same time,
        //Course 1 has not output, Course 2 ran

        //Example: if promise 1 run 2s, promise 2 run 5s
        // If use 2 promise: promise 1 and promise 2 --> run total time: 7s
        // But if use Promise.all --> run total time: 5s
        Promise.all([
            Course.find({}).lean(),
            Course.countDocumentsWithDeleted({ deleted: true }),
        ])
            .then(([courses, deletedCount]) => {
                res.render('me/stored-courses', {
                    courses,
                    deletedCount,
                });
            })
            .catch(next);

        // Course.countDocumentsWithDeleted({ deleted: true })
        //     .lean()
        //     .then(deleteCount =>
        //         console.log('deleteCount111111: ', deleteCount),
        //     )
        //     .catch(next);

        // Course.find({})
        //     .lean()
        //     .then(courses => {
        //         res.render('me/stored-courses', {
        //             courses,
        //         });
        //     })
        //     .catch(err => co nsole.log('err: ', err));
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
