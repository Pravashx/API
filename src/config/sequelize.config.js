const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    "mern-24",
    'postgres',
    "2006115pravash",
    {
        host: "localhost",
        port: 5432,
        dialect: "postgres"
    }
)

const testConnnction = async ()=>{
    try{
        await sequelize.authenticate()
        console.log("PG Server Connected Sir....")
    }catch(exception){
        console.log("PG Server connection error")
        console.log(exception)
    }
}
testConnnction()

module.exports = {sequelize}