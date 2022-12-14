const teacherModel = require('../model/teacherModel')

const isUserAuthorised = async (req,res,next) => {
    let teacherId = req.param.teacherId

    let isTeacherPresent = await teacherModel.find(teacherId)
    console.log(isTeacherPresent)
    if(!isTeacherPresent) return res.status(404).send({statu:false,message :"Teacher does not exist"})

    let teacherLogin = req.headers.teacherId

    if(teacherLogin !== teacherId){
        return res.status(403).send({statu:false,message:"You are not authorised"})
    }

    next();
};

module.exports = isUserAuthorised