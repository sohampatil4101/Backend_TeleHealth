const express = require('express')
const Doctor = require('../models/Doctor')
const docinfo = require('../models/doctorinfo/docinfo')
const appoinment = require('../models/appoinment/Appoinment')
const review = require('../models/review/review')
const router = require('express').Router();
const {body, validationResult} = require('express-validator')
const prescription = require('../models/prescription')
const user = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const fetchdoctor = require('../middleware/fetchdoctor');
const JWT_SECRET = 'masknxanxlanla';

const validate = [
    body('name', 'Enter a valid name').isLength({min:3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'password must be atleast 5 characters and alphanumeric').isLength({min:5}).isAlphanumeric(),
]


// Route 1 to create user
router.post('/', validate, async (req, res) =>{
    let success = false
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success, error:"Enter a strong password", errors: errors.array()})
    }
    
    try {
            // check wheather user exist!!
            let doctor = await Doctor.findOne({email: req.body.email});
            if(doctor){
        return res.status(400).json({success, error: "sorry doctor with these email exist"})
    }
    else{
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt)
        doctor = await Doctor.create({
            name : req.body.name,
            email : req.body.email,
            password : hashpassword
        })
        const data = {
            doctor:{
                id: doctor.id
            }
        }
        const jwtdata = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, jwtdata})
    }
    
}    
    
    catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured")
    }
    
    
})


// Authentication a user and his password
// Route 2 to authenticate user

router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'password cannont be blank').exists()], 
    async (req, res) =>{
        let success = false
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(404).json({errors: errors.array()})
        }

        const{email, password} = req.body;
        try {
            const doctor = await Doctor.findOne({email});
            if(!doctor){
                return res.status(400).json({success, error: "Please try to login with correct cridentials"})
            }
            const passwordcompare = await bcrypt.compare(password, doctor.password);
            if(!passwordcompare){
                return res.status(400).json({success, error: "Please try to login with correct cridentials"})
            }
            
        const data = {
            doctor:{
                id: doctor.id
            }
        }
        const jwtdata = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success, jwtdata})
        } 
        
           
        catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error occured")
    }
    }
    )


    // Route to update doctor info
  router.post('/doctorinfo', fetchdoctor, async (req, res) =>{
        
    try {
        const user = await docinfo.create({
            doctor: req.doctor.id,
            uniqueid : req.body.uniqueid,
            specialization : req.body.specialization,
            yrofgraduation : req.body.yrofgraduation,
            experience : req.body.experience,
            type : req.body.type,
            location : req.body.location,
            about : req.body.about,
            fees : req.body.fees,
            govno : req.body.govno,
            number : req.body.number
        })
        
        success = true
        res.json({success})
    
    
}    
    
    catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured")
    }
    
    
})





// route for doc to fetch all his appoinment
router.get('/fetchallappoinments', fetchdoctor, async(req, res) =>{
    try {
        const notes = await appoinment.find({doctor: req.doctor.id}).populate('user');
        res.json(notes)
    } catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")
    }
})



// route for doc to fetch all doctors
router.post('/fetchdoctor', fetchuser, async(req, res) =>{
    try {
        const notes = await docinfo.find({doctor:req.body.doctor});
        res.json(notes)
    } catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")
    }
})





router.get('/getreviews', fetchuser, async(req, res) =>{
    try {
        const notes = await review.find({doctor: req.user.id});
        res.json(notes)
    } catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")
    }
})

router.post('/searchuser', fetchuser, async(req, res) => {
    try {
        const regex = new RegExp("^" + req.body.name, "i");
        const users = await user.find({ name: regex });

        res.json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occurred");
    }
});


router.post('/postprescription', fetchdoctor, async (req, res) => {
    try {
        const user = await prescription.create({
            doctor: req.doctor.id,
            user: req.body.userid,
            title: req.body.title,
            prescription: req.body.prescription
        });
        const success = true;
        res.json({ success });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occurred");
    }
});






module.exports = router