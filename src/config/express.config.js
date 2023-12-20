const express = require('express')
const EventEmitter = require('node:events')
const app = express();
require('./db.config')
require('./sequelize.config')
const cors = require('cors')

app.use(cors())

const router = require('../router/index');
const { MulterError } = require('multer');
const {ZodError} = require('zod')
const {MongooseError} =require('mongoose')
const event = require('./event.config');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID, GraphQLInt, GraphQLFloat } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');
const categorySvc = require('../app/category/category.service');
// const { graphqlHTTP } = require('express-graphql');
// Body Parser
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/health', (req, res, next)=>{
    res.send("Success Ok")
})
app.use(event)
app.use('/api/v1', router)



const Product = new GraphQLObjectType({
    name: "Product",
    fields: { 
            _id: {type: GraphQLID},
            title: {type: GraphQLString},
            status: {type: GraphQLString},
            description: {type: GraphQLString}
            // summary: {type: GraphQLString},
            // category: {type: GraphQLString},
            // price: {type: GraphQLFloat}
    }
})

const ProductInputType = new GraphQLObjectType({
    name: "ProductInput",
    fields: {
        _id: {type: GraphQLID},
        title: {type: GraphQLString},
        status: {type: GraphQLString}
    }
})

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            products: {
                type: new GraphQLList(Product),
                resolve: async()=>{
                   let data = await categorySvc.getData({}, {limit: 10, skip: 0})
                   return data
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            createProduct: {
                args: {
                    title: GraphQLString,
                    status: GraphQLString
                },
                type: Product,
                resolve: (args)=>{
                    console.log(args)
                    return{
                        _id: "", title: "", status: ""
                    }
                }
            }
        }
    })
})

// app.use('/api/v1/graphql', graphqlHTTP({
//     schema: schema,
//     graphiql: true
// }))

// app.all('/api/v1/graphql', createHandler({
//     schema: schema
// }))



// 404 Error Handle 
app.use((req, res, next)=>{
    res.status(404).json({
        result: null,
        message: "Not Found",
        meta: null
    })
})

// Exception Handling Middleware
app.use((error, req, res, next)=>{
    console.log("GarbageCollector: ", error)
    let code = error.code ?? 500;
    let message = error.message ?? "Internal Server Error..."
    let result = error.result ?? null

    // TODO: Handle different type of exception
    if(error instanceof MulterError){
        //Handle Multer Errors
        if(error.code == 'LIMIT_FILE_SIZE'){
            code = 400;
            message = error.message
        }
    }

    // TODO: Form Validation Formatting (ZOD)
    if(error instanceof ZodError){
        code = 400;
        let msg = {}
        error.errors.map((err)=>{
            // msg.push({
            //     [err.path[0]]: err.message       (FOR msg = ARRAY)
            // })
            msg[err.path[0]]= err.message
        })
        message = "Validation Failure"
        result = msg
    }
    if(error.code === 11000){
        code = 400;
        let uniqueKeys = Object.keys(error.keyPattern)
        let msgBody = uniqueKeys.map((key) => {
            return {
                [key]: key+" should be unique"
            }
        }) 
        result = msgBody;
        message ="Validation Fail"
    }

    res.status(code).json({
        result: result,
        message: message,
        meta: null
    })
})

module.exports = app;