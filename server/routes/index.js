const auth = require('../middleware/auth')

const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/income', auth ,require('./income'));
router.use('/expense' ,auth,require('./expense'));

module.exports = router;