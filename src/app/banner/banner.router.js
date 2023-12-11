const router = require('express').Router()
const bannerCtrl = require('./banner.controller')
const CheckLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request-middleware');
const { BannerRequestSchema } = require('./banner.validator');

const dirSet = (req, res, next) => {
    req.uploadDir = "./public/uploads/banner/"
    next()
}
router.get('/home', bannerCtrl.listHome)
router.route('/')
    .get(
        CheckLogin,
        CheckPermission('admin'),
        bannerCtrl.listAllBanners
    )
    .post(
        CheckLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.single('image'),
        ValidateRequest(BannerRequestSchema),
        bannerCtrl.bannerCreate
    )

router.route('/:id')
    .get(
        CheckLogin,
        CheckPermission('admin'),
        bannerCtrl.getDataById
    )
    .put(
        CheckLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.single('image'),
        ValidateRequest(BannerRequestSchema),
        bannerCtrl.updateById
    )
    .delete(
        CheckLogin,
        CheckPermission('admin'),
        bannerCtrl.deleteById
    )
module.exports = router;