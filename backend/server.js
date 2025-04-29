const express = require('express')
const app = express()
const http = require('http')
const bodyParser = require('body-parser')
const mongoose = require('mongoose') //mongo db library
const cors = require('cors') //Cors will let us accept cross origin request from our frontend to backend.
const dotenv = require('dotenv') //for keep secret and non shareable properies
// const multer = require('multer') //Multer is a middleware that will let us handle multipart/form data sent from our frontend form.
const morgan = require('morgan') //used to log information of each request that server receives.
// var forms = multer();
// const config = require('./config');
// const Grid = require('gridfs-stream');

const server = http.createServer(app)

//api configuration
app.use(express.json({extended : true}))
app.use(express.urlencoded({extended : true}))
// app.use(forms.array()); 
app.use(bodyParser.json({limit : '30mb', extended : true}))
app.use(bodyParser.urlencoded({limit : '30mb', extended : true}))
app.use(morgan("common"))
dotenv.config()

//allow cross origin policy
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(function(req, res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
});

//item_function api
const itemRoutes = require('./routes/item_route')
app.use('/api',itemRoutes);

//doctor_function api
const doctorRoutes = require('./routes/doctor_route')
app.use('/doctor_api',doctorRoutes);

//appointment_function api
const appointmentRoutes = require('./routes/appointment_route')
app.use('/appointment_api',appointmentRoutes);

//user management function api(owner)
const userRoutes = require('./routes/UserManagement_route')
app.use('/user_api',userRoutes);

//pet management system api
const petRoutes= require('./routes/pet_route')
app.use('/pet_api',petRoutes);

//caged pets management system api
const cagedpets = require('./routes/cagedPet_routes')
app.use('/cagedPets_api',cagedpets);

//medical record management system api
const medicalRecords = require('./routes/mrecord_route')
app.use('/medicalRecord_api',medicalRecords);

//admin routes
const adminRoutes = require('./routes/Admin_routes')
app.use('/AdminAuth',adminRoutes)



//mongo setup
const PORT = process.env.PORT
mongoose.set('strictQuery', true)
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {console.log(`server running on port ${PORT}`);})
    })
    .catch((err) => {console.log(err);})
