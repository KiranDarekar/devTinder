const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is not valid !!!");
    } else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password");
    }
};

const validateEmailId = (req) => {
    const { emailId } = req.body;

    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
}

const validateEditProfileData  = (req) => {
        const ALLOWEDUPDATES = [
            "age",
            "gender",
            "photoUrl",
            "skills",
            "about",
        ];
        const isUpdateAllowed  = Object.keys(req.body).every((k) => ALLOWEDUPDATES.includes(k) );
        console.log('isUpdateAllowed -', !isUpdateAllowed);

        if(!isUpdateAllowed){
            throw new Error("invalid payload info request");
        }
        console.log('skills ', req.body?.skills?.length);
        if(req.body?.skills?.length > 10){
            throw new Error("you can not add more data");
        }
        return isUpdateAllowed;
}
module.exports = {
    validateSignUpData,
    validateEmailId,
    validateEditProfileData
}