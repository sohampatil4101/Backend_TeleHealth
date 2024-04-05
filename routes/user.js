const express = require('express')
const User = require('../models/User')
const Updateuser = require('../models/user_medi_info/UserInfo')
const Updateuserdeases = require('../models/user_medi_info/OldMedi_info')
const Docinfo = require('../models/doctorinfo/Docinfo')
const router = require('express').Router();
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
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
            let user = await User.findOne({email: req.body.email});
            if(user){
        return res.status(400).json({success, error: "sorry user with these email exist"})
    }
    else{
        const salt = await bcrypt.genSalt(10);
        hashpassword = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashpassword
        })
        const data = {
            user:{
                id: user.id
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
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({success, error: "Please try to login with correct cridentials"})
            }
            const passwordcompare = await bcrypt.compare(password, user.password);
            if(!passwordcompare){
                return res.status(400).json({success, error: "Please try to login with correct cridentials"})
            }
            
        const data = {
            user:{
                id: user.id
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




    // Route to update user profile
    router.post('/updateuser', fetchuser, async (req, res) =>{
        
        try {

            const user = await Updateuser.create({
                user: req.user.id,
                bloodgroup : req.body.bloodgroup,
                number : req.body.number,
                age : req.body.age,
                gender : req.body.gender
            })
            
            success = true
            res.json({success})
        
        
    }    
        
        catch (error) {
            console.log(error.message)
            res.status(500).send("Some error occured")
        }
        
        
    })


  // Route to update user old deases
  router.post('/updateuserdeases', fetchuser, async (req, res) =>{
        
    try {

        const user = await Updateuserdeases.create({
            user: req.user.id,
            deases : req.body.deases,
            from : req.body.from,
            consultation : req.body.consultation,
            isrecovered : req.body.isrecovered
        })
        
        success = true
        res.json({success})
    
    
}    
    
    catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured")
    }
    
    
})


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




// Route to book appoinment
router.post('/bookappoinment', fetchuser, async (req, res) =>{
        
    try {

        const user = await appoinment.create({
            user: req.user.id,
            doctor: req.body.doctor,
            date : req.body.date,
            time : req.body.time,
            customschedule : req.body.customschedule,
            package : req.body.package,
            duration : req.body.duration,
            problem : req.body.problem,
            meetcode : req.body.meetcode
        })
        
        success = true
        res.json({success})
    
    
}    

catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")
}


})


router.get('/fetchallappoinments', fetchuser, async(req, res) =>{
    try {
        const notes = await appoinment.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")
    }
})


// route for doc to fetch all doctors
router.get('/fetchalldoctors', fetchuser, async(req, res) =>{
    try {
        const notes = await Docinfo.find().populate('doctor');
        res.json(notes)
    } catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")
    }
})


// Route to post review
router.post('/postreview', fetchuser, async (req, res) =>{
        
    try {

        const user = await review.create({
            user: req.user.id,
            doctor: req.body.doctor,
            review : req.body.review,
            rating : req.body.rating
        })
        
        success = true
        res.json({success})
    
    
}    
    
    catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured")
    }
    
    
})


module.exports = router