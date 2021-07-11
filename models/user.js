const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    email: String,
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ]

}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);

module.exports = User;