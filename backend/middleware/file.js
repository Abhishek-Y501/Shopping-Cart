const multer = require("multer");
const path = require('path');

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        // cb(error, 'backend/images');
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        console.log(name + "-" + Date.now() + "." + ext)
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

module.exports = multer({ storage: storage }).single("image");
