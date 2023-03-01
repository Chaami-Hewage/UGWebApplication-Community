const { s3 } = require("../config/aws-config");

exports.deleteImage = (item, folder) => {
    let filename;

    if (item.content) {
        filename = item.content.split(folder + "/")[1];
    }

    if (item.profile_picture_location) {
        filename = item.profile_picture_location.split(folder + "/")[1];
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: folder + "/" + filename,
    };

    s3.deleteObject(params, (error, data) => {
        if (error) {
            throw new Error(error);
        }
    });
};