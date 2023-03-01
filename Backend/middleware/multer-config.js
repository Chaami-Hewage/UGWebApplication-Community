// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.AWS_BUCKET_NAME,
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             const extension = MIME_TYPES[file.mimetype];
//             if (req.baseUrl == "/api/user") {
//                 cb(null, "profil_picture/" + uuid.v4() + "." + extension);
//             } else if (req.baseUrl == "/api/post") {
//                 cb(null, "post_picture/" + uuid.v4() + "." + extension);
//             } else {
//                 cb(null, "comment_picture/" + uuid.v4() + "." + extension);
//             }
//         },
//     }),
//     fileFilter: (req, file, callback) => {
//         if (MIME_TYPES.hasOwnProperty(file.mimetype)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Invalid mime type"));
//         }
//     },
// });


//------------------------------------------
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const uuid = require("uuid");
//
// const { s3 } = require("../config/aws-config");
//
// const MIME_TYPES = {
//     "image/jpg": "jpg",
//     "image/jpeg": "jpg",
//     "image/png": "png",
//     "image/gif": "gif",
// };
//
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
//     }
// });
//
// const upload = multer({ storage: storage })
//
// const multerUpload = (req, res, next) => {
//     upload.single('image')(req, res, (err) => {
//         if (err) {
//             res.status(500).json({error: err.message});
//         } else {
//             next();
//         }
//     });
//     console.log(req.body)
// }
//
// module.exports = multerUpload;
//------------------------------------------

const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid");
const { Pool } = require('pg');
const pool = new Pool({
    user: 'UGWebapplication',
    host: 'ugwebapplication.ct4zszzqkuph.ap-northeast-1.rds.amazonaws.com',
    database: 'communityDB',
    password: 'Powerseekers',
    port: 5432, // replace with your port number
});

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage, limits: { fileSize: 5000000 } })

const multerUpload = (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            const { mimetype, buffer } = req.file;
            const extension = MIME_TYPES[mimetype];
            const filename = `${uuid.v4()}.${extension}`;
            try {
                const query = {
                    text: 'INSERT INTO files (filename, mimetype, data) VALUES ($1, $2, $3)',
                    values: [filename, mimetype, buffer],
                };
                await pool.query(query);
                req.file = { filename: filename };
                next();
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to upload file to database' });
            }
        }
    });
}

module.exports = multerUpload;
