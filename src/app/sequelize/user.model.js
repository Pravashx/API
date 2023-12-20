const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../../config/sequelize.config')
const UserModel = sequelize.model("User", {
    id: {
        type: DataTypes.BIGINT
    },
    name: {
        type: DataTypes.STRING,
        min: 50,
        require: true
    },
    email: {
        type: DataTypes.STRING,
        min: 150,
        require: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        min: 100
    },
    status: {
        type: DataTypes.ENUM,
        enum: ["active", "inactive"],
        default: "inactive"
    }
},{
    sequelize
})
module.exports = UserModel