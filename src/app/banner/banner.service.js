const BannerModel = require('./banner.model')

class BannerService{
    transformCreateRequest = (request) =>{
        let data = {
            ...request.body
        }
        if(!request.file){
            throw{code: 400, message: "Image is required", result: data}
        }else{
            data.image = request.file.filename
        }

        data.createdBy = request.authUser._id;
        return data;
    }

    storeBanner = async (payload) =>{
        try{
            let banner = new BannerModel(payload)
            return await banner.save()
        }catch(exception){
            throw exception
        }
    }

    listAllData = async(filter = {}, paging = {offset: skip, limit:15}) =>{
        try{
            let list = await BannerModel.find(filter)
                            .populate('createdBy', ['_id', 'name', 'email', 'role'])
                            .sort({_id: 1})
                            .skip(paging.offset)
                            .limit(paging.limit)
            return list;
        }catch(exception){
            throw exception
        }
    }

    countData = async(filter = {}) => {
        try {
            let count = await BannerModel.countDocuments(filter);
            return count;
        } catch(exception) {
            throw exception
        }
    }
}

const bannerSvc = new BannerService()
module.exports = bannerSvc

