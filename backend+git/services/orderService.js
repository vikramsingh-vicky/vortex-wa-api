const Razorpay = require('razorpay');

exports.createOrder = async (orderData) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const options = {
            amount: orderData.amount,
            currency: 'INR',
            receipt: orderData.receipt,
            payment_capture: 1
        };
        const order = await razorpay.orders.create(options);

        if (!order) {
            return { message: "Unable to create order" };
        } else {
            return { message: "Order Created", result: order };
        }
    } catch (error) {
        throw new Error(error);
    }
};
