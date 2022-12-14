const  express = require('express')
const route =  require("./route/route.js")

const moongoose = require('mongoose')

const app = express()

app.use(express.json())

moongoose.set('strictQuery', true)
moongoose.connect("mongodb+srv://Chanchal25-DB:ZHrSPQhp8HuOM2Yy@cluster0.ypi01as.mongodb.net/Backend_Task",{
    useNewUrlParser: true,
})

.then(()=>console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use('/',route)

route.all("/*", (req,res)=>{
    res.status(400).send({status:false , message:"The api you request is not available"})
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
});