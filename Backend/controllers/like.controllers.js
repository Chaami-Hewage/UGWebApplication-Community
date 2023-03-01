// const db = require("../config/db-config");
//
// exports.contentLike = async (req, res) => {
//     const content = parseInt(req.params.id);
//     const userId = parseInt(req.auth);
//     const like = req.body.like;
//     let message;
//     let sql;
//     //j'attends la réponse de la promesse pour pouvoir ensuite savoir si l'utilisateur a déjà un like associé à ce contenu
//     const hasLike = await new Promise((resolve, reject) => {
//         db.query(
//             `
//                 SELECT
//                     *
//                 FROM likes
//                 WHERE like_content_id  = ? AND like_user_id = ?`,
//             [content, userId],
//             (error, result) => {
//                 if (error) {
//                     return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//                 } else {
//                     resolve(result);
//                 }
//             }
//         );
//     });
//
//     switch (like) {
//         case 0:
//             if (hasLike[0]) {
//                 sql = "DELETE FROM likes WHERE like_user_id = ? AND like_content_id = ?";
//                 message = "Like Supprimé";
//             } else {
//                 return res.status(500).json({ message: "Action impossible" });
//             }
//             break;
//         case 1:
//             if (!hasLike[0]) {
//                 sql = "INSERT INTO likes (like_user_id, like_content_id) VALUES (?, ?)";
//                 message = "Like Ajouté";
//             } else {
//                 return res.status(500).json({ message: "Action impossible" });
//             }
//             break;
//     }
//
//     db.query(sql, [userId, content], (error, result) => {
//         if (error) {
//             return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
//         } else {
//             return res.status(200).json({ message });
//         }
//     });
// };

const db = require("../config/db-config");

exports.contentLike = async (req, res) => {
    const content = parseInt(req.params.id);
    const userId = parseInt(req.auth);
    const like = req.body.like;
    let message;
    let sql;
//I am waiting for the response from the promise so that I can then know if the user already has a like associated with this content
    const hasLike = await new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM likes WHERE like_content_id = $1 AND like_user_id = $2',
            [content, userId],
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "Your request could not be completed" });
                } else {
                    resolve(result);
                }
            }
    );
    });
    switch (like) {
        case 0:
            if (hasLike[0]) {
                    sql = "DELETE FROM likes WHERE like_user_id = $1 AND like_content_id = $2";
                message = "Like Deleted";
            } else {
                return res.status(500).json({ message: "Action impossible" });
            }
            break;
        case 1:
            if (!hasLike[0]) {
                sql = "INSERT INTO likes (like_user_id, like_content_id) VALUES ($1, $2)";
                message = "Like Added";
            } else {
                return res.status(500).json({ message: "Action impossible" });
            }
            break;
    }

    db.query(sql, [userId, content], (error, result) => {
        if (error) {
            return res.status(500).json({ error: "Your request could not be completed" });
        } else {
            return res.status(200).json({ message });
        }
    });
};