const router = require('express').Router();
const authRouter = require('../app/auth/auth.router')
const categoryRouter = require('../app/category/category.router')
const bannerRouter = require('../app/banner/banner.router')
const brandRouter = require('../app/brand/brand.router')

router.use(authRouter)
router.use('/category',categoryRouter)
router.use('/banner', bannerRouter)
router.use('brand', brandRouter)

module.exports = router;