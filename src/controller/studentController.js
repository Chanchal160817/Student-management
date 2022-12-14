const { isValidObjectId } = require('mongoose')
const studentModel = require('../model/studentModel')
const teacherModel = require('../model/teacherModel')
const { isValid, isValidName } = require("../Validation/validation")
const createStudent = async (req, res) => {
    try {
        let body = req.body
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "Provide require field" })
        let { name, teacherId, subject, marks } = body
        // let teacherLogin =   req.validateToken.teacherId
        // console.log(teacherLogin)
        if(teacherId!= req.validateToken.userId) return res.status(400).send({status:false , message:"unautorized"})
        if (!name) return res.status(400).send({ status: false , message:"Name is mandatory"})

        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Please Enter Valid Name" })
        if(!teacherId) return res.status(400).send({status:false,message:"Teacher id is mandatory"})
        let id = req.body.teacherId
        if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Teacher By this id Not Present" })
        let teacher = await teacherModel.findById(id)
        if (!teacher) return res.status(400).send({ status: false, message: "Teacher not found" })
        
        if (!subject ) return res.status(400).send({status:false , message:" Subject is Mandatery"})
        if (!isValid(subject)) return res.status(400).send({status:false,message:"Enter Valid subject"})

        if (!["Maths", "English", "Hindi", "Science"].includes(subject)) return res.status(400).send({ status: false, msg: "Please provide subject between [Maths/ English/Hindi/ Science] "})
        if (!marks) return res.status(400).send( {status:false ,message:"Marks is mandatory"})

        let savedData = await studentModel.create(body)
        return res.status(201).send({ status: true, data: savedData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getStudent = async (req, res) => {
    try {
        let query = req.query
        if (Object.keys(query).length >0) {
            let students = await studentModel.find({ $and: [query, { isDeleted: false }] })

            if(students.length == 0 ) return res.status(404).send({ status: false, message: "Student not found" }) 
            return res.status(200).send({ status: true, message: "List of requested student", data: students })
        }
        else {
            let students = await studentModel.find({ isDeleted: false })
            if(students.length == 0 ) return res.status(404).send({ status: false, msg: "Student not found" }) 
            return res.status(200).send({ status: true, message: "List of requested student", data: students })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateStudent = async (req, res) => {
    try {
        let body = req.body;
        const { name, subject, marks } = body
        if(!name) return res.status(400).send({status:false, message:"Name is mandatory"})
        if (!isValidName(name)) return res.status(404).send({ status: false, message: "Please Enter Valid Name" })
        let updateData = await studentModel.findOne({ name: name, subject: subject })
        if (updateData) {
            let updateMarks = await studentModel.findOneAndUpdate({ name: name }, { $set: { marks: updateData.marks + marks } }, { new: true })
            return res.status(200).send({ status: true, message: "Student marks updated", data: updateMarks })
        }
        if(!subject)return res.status(400).send({status:false, message:"Please Enter Subject"})
        let createDate = await studentModel.create({name:name, subject:subject , marks:marks})
        return res.status(201).send({ status: true, message: "Student Register succesfully ", data: createDate })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getStudentById = async (req, res) => {
    try {
        let id = req.params.studentId
        if (!id) return res.status(404).send({ status: false, message: "Student id require in param " })
        let student = await studentModel.findById(id)
        if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Student by this id is not present" })
        return res.status(200).send({ status: true, data: student })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


const deleatByid = async (req, res) => {
    try {
        let id = req.params.studentId
        //  console.log(id)
        let student = await studentModel.findById(id)
        // console.log(student)
        if (!student) return res.status(404).send({ status: false, message: "Student does not exist" })

        let is_Deleted = student.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, message: "Student is already Deleted " })

        let deleteStudent = await studentModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ status: true, data: deleteStudent })

    } catch (err) {
        return res.send({ status: false, message: err.message })
    }
}
module.exports = { createStudent, deleatByid, getStudent, getStudentById, updateStudent }