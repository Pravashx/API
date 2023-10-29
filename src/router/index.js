const router = require('express').Router();
const authRouter = require('../app/auth/auth.router')
const categoryRouter = require('../app/category/category.router')

router.use(authRouter)
router.use('/category',categoryRouter)






module.exports = router;