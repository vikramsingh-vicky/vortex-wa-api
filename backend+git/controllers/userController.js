const userService = require('../services/userService');

exports.fetchUser = async (req, res) => {
    // console.log('User ID from middleware:');
    // console.log(req)

    try {
        const userId = req.user.id; // User ID from the middleware
        const user = await userService.getUserById(userId);
        res.json(user);
    } catch (error) {
        res.status(500).send("Server Error");
    }
};
