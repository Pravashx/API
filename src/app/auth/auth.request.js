const { generateRandomString } = require('../../config/helpers');
class AuthRequest {
    body;
    file;
    files;

    constructor(req) {
        this.body = req.body
        this.file = req.file
        this.files = req.files
    }

    transformRequestData = () => {
        let payload = this.body;

        // FILE
        // let file = req.file
        // payload.image = file.filename;

        // FILES
        if (this.file) {
            payload.image = this.file.filename;
        } else if (this.files) {
            payload.image = this.files.map((item) => item.filename)
        }

        payload.status = "inactive";
        payload.token = generateRandomString();
        return payload
    }
}
module.exports = AuthRequest