const mongoose  = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        unique: true,
        trim:true
    },
    lastName: {
        type: String,
        trim:true
    },
    emailId: {
        type: String,
        lowercase:true,
        required:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Please enter valid email address");
            }
        }
    },
    password: {
        type: String,
        required:true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter strong password");
            }
        }
    },
    age: {
        type: Number,
        min:[6, 'Must be at least 6, got {VALUE}'],
        max:60
    },
    gender: {
        type: String
    },
    photoUrl:{
        type:String,
        default:"https://www.planetware.com/photos-large/USNY/new-york-city-empire-state-building.jpg",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Please enter valid URL");
            }
        }
    },
    skills:{
        type:['String']
    },
    about:{
        type:String
    },
    // phone: {
    //     type: String,
    //     validate: {
    //         validator: function(v) {
    //             return /\d{3}-\d{3}-\d{4}/.test(v);
    //         },
    //         message: props => `${props.value} is not a valid phone number!`
    //     },
    //     required: [true, 'User phone number required']
    // }

}, {
    timestamps:true
});

userSchema.index({firstName:1, lastName:1});

userSchema.methods.getJWT = async function () {
    const user = this;

    // create JWT token
    const token = await jwt.sign({ _id : user._id}, "Dev@Tinder007", { expiresIn: '10h'});

    return token;
}

userSchema.methods.validatePassword = async function (passwordChangeByUser) {
    const user = this;

    // compare the user with saved password;
    const isPasswordValid = await bcrypt.compare(passwordChangeByUser, user.password);
    return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema);