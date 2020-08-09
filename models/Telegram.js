const mongoose = require('mongoose');

const TelegramSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Telegrams', TelegramSchema);