const isValid = (value) =>{
    if(typeof value == undefined || value == null||value.length ==0) return false ;
    if(typeof value == "string" && value.trim().length===0 ) return false ;
    return true ;
}

const isValidName = (name) =>{
    if(/^[A-Z][a-z]{2,}\s[A-Z][a-zA-Z]{2,}$/.test(name)) return true
    return false
}

const isValidEmail = (mail) =>{
    if(/^[a-z0-9_]{1,}@[a-z]{3,6}[.][a-z]{2,3}$/.test(mail)) return true
}

const isValidPassword = (password) =>{
    if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,15}$/.test(password)) return true 
}

module.exports = {isValid , isValidName ,isValidEmail , isValidPassword}