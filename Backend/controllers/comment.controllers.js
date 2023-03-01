// const db = require("../config/db-config");
// const { deleteImage } = require("../config/deleteImage-config");
//
// exports.createComment = (req, res) => {
//     const bodyPost = JSON.parse(req.body.comment);
//     const { threadId, content } = bodyPost;
//
//     let data;
//     if (!req.file && !content) {
//         return res.status(400).json({ message: "Please enter a message" });
//     }
//
//     if (req.file) {
//         data = {
//             content: req.file.location,
//             threads_id: threadId,
//             users_id: req.auth,
//             postTypes_id: 1,
//         };
//     } else {
//         data = {
//             content: content,
//             threads_id: threadId,
//             users_id: req.auth,
//             postTypes_id: 2,
//         };
//     }
//
//     db.query("INSERT INTO contents SET ?", data, (error, results) => {
//         if (error) {
//             return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//         } else {
//             return res.status(201).json({ message: "Comment has been registered" });
//         }
//     });
// };
//
// exports.deleteComment = (req, res) => {
//     const commentId = req.params.id;
//     const role = req.role;
//
//     db.query("SELECT * FROM contents WHERE contents_id = ?", [commentId], (error, result) => {
//         if (error) {
//             return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//         }
//         if (!result[0]) {
//             return res.status(404).json({ message: "Object not found !" });
//         } else if (result[0].users_id !== req.auth && role === false) {
//             return res.status(401).json({ message: "unauthorized request" });
//         } else {
//             db.query("DELETE FROM contents WHERE contents_id = ?", [commentId], (error, resultat) => {
//                 if (error) {
//                     return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//                 } else {
//                     if (result[0].postTypes_id == 1) {
//                         deleteImage(result[0], "comment_picture");
//                     }
//                     res.status(200).json({ message: "Deleted !" });
//                 }
//             });
//         }
//     });
// };
//
// exports.getAllComments = async (req, res) => {
//     let nbItems = parseInt(req.params.limit);
//     let start = (req.params.start - 1) * nbItems;
//     const threadId = req.params.id;
//
//     const nbComment = await new Promise((resolve, rejet) => {
//         db.query(
//             `SELECT SUM(CASE WHEN contents.threads_id = ? THEN 1 ELSE 0 END) nbComment FROM contents`,
//             [threadId],
//             (error, result) => {
//                 if (error) {
//                     return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//                 } else {
//                     // J'enlève le Post Initial
//                     let comment = result[0].nbComment - 1;
//                     resolve(comment);
//                 }
//             }
//         );
//     });
//
//     // Changement du parametre limit pour ne pas recuperer le post initial et se referer au nb de commentaire total
//     if (nbComment - start < nbItems) {
//         nbItems = nbComment - start;
//     }
//
//     db.query(
//         `
//     SELECT
//
//    c.contents_id,
//    c.users_id,
//    c.content,
//    c.created_datetime,
//    u.lastname,
//    u.firstname,
//    u.profile_picture_location,
//    SUM(CASE WHEN l.like_content_id IS NOT NULL THEN 1 ELSE 0 END) nbLike,
//    SUM(CASE WHEN l.like_user_id = ? THEN TRUE ELSE FALSE END) isLike
//    FROM contents c
//    LEFT JOIN likes l
//    ON c.contents_id = l.like_content_id
//    JOIN users u
//    ON c.users_id = u.users_id
//    WHERE c.threads_id = ?
//    GROUP BY  c.contents_id,
//    c.users_id,
//    c.content,
//    c.created_datetime,
//    u.lastname,
//    u.firstname,
//    u.profile_picture_location
//    ORDER BY c.created_datetime DESC
//    LIMIT ? OFFSET ?
//     `,
//         [req.auth, threadId, nbItems, start],
//         (error, result) => {
//             if (error) {
//                 return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//             } else {
//                 console.log(result);
//                 return res.status(200).json(result);
//             }
//         }
//     );
// };
//
// exports.getNumberCommentsForAThread = (req, res) => {
//     const threadId = parseInt(req.params.id);
//     db.query(
//         `SELECT SUM(CASE WHEN contents.threads_id = ? THEN 1 ELSE 0 END) nbComment FROM contents`,
//         [threadId],
//         (error, result) => {
//             if (error) {
//                 return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//             } else {
//                 // J'enlève le Post Initial
//                 let comment = result[0].nbComment - 1;
//                 return res.status(200).json(comment);
//             }
//         }
//     );
// };

