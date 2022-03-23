//modèle utilisateur
//valeur unique assure que deux utilisateurs n'aient pas le même e-mail
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type : String, required : true, unique : true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);