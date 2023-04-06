const express= require('express')
const app = express()
const mongoose = require('mongoose')
const POST = process.env.PORT||5000
const {MONGOURI} = require('./config/keys')

//mA18CAARr3u5hVNC
//connect to database
mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true 
})
mongoose.connection.on('connected', () => {
    console.log('Connected')
})
mongoose.connection.on('error', (err) => {
    console.log('Error', err)
})

//requiring the scehmas present in database
require('./models/user')
require('./models/post')


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){               //if deployed then serve static files
    app.use(express.static('client/build'))            
    const path = require('path')
    app.get("*",(req, res)=>{                        //if client makes any request,send index.html file
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}                    

app.listen(POST)