const db = require("../config/db-config");
const {deleteImage} = require("../config/deleteImage-config");

exports.createComment = (req, res) => {
    const bodyPost = JSON.parse(req.body.comment);
    const {threadId, content} = bodyPost;

    let data;
    if (!req.file && !content) {
        return res.status(400).json({message: "Please enter a message"});
    }

    if (req.file) {
        data = {
            content: req.file.location,
            threads_id: threadId,
            users_id: req.auth,
            postTypes_id: 1,
        };
    } else {
        data = {
            content: content,
            threads_id: threadId,
            users_id: req.auth,
            postTypes_id: 2,
        };
    }

    db.query("INSERT INTO contents(content, threads_id, users_id, postTypes_id) VALUES($1, $2, $3, $4)", [data.content, data.threads_id, data.users_id, data.postTypes_id], (error, results) => {
        if (error) {
            return res.status(500).json({error: "Your request could not be completed"});
        } else {
            return res.status(201).json({message: "Comment has been registered"});
        }
    });
};

exports.deleteComment = (req, res) => {
    const commentId = req.params.id;
    const role = req.role;

    db.query("SELECT * FROM contents WHERE contents_id = $1", [commentId], (error, result) => {
        if (error) {
            return res.status(500).json({error: "Your request could not be completed"});
        }
        if (!result[0]) {
            return res.status(404).json({message: "Object not found !"});
        } else if (result[0].users_id !== req.auth && role === false) {
            return res.status(401).json({message: "Unauthorized request"});
        } else {
            db.query("DELETE FROM contents WHERE contents_id = $1", [commentId], (error, resultat) => {
                if (error) {
                    return res.status(500).json({error: "Your request could not be completed"});
                } else {
                    if (result[0].postTypes_id == 1) {
                        deleteImage(result[0], "comment_picture");
                    }
                    res.status(200).json({message: "Deleted !"});
                }
            });
        }
    });
};

exports.getAllComments = async (req, res) => {
    let nbItems = parseInt(req.params.limit);
    let start = (req.params.start - 1) * nbItems;
    const threadId = req.params.id;

    const nbComment = await new Promise((resolve, reject) => {
        db.query(
            `SELECT COUNT(*) nbComment
             FROM contents
             WHERE threads_id = $1`,
            [threadId],
            (error, result) => {
                if (error) {
                    return res.status(500).json({error: "Your request could not be completed"});
                } else {
                    let comment = result.rows[0].nbcomment;
                    resolve(comment);
                }
            }
        );
    });


    if (nbComment - start < nbItems) {
        nbItems = nbComment - start;
    }

    db.query(
        `
            SELECT c.contents_id,
                   c.users_id,
                   c.content,
                   c.created_datetime,
                   u.lastname,
                   u.firstname,
                   u.profile_picture_location,
                   SUM(CASE WHEN l.like_content_id IS NOT NULL THEN 1 ELSE 0 END) nbLike,
                   SUM(CASE WHEN l.like_user_id = $1 THEN TRUE ELSE FALSE END)    isLike
            FROM contents c
                     LEFT JOIN likes l
                               ON c.contents_id = l.like_content_id
                     JOIN users u
                          ON c.users_id = u.users_id
            WHERE c.threads_id = $2
            GROUP BY c.contents_id,
                     c.users_id,
                     c.content,
                     c.created_datetime,
                     u.lastname,
                     u.firstname,
                     u.profile_picture_location
            ORDER BY c.created_datetime DESC
                LIMIT $3
            OFFSET $4
        `,
        [req.auth, threadId, nbItems, start],
        (error, result) => {
            if (error) {
                return res.status(500).json({error: "Your request could not be completed"});
            } else {
                console.log(result);
                return res.status(200).json(result.rows);
            }
        }
    );
};

exports.getNumberCommentsForAThread = (req, res) => {
    const threadId = parseInt(req.params.id);
    db.query(
        `SELECT SUM(CASE WHEN contents.threads_id = ? THEN 1 ELSE 0 END) nbComment FROM contents`,
        [threadId],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed" });
            } else {
                // I remove the Initial Post
                let comment = result[0].nbComment - 1;
                return res.status(200).json(comment);
            }
        }
    );
};

