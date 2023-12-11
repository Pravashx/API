class CartController{
    addToCart = async(req, res, next)=>{
        try{
            const {productId, qty} = req.body
            const product = await productSvc
        }catch(exceptioin){
            next(exceptioin)
        }
    }
}

const cartCtrl = new CartController
module.exports = cartCtrl