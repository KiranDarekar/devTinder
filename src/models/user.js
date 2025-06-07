const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        unique: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase:true,
        required:true
    },
    password: {
        type: String,
        required:true
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
        default:"https://www.planetware.com/photos-large/USNY/new-york-city-empire-state-building.jpg"
    },
    skills:{
        type:['String']
    },
    about:{
        type:String
    },
    phone: {
        type: String,
        validate: {
        validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }

}, {
    timestamps:true
});


module.exports = mongoose.model("User", userSchema);