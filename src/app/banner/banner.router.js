const router = require('express').Router()
const bannerCtrl = require('./banner.controller')
const CheckLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request-middleware');
const { BannerCreateSchema } = require('./banner.validator');

const dirSet = (req, res, next)=>{
    req.uploadDir = "./public/uploads/banner/"
    next()
}
router.route('/')
    .get(
        CheckLogin,
        CheckPermission('admin'),
        bannerCtrl.listAllBanners
    )
    .post(CheckLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.single('image'),
        ValidateRequest(BannerCreateSchema),
        bannerCtrl.bannerCreate)

module.exports = router;