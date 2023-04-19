const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({});

module.exports = mongoose.Model('User', userSchema);
