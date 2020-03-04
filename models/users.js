//Require Mongoose
const mongoose = require('mongoose');

//Define Mongo
const userSchema = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	username: String,
	email: String,
	password: String,

	});

module.exports = mongoose.model('User', userSchema);