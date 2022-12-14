const express = require('express')
const route = express.Router()
const teacherController = require('../controller/teacherController')
const studentController = require('../controller/studentController')

const authentication = require('../Middleware/authentication')
const Authorization = require('../Middleware/authorization')

//-----------------------------API FOR TEACHER REGISTRATION----------------------------------------------------------
route.post('/teacherRegistration',teacherController.createTeacher)

// ----------------------------API FOR TEACHER LOGIN------------------------------------------------------------------
route.post('/teacherLogin',teacherController.teacherLogin)

// ----------------------------API FOR VIEW TEACHER DETALIES-------------------------------------------------------------
route.get('/teacher/:teacherId',authentication,teacherController.getTeacherById)

// ----------------------------API FOR STUDENT REGISTRATION----------------------------------------------------------
route.post('/studentRegistration',authentication,studentController.createStudent)

// ----------------------------API FOR VIEW STUDEN BY FILTER------------------------------------------------------------------
route.get('/students',authentication,Authorization,studentController.getStudent)

// ----------------------------API FOR VIEW STUDENT DETAIL BY STUDENT ID------------------------------------------------------------------
route.get('/student/:studentId',authentication,Authorization ,studentController.getStudentById)

// ----------------------------API FOR UPDATE STUDENT INFORMATION-----------------------------------------------------
route.put('/student/:teacherId',Authorization,authentication ,studentController.updateStudent)

// ----------------------------API FOR DELEAR STUDENT BY STUDENT ID ------------------------------------------------------------------
route.delete('/student/:studentId',Authorization,authentication,studentController.deleatByid)
module.exports = route
