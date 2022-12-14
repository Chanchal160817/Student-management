const studentModel = require('../model/studentModel')
const teacherModel = require('../model/teacherModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const saltRound = 10 
const { isValid , isValidName , isValidEmail , isValidPassword} = require("../Validation/validation")
const { isValidObjectId } = require('mongoose')

const createTeacher = async (req, res) => {
  try {
    let body = req.body
    if(Object.keys(body).length==0) return res.status(400).send({status:false , message:"Provide require field"})

    const { name, email, password } = body

    if(!name) return res.status(400).send({status:false , message:"Name  is mandatory"})
    if(!isValidName(name)) return res.status(400).send({status:false,message:"Please Enter Valid Name"})
    if(!email ) return res.status(400).send({status:false , message:"Email is mandatory"})
    if(!isValidEmail(email)) return res.status(400).send({status:false,message:"Please Enter Valid Email"})
    let emailAlreadyExist = await teacherModel.findOne({email:email})
    if(emailAlreadyExist) return res.status(400).send({status:false, message:"Email Already Exist "})
    if(!password) return res.status(400).send({status:false , message:"Password is mandatory"})
    if(!isValidPassword(password)) return  res.status(400).send({status:false, message:"Please Enter password contain atleast one upperCase , one lowerCase , one number ,one special character . password should have minimum 8 and max 15 character"})

    let salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
    // let encryptedPassword = bcrypt
    //         .hash(req.body.password, saltRound)
    //         .then((hash) => {
    //             // console.log(`Hash: ${hash}`);
    //             return hash;
    //         });
    //     req.body.password = await encryptedPassword;
    const teacher = await teacherModel.create(body)
    res.status(201).send({ status: true, message: "Teacher Created Sucessfully", data: teacher })
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

const teacherLogin = async (req, res) => {
  try {
    let body = req.body
    if(Object.keys(body).length==0) return res.status(400).send({status:false,message:"Require field is mandatory"})
    const { email, password } = body
    if(!email ) return res.status(400).send({status:false , message: "Email  field is mandatory"})
    if(!password) return res.status(400).send({status:false , message: "Password  field is mandatory"})
    const teacher = await teacherModel.findOne({ email : email })
    
    if (!teacher)  return res.status(404).send({status:false , message : "Not a registered email"})
    
    let decodePwd = await bcrypt.compare(password,teacher.password)
    if (!decodePwd) return res.status(404).send({status:false,message:"Password not match"})

    const token = jwt.sign({
      userId: teacher._id.toString(),
      batch: "TailWebs",
    }, "this is a secret key",
      { expiresIn: "50d" })

    res.setHeader("x-api-key", token)

    res.status(200).send({ status: true, message: "Teacher Login Sucessfully ", data: { userId : teacher._id,token: token } })


  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

const getTeacherById = async (req, res) => {
  try {
    let id = req.params.teacherId
    if(!id) return res.status(404).send({ status: false, message:"Teacher id require in param "})
    
    if(!isValidObjectId(id)) return res.status(400).send({status:false,message:"Teacher by this id is not present"})


    const teacher = await teacherModel.findOne({ _id: id })
    res.status(200).send({ status: true, message: "Teacher Found Sucessfully", data: teacher })
  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}
module.exports = { createTeacher, teacherLogin, getTeacherById }