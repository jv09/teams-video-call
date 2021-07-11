const mongoose = require ('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String
    },
    username: {
        type: String
    },
    roomId: {
        type: String
    },
    // room: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Room'
    // }]
}, {
    timestamps: true
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
