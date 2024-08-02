const db = require('../config/db');
const { allSessions } = require('../middleWare/whatsappSession');
const { MessageMedia } = require('whatsapp-web.js');

exports.send = async (data) => {
    let message = data.body.message;
    let recipient = data.body.to;
    let client = allSessions(data.id);
    var fileURL = ''
    if(data.body.filePathURL !== ''){
        fileURL = encodeURI(data.body.filePathURL);
    }

    try {
    
        const key = data.key;
        const sql = "SELECT `insid` FROM instances WHERE api_key =?";
        db.query(sql, [key], async (err, result) => {
            if (err) return console.error(err);
            if (result.length > 0 && result[0].insid === data.id) {
                const id = result[0].insid;
                const to = recipient + "@c.us";
                console.log("Sending API message to " + to);
                const options = { "unsafeMime": true };
                const optionMsg = {linkPreview: false}
                if(fileURL !== ''){
                    try {
                        const media = await MessageMedia.fromUrl(fileURL, options);
                        const msgResult = await client.sendMessage(to, message, { media: media });
    
                        if (msgResult) {
                            console.log("API message sent");
                        } else {
                            console.log('API message not sent');
                        }
                    } catch (mediaError) {
                        console.error("Failed to create media from URL: ", mediaError.message);
                    }
                }else{
                    
                    const msgResult = await client.sendMessage(to, message, optionMsg);

                    if (msgResult) {
                        console.log("API message sent");
                    } else {
                        console.log('API message not sent');
                    }
                }
            } else {
                console.log("No Instance Found");
            }
        });
    } catch (error) {
        console.error("Unable to send message", error);
        return { message: "Unable to send message", error };
    }
};
