require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { PORT = 3000, DATABASE_URL } = process.env
const app = express()

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true

})

mongoose.connection
    .on("open", () => console.log('You are connected to mongoose'))
    .on("close", () => console.log('You are disconnected from mongoose'))
    .on("error", (error) => console.log(error))


const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema)


//midleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())



// ROUTES



app.get('/', (req, res) => {
    res.send("hello world")
})



app.get('/people', async (req, res) => {
    try {                       
        res.json(await People.find({}))
    } catch {
        res.status(400).json(error)
    }
})

//create
app.post('/people', async (req, res) => {
        try{
            res.json(await People.create(req.body))
        }catch(error){
            res.status(400).json(error)
        }
})


//update
app.put('/people/:id', async (req, res) => {
    try{
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    }catch(error){
        res.status(400).json(error)
    }
})


//delete
app.delete('/people/:id', async (req, res) => {
    try{
        res.json(await People.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})


//find by id 
app.get('/people/:id', async (req, res) => {
    try{
        res.json(await People.findById(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})