const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://darekarkiran704:VApbWPRdRjvqi3rv@kirandarekarnode.0u5nuu2.mongodb.net/devTinder');
}

module.exports = connectDb;
