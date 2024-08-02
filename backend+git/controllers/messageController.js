const messageService = require('../services/messageService');


exports.send = async (req, res) => {
    try {
        const data = {body:req.body, id:req.query.insid, key:req.headers['key']}
        const message = await messageService.send(data);
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};