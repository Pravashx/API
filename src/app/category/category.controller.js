const { deleteFile } = require('../../config/helpers')
const CategoryRequest = require('./category.request')
const categorySvc = require('./category.service')

class CategoryController {
    // 
    createCategory= async (req, res, next) => {
        try{
            let payload = (new CategoryRequest(req)).createTransform()
            const createdCat = await categorySvc.create(payload)
            res.json({
                result: createdCat,
                message: "Category Created Successfully",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
    listAllBanners = async (req, res, next)=>{
        try{    
            const {filter, pagination: {page, limit, skip}}= categorySvc.getFilter(req.query, req.authUser)
                const count = await categorySvc.countData(filter)
                const data = await categorySvc.getData(filter, {page, limit, skip})

                res.json({
                    result: data,
                    message: "Category Fetched Successfully",
                    meta: {
                        page: page,
                        total: count,
                        limit: limit
                    }
                })
            }
        catch(exception){
            next(exception)
        }
    }
    getById = async(req, res, next)=>{
        try{
            let filter = {
                _id : req.params.id,             
            }
            if(req.authUser.role !== 'root'){
                filter= {
                    ...filter,
                    createdBy: req.authUser._id
                }
            }
            let detail = await categorySvc.getById(filter)
            res.json({
                result: detail,
                message: "Category Detail fetched",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
    updateById = async (req, res, next)=>{
        try{    
            const category = req.content
            const payload = (new CategoryRequest(req)).updateTransform(category)
            const updated = await categorySvc.updateById(req.params.id, payload)
            if(payload.image && updated.image && updated.image !== payload.image){
                deleteFile('./public/uploads/category/', updated.image)
            }

            res.json({
                result: updated,
                message: "Category Updated",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
    deleteById = async(req, res, next)=>{
        try{
            let deleted = await categorySvc.deleteById(req.params.id)
            if(deleted.image){
                deleteFile('./public/uploads/category/', deleted.image)
            }
            res.json({
                result: deleted,
                message: "Category Deleted Successfully",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
}

const categoryCtrl = new CategoryController()
module.exports = categoryCtrl