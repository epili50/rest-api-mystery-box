const { Schema, model } = require("mongoose");


const couponSchema = new Schema({
    coupon_code: {
        type: String
    },

    expiration_date:{
        type: Date
    },

    reward:{
        type: String
    }
});

const Coupon = model('Coupon', couponSchema);

module.exports = Coupon;