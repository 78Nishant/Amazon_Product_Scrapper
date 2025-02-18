
const express=require('express');
require('dotenv').config()
const routes=require('./routes/api.routes');

const app=express();

//Middleware
app.use(express.json());
app.use('/',routes.router);

//Running the Server
const port=process.env.PORT

app.listen(port,()=>{
    console.log('Server is running on port '+port);
})


