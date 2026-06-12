const validator = require("validator");
//signupdata validation
const validateSignUpData = (req) => {
    const { firstname,lastname, email, password } = req.body;
  if (!validator.isAlpha(firstname)) {
    throw new Error("Name is not valid");
}
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password, {
        minLength: 8
    })){
        throw new Error("Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.");
    }
}

//update profile validation
const validateProfileUpdateData=(req)=>{
    const allowedEditFields=["firstname","lastname","email","isPremium","gender","age","skills"];
    const isEditAllowed=Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
    );
    return isEditAllowed;
}
module.exports = {
    validateSignUpData,
    validateProfileUpdateData
};