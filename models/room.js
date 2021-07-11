const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    users: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ]
},{
    timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;