// const db = require("../config/db-config");
// const bcrypt = require("bcrypt");
// const jwt = require("../utils/jwt");
// const jwtConfig = require("../config/jwt-config");
// const cache = require("../utils/cache");
//
// exports.signup = async (req, res) => {
//     const firstname = req.body.firstname.toLowerCase();
//     const lastname = req.body.lastname.toUpperCase();
//     const email = req.body.email;
//     const password = req.body.password;
//     const cryptPassword = await bcrypt.hash(password, 12);
//     if (!email || !password || !firstname || !lastname) {
//         return res.status(400).json({ error: "Please Enter informations" });
//     }
//     db.query(
//         `
//             INSERT INTO users (lastname, firstname, email, password )SELECT ?,?, ?, ?;
//             `,
//         [lastname, firstname, email, cryptPassword, email],
//         (error, results) => {
//             if (error) {
//                 if (error.errno === 1062) {
//                     return res.status(500).json({ error: "Email déjà utilisé" });
//                 }
//                 return res.status(500).json({ error: "Your request could not be completed" });
//             } else {
//                 // Verification of line creation
//                 if (results.affectedRows !== 1) {
//                     return res.status(409).json({ error: "Email has already been registered" });
//                 } else {
//                     return res.status(201).json({ message: "User has been registered" });
//                 }
//             }
//         }
//     );
// };
//
//
// //----Login mysql--------
//
// exports.login = async (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//
//     if (!email || !password) {
//         return res.status(400).json({error: "Please enter an email and a password"});
//     } else {
//         db.query(
//             `
//                 SELECT *
//                 FROM users
//                 WHERE email = ?`,
//             [email],
//             async (error, result) => {
//                 if (error) {
//                     return res.status(500).json({error: "Your request could not be completed"});
//                 }
//                 if (!result[0]) {
//                     return res.status(403).json({error: "Email not recognized"});
//                 } else {
//                     const userValid = await bcrypt.compare(password, result[0].password);
//                     if (userValid) {
//                         const token = await jwt.createToken({sub: result[0].users_id});
//                         res.status(200).json({
//                             userId: result[0].users_id,
//                             access_token: token,
//                             token_type: "Bearer",
//                             expires_in: jwtConfig.ttl,
//                         });
//                     } else {
//                         return res.status(401).json({error: "Incorrect password"});
//                     }
//                 }
//             }
//         );
//     }
// }
//
//
//
// exports.logout = async (req, res) => {
//     const token = req.token;
//     const now = new Date();
//     const expire = new Date(req.user.exp);
//     const milliseconds = now.getTime() - expire.getTime();
//
//     /* ----------------------------- BlackList Token ---------------------------- */
//     /* Adding the token to the blacklist. */
//     const blacklist = await cache.set(token, milliseconds);
//
//     return res.status(200).json({ message: "Logged out successfully" });
// };

const db = require("../config/db-config");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const jwtConfig = require("../config/jwt-config");
const cache = require("../utils/cache");

exports.signup = async (req, res) => {
    const firstname = req.body.firstname.toLowerCase();
    const lastname = req.body.lastname.toUpperCase();
    const email = req.body.email;
    const password = req.body.password;
    const cryptPassword = await bcrypt.hash(password, 12);
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({error: "Please Enter information"});
    }
    db.query(
        'INSERT INTO users(lastname, firstname, email, password) VALUES($1, $2, $3, $4);',
        [lastname, firstname, email, cryptPassword],
        (error, results) => {
            if (error) {
                if (error.code === "23505") {
                    return res.status(500).json({error: "Email already used"});
                }
                return res.status(500).json({error: "Your request could not be completed"});
            } else {
                // Verification of line creation
                if (results.rowCount !== 1) {
                    return res.status(409).json({error: "Email has already been registered"});
                } else {
                    return res.status(201).json({message: "User has been registered"});
                }
            }
        }
    )
    ;
};

//----Login postgresql--------

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({error: "Please enter an email and a password"});
    } else {
        let query = db.query(`
                SELECT *
                FROM users
                WHERE email = $1`,
            [email]);
        console.log(query);
        db.query(
            `
                SELECT *
                FROM users
                WHERE email = $1`,
            [email],
            async (error, result) => {
                const userId = result.rows[0].users_id;
                const password1 = result.rows[0].password;
                if (error) {
                    return res.status(500).json({error: "Your request could not be completed"});
                }
                if (!result) {
                    return res.status(403).json({error: "Email not recognized"});
                } else {
                    const userValid = await bcrypt.compare(password, password1);
                    if (userValid) {
                        console.log(userId);
                        const token = await jwt.createToken({sub: userId});
                        res.status(200).json({
                            userId: userId,
                            access_token: token,
                            token_type: "Bearer",
                            expires_in: jwtConfig.ttl,
                        });
                    } else {
                        return res.status(401).json({error: "Incorrect password"});
                    }
                }
            }
        );
    }
}

exports.logout = async (req, res) => {
    const token = req.token;
    const now = new Date();
    const expire = new Date(req.user.exp);
    const milliseconds = now.getTime() - expire.getTime();

    /* ----------------------------- BlackList Token ---------------------------- */
    /* Adding the token to the blacklist. */
    const blacklist = await cache.set(token, milliseconds);

    return res.status(200).json({message: "Logged out successfully"});

};