const Course = require('../models/Course');

class SiteController {
    // GET / home
    async index(req, res) {
        try {
            const courses = await Course.find({});
            res.json(courses);
        } catch (err) {
            console.log('err: ', err);
        }
    }

    // GET / search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
