const db = require("../config/db-config");

// exports.isAdmin = (req, res, next) => {
//     db.query(
//         `
//             SELECT
//                 *
//             FROM users
//             WHERE users_id = ?
//         `,
//         [req.auth],
//         (error, result) => {
//             if (error) {
//                 res.status(500).json({ error });
//             } else {
//                 if (result[0].role_id !== 3) {
//                     req.role = true;
//                     next();
//                 } else {
//                     req.role = false;
//                     next();
//                 }
//             }
//         }
//     );
// };

exports.isAdmin = (req, res, next) => {
    db.query(
        `
            SELECT 
                *
            FROM users
            WHERE users_id = $1
        `,
        [req.auth],
        (error, result) => {
            if (error) {
                res.status(500).json({ error });
            } else {
                if (result.rows[0].role_id !== 3) {
                    req.role = true;
                    next();
                } else {
                    req.role = false;
                    next();
                }
            }
        }
    );
};
