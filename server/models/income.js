const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        tag: {
            type: String,
            required: true,
            enum: ['salary', 'bonus', 'gift', 'other'],
        },
        currency: {
            type: String,
            required: true,
            enum: ['ILS', 'USD', 'EUR'],
        },
        originalAmount:{
            type:Number,
            default:0,
            required:true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);