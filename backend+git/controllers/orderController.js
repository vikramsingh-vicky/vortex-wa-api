const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
