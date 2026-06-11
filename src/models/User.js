const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20
  },

  lastname: {
    type: String
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    min: 18
  },

  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender Data is not valid");
      }
    }
  },

  photoUrl: {
    type: String,
    default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png"
  },

  about: {
    type: String,
    default: "This is a default about section."
  },

  skills: {
    type: [String]
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email format");
      }
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
  next();
});

userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@COM$790", { expiresIn: "1h" });
  return token;
};

userSchema.methods.validatePassword = async function(password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

module.exports = mongoose.model("User", userSchema);