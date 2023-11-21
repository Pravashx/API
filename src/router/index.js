const router = require('express').Router();
const authRouter = require('../app/auth/auth.router')
const categoryRouter = require('../app/category/category.router')
const bannerRouter = require('../app/banner/banner.router')

router.use(authRouter)
router.use('/category',categoryRouter)
router.use('/banner', bannerRouter)

module.exports = router;