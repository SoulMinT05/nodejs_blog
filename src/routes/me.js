const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');
const verifyMiddleware = require('../app/middlewares/verifyMiddleware');
// '../middleware/verify'

router.get('/stored/courses', meController.storedCourses);
router.get('/trash/courses', meController.trashCourses);
router.get(
    '/stored/users',
    verifyMiddleware.verifyToken,
    meController.geAllUsers,
);

module.exports = router;
