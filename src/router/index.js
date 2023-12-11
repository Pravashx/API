const router = require('express').Router();
const authRouter = require('../app/auth/auth.router')
const categoryRouter = require('../app/category/category.router')
const bannerRouter = require('../app/banner/banner.router')
const brandRouter = require('../app/brand/brand.router')
const productRouter = require('../app/product/product.router')
const userRouter = require('../app/user/user.router')
const cartRouter = require('../app/user/user.router')

router.use(authRouter)
router.use('/category',categoryRouter)
router.use('/banner', bannerRouter)
router.use('/brand', brandRouter)
router.use('/product', productRouter)
router.use('/user', userRouter)
router.use('/cart', cartRouter)

module.exports = router;