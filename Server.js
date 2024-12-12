const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PostRouter = require("./router/PostRouter")
const { config } = require('dotenv')
const app = express()



app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
require('dotenv').config()
app.use('/coba' , PostRouter)



app.listen(process.env.SERVER_PORT, ()=>{
  console.log('server jalan',process.env.SERVER_PORT)
})


