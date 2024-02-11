const express = require('express')
const Doctor = require('../models/Doctor')
const router = require('express').Router();
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'masknxanxlanla';

const validate = [
    body('uniqueid', 'Enter a valid uniqueid').isLength({min:3}),
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
            uniqueid : req.body.uniqueid,
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


    // Route 3 to get user details


    router.post('/getuser', fetchuser,async (req, res) =>{
        try {
             userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)
        } 
    
        catch (error) {
            console.log(error.message)
            res.status(500).send("Internal server error occured")
        }
        
    })

module.exports = router