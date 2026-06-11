const validator = require("validator");
const valiadateSignUpData = (req) => {
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
module.exports = {
    valiadateSignUpData
};