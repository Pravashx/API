const UserModel = require('../user/user.model')
const PATModel = require('./personal-access-token.model')

require("dotenv").config()
class AuthService{
    registerEmailMessage(name, token) {
        // TODO: DB table msg
        return `
                    <b>Dear ${name}</b><br/>
                    <p>Your account has been successfully registerd. Please copy or click the link below to activate your account: </p>
                    <a href="${process.env.FRONTEND_URL}/activate/${token}">
                        ${process.env.FRONTEND_URL}/activate/${token}
                    </a><br/>
                    <p>
                        <b>Regards</b>
                    </p>
                    <p>
                        <b>System Admin</b>
                    </p>
                    <p>
                        <em><small>Please do not reply to this email.</small></em>
                    </p>
                `
    }

    forgetPasswordMessage(name, token) {
        // TODO: DB table msg
        return `
                    <b>Dear ${name}</b><br/>
                    <p>Please check the link below for resetting your password: </p>
                    <a href="${process.env.FRONTEND_URL}/set-password/${token}">
                        ${process.env.FRONTEND_URL}/set-password/${token}
                    </a><br/>
                    <p>
                        <b>Regards</b>
                    </p>
                    <p>
                        <b>System Admin</b>
                    </p>
                    <p>
                        <em><small>Please do not reply to this email.</small></em>
                    </p>
                `
    }

    registerUser = async (payload) =>{
        try{
            let user = new UserModel(payload)
            let response = await user.save();
            return response;
        }catch(exception){
            throw exception
        }
    }
    
    getuserByFilter = async(filter) =>{
        try{
            let userDetail = await UserModel.findOne(filter)
            return userDetail;
        }catch(exception){
            throw exception
        }
    }

    storePAT = async (data)=>{
        try{
            let patObj = new PATModel(data)
            return await patObj.save()
        }catch(exception){
            throw exception
        }
    }

    getPatByToken = async(token)=>{
        try{
            let patData = await PATModel.findOne({
                token: token
            })
            return patData;
        }catch(exception){
            throw exception
        }
    }

    deletePatData = async(token)=>{
        try{
            let deleted = await PATModel.findOneAndDelete({
                token: token
            })
            if(deleted){
                return deleted
            }else{
                throw{code: 404, message: "Token does not exists"}
            }
        }catch(exception){

        }
    }

    updateUser = async(filter, data) =>{
        try{
            let response = await UserModel.updateOne(filter,{
                $set: data
            })
            return response;
        }catch(exception){
            throw exception;
        }
    }

}

const authSvc = new AuthService()

module.exports = authSvc;