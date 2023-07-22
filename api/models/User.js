const mongoose = require('mongoose');
const {Schema , model} = mongoose;

// Create UserSchema
const  UserSchema = new Schema({
    username: {type:String, required:true, minlength:4, unique:true},
    password: {type:String, required:true},
}); 

// Create model using UserSchema
const UserModel = model('User',UserSchema);

// export (UserModel) to use it in index.js
module.exports = UserModel;