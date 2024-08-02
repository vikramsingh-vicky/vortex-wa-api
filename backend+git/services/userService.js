const db = require("../config/db");
const { promisify } = require('util');
const queryAsync = promisify(db.query).bind(db);

exports.getUserById = async (userId) => {
    try {
        // console.log('Fetching user by ID:', userId);
        const sql = `SELECT uuid, insID, name, username, email, mobile, avatar, mem_type, created_at FROM users WHERE uuid = ?`;
        const result = await queryAsync(sql, [userId]);
        
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Database query error");
    }
};

exports.fetchWhatsappInstance = async (id) => {
    try {
        // console.log('Fetching instances by ID:', id);
        const sql = `SELECT * FROM instances WHERE uuid = ?`;
        const results = await queryAsync(sql, [id]);
        if(results.length > 0){
            // console.log(results[0])
            results.forEach(row => {
                var tDays = (new Date() - new Date(row.created_at))/1000/60/60/24;
                // console.log(tDays)
                if(tDays > 3 && row.trial === 1){
                    const sql1 = `UPDATE instances SET status = 'Trial Expired', trial = 0, authenticated = 0 WHERE insid = ?`;
                    db.query(sql1, [row.insid], async (err, res) => {
                        if (err) throw err;
                        // console.log(res)
                    })
                }
            });
            return {
                message: "Instance Found",
                result: results
            }
        } else{
            return {message: "Instance not found"}
        }
        

    } catch (error) {
        console.error(error);
    }
};