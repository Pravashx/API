const UserModel = require("./user.model")

class UserSvc{
    createUser = async (data)=>{
        const userObj = new UserModel(data)
        const createdUser = await userObj.save()
    }
    
    getUserById = async(id) =>{
        const user = await UserModel.findByPk(id)
        const one = await UserModel.findOne({
            where: {
                id: id
            }
        })
    }
}