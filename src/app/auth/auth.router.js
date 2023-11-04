const router = require('express').Router()
const authCtrl = require('./auth.controller')
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request-middleware');
const CheckLogin = require('../../middlewares/auth.middleware')
const { registerSchema, passwordSchema, loginSchema } = require('./auth.validator');
const CheckPermission = require('../../middlewares/rbac.middleware');


const dirSetup = (req, res, next)=>{
    req.uploadDir = "./public/uploads/users";
    next()
}

// Auth and Authorization routes 
router.post('/register',dirSetup, uploader.single('image'),ValidateRequest(registerSchema), authCtrl.register)
router.get('/verify-token/:token', authCtrl.verifyToken)
router.post('/set-password/:token', ValidateRequest(passwordSchema),authCtrl.setPassword)

router.post('/login', ValidateRequest(loginSchema),authCtrl.login)

// Loggedin All user roles
router.get('/me', CheckLogin, authCtrl.getLoggedInUser)

// Only Admin Users
router.get('/admin', CheckLogin, CheckPermission('admin'),(req, res, next)=>{
    res.send("I am admin role")
})
router.get('/admin-seller', CheckLogin, CheckPermission(['admin', 'seller']),(req, res, next)=>{res.send("I am called by admin or seller")})

router.get('/refresh-token', CheckLogin, (req, res, next)=>{})

router.get('/forget-password',authCtrl.forgetPassword)
router.post('/logout', CheckLogin, (req, res, next)=>{})

module.exports = router;