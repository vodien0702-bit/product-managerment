const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

module.exports.uploadImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier
                .createReadStream(req.file.buffer)
                .pipe(stream);
        });

        req.body[req.file.fieldname] = result.secure_url;

        next();
    } catch (error) {
        next(error);
    }
};