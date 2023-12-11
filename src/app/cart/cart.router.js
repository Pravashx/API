const CheckLogin = require('../../middlewares/auth.middleware')
const CheckPermission = require('../../middlewares/rbac.middleware')
const ValidateRequest = require('../../middlewares/validate-request-middleware');
const cartCtrl = require('./cart.controller')
const {addToCartSchema} = require('./cart.validator')

const router = require('express').Router()

router.post('/add', 
CheckLogin,
CheckPermission(['customer', 'admin']),
ValidateRequest(addToCartSchema),
cartCtrl.addToCart
)

module.exports = router