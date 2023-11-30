const { deleteFile } = require("../../config/helpers");
const bannerSvc = require("./banner.service");
const fs = require('fs')

class BannerController{

    bannerCreate =async (req, res, next)=>{
        try{
            const payload = bannerSvc.transformCreateRequest(req);
            const created = await bannerSvc.storeBanner(payload);
            res.json({
                result: created,
                message: "Banner Created Succesfully",
                metal: null
            })
        }catch(exception){
            next(exception)
        }
    }
    listAllBanners = async (req, res, next) =>{
        try{
            let filter = {};
            if(req.query['search']){
                filter={
                    $or: [
                        {title: new RegExp(req.query['search'], 'i')},
                        {url: new RegExp(req.query['search'], 'i')},
                        {status: new RegExp(req.query['search'], 'i')}
                    ]
                }              
            }
            filter = {
                $and: [
                    {createdBy: req.authUser._id},
                    {...filter}
                    ]
            }

            // SELECT

            let page = req.query['page'] || 1;
            let limit = req.query['limit'] || 15;

            let total = await bannerSvc.countData(filter)

            let skip = (page-1)*limit

            let list = await bannerSvc.listAllData(filter, {offset: skip, limit:limit})
            res.json({
                result: list,
                message: "Banner Fetched Successfully",
                meta: {
                    total: total,
                    currentPage: page,
                    limit: limit
                }
            })
        }catch(exception){
            next(exception)
        }
    }
    getDataById = async (req, res, next) =>{
        try{
            let id = req.params.id;
            let data = await bannerSvc.getById({
                _id: id,
                createdBy: req.authUser._id
            })
            res.json({
                result: data,
                message: "Banner Fetched",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
    updateById = async(req, res, next)=>{
        try{
            const bannerId = req.params.id;
            const banner = await bannerSvc.getById({
                _id: bannerId,
                createdBy: req.authUser._id
            })
            // Update Operation
           const payload = bannerSvc.transformEditRequest(req)
           let oldImage = payload.image
           if(!oldImage || oldImage === ''){
            oldImage = banner.image
           }
           const oldBanner = await bannerSvc.updateById(bannerId, {...payload, image: oldImage})

           if(payload.image){
            // Delete old Img
            deleteFile("./public/uploads/banner/", oldBanner.image)
           }
           res.json({
            result: oldBanner,
            message: "Banner Updated Sucessfully",
            meta: null
           })
        
        }catch(exception){
            next(exception)
        }
    }
    deleteById = async( req, res, next)=>{
        try{
            let bannerId = req.params.id;
            await bannerSvc.getById({
                _id: bannerId,
                createdBy: req.authUser._id
            })
            let deleteBanner = await bannerSvc.deleteById(bannerId)
            if(deleteBanner.image){
                deleteFile('./public/uploads/banner/', deleteBanner.image)
            }
            res.json({
                result: deleteBanner,
                message: "Banner Deleted Successfully",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
    listHome = async (req, res, next)=>{
        try{
            let response = await bannerSvc.listAllData({
                status: "active",
                // startDate: {$lte: new Date()},
                // endDate: {$gte: new DataTransfer()}
            }, {offset: 0, limit:10}, {
                sort: {_id: "DESC"}
            })
            res.json({
                result: response,
                message: "Banner Fetched",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
}

const bannerCtrl = new BannerController()

module.exports = bannerCtrl