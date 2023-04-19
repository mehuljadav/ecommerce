const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please enter your name!'],
      trime: true,
   },
   email: {
      type: String,
      required: [true, 'Please enter email address!'],
      unique: true,
      trime: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
   },
   gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Please enter a gender type!'],
   },
   password: {
      type: String,
      required: [true, 'Please enter a password!'],
      minLength: [6, 'Password must be longer then 6 character!'],
      select: false,
   },
   passwordConfirm: {
      type: String,
      required: [true, 'Please enter a compare password!'],
      validate: {
         validator: function (pc) {
            // if passwords are same then return true
            return pc === this.password;
         },
         message: `Password doesn't match!`,
      },
   },
   avatar: {
      public_id: {
         type: String,
      },
      url: {
         type: String,
      },
   },
   role: {
      type: String,
      default: 'user',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   resetPasswordToken: String,
   resetPasswordExpire: String,
});

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   this.password = await bcrypt.hash(this.password, 12);
   this.passwordConfirm = undefined;
   next();
});

userSchema.methods.comparePassword = async function (enteredPassword, userPassword) {
   return await bcrypt.compare(enteredPassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
