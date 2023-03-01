// const db = require("../config/db-config");
// const { deleteImage } = require("../config/deleteImage-config");
//
// exports.createPost = (req, res) => {
//     const bodyPost = JSON.parse(req.body.post);
//
//     const { title, content, categorie } = bodyPost;
//     let data;
//
//     console.log("TESTING")
//     console.log(req);
//
//     if (!title || !categorie || (!req.file && !content)) {
//         return res.status(400).json({ message: "Please enter the information" });
//     }
//
//     db.query(
//         `
//                 INSERT INTO
//                     thread
//                 SET
//                     title = ?,
//                     categories_id = ?`,
//         [title, categorie],
//         (error, results) => {
//             if (error) {
//                 return res.status(500).json({ error: "Votre requête n'a pas pu aboutir NEW 1" });
//             } else {
//                 if (req.file) {
//                     data = {
//                         content: req.file.location,
//                         threads_id: results.insertId,
//                         users_id: req.auth,
//                         postTypes_id: 1,
//                     };
//                 } else {
//                     data = {
//                         content: content,
//                         threads_id: results.insertId,
//                         users_id: req.auth,
//                         postTypes_id: 2,
//                     };
//                 }
//
//                 db.query(
//                     `
//                                 INSERT INTO
//                                     contents
//                                 SET content = ?, threads_id = ?, users_id = ?, postTypes_id = ?`,
//                     [data.content, data.threads_id, data.users_id, data.postTypes_id],
//                     (error, result) => {
//                         if (error) {
//                             return res.status(500).json({ error: error.message });
//                         } else {
//                             return res.status(201).json({ message: "Post has been created" });
//                         }
//                     }
//                 );
//             }
//         }
//     );
// };

//------------------------------------------------------------------------------------

const db = require("../config/db-config");
const { deleteImage } = require("../config/deleteImage-config");

exports.createPost = (req, res) => {
    const bodyPost = JSON.parse(req.body.post);

    const { title, content, categorie } = bodyPost;
    let data;

    console.log("TESTING")
    console.log(req);

    if (!title || !categorie || (!req.file && !content)) {
        return res.status(400).json({ message: "Please enter the information" });
    }

    db.query(
        `
                INSERT INTO 
                    thread 
                    (title, categories_id)
                VALUES
                    ($1, $2)
                RETURNING id;
                `,
        [title, categorie],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed NEW 1" });
            } else {
                if (req.file) {
                    data = {
                        content: req.file.location,
                        threads_id: results.rows[0].id,
                        users_id: req.auth,
                        postTypes_id: 1,
                    };
                } else {
                    data = {
                        content: content,
                        threads_id: results.rows[0].id,
                        users_id: req.auth,
                        postTypes_id: 2,
                    };
                }

                db.query(
                    `
                                INSERT INTO 
                                    contents 
                                    (content, threads_id, users_id, postTypes_id)
                                VALUES
                                    ($1, $2, $3, $4);
                                `,
                    [data.content, data.threads_id, data.users_id, data.postTypes_id],
                    (error, result) => {
                        if (error) {
                            return res.status(500).json({ error: error.message });
                        } else {
                            return res.status(201).json({ message: "Post has been created" });
                        }
                    }
                );
            }
        }
    );
};

//-------------------------------------------------------------

exports.getAllPosts = (req, res) => {
    const nbItems = parseInt(req.query.limit);

    let start = (req.query.start - 1) * nbItems;
    let categorie = req.query.category;

    categorie == "null" || categorie == undefined
        ? (sqlParams = [req.auth, nbItems, start])
        : (sqlParams = [req.auth, categorie, nbItems, start]);

    db.query(
        `
            WITH tempTable AS (
                SELECT
                    threads_id,
                    MIN(created_datetime) created_datetime
                FROM contents
                GROUP BY threads_id
            )
            SELECT
                t.threads_id,
                t.title,
                c.content,
                c.created_datetime,
                c.contents_id,
                u.lastname,
                u.firstname,
                u.profile_picture_location,
                c.users_id,
                cc.name as categorie,
                cc.slug as categorieSlug,
                SUM(CASE WHEN l.like_content_id IS NOT NULL THEN 1 ELSE 0 END) nbLike,
                SUM(CASE WHEN l.like_user_id = ? THEN true ELSE false END) isLiked
            FROM tempTable tt
                     JOIN thread t
                          ON tt.threads_id = t.threads_id
                     JOIN contents c
                          ON tt.threads_id = c.threads_id AND tt.created_datetime = c.created_datetime
                     LEFT JOIN likes l
                               ON c.contents_id = l.like_content_id
                     JOIN users u
                          ON c.users_id = u.users_id
                     JOIN contentcategorie cc
                          ON t.categories_id = cc.categories_id

                ${categorie == "null" || categorie == undefined ? "" : "WHERE cc.slug = ?"}

            GROUP BY t.threads_id, t.title, c.content, c.created_datetime, c.contents_id, u.lastname, u.firstname, u.profile_picture_location,c.users_id, cc.name,cc.slug
            ORDER BY tt.created_datetime DESC
                LIMIT ? OFFSET ? ;`,
        sqlParams,
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed" });
            } else {
                return res.status(200).json(result);
            }
        }
    );
};

exports.deletePost = (req, res) => {
    const role = req.role;
    const postId = req.params.id;

    db.query(
        `
            SELECT
                *
            FROM contents
            WHERE contents.threads_id = ?
            ORDER BY contents.created_datetime
                LIMIT 1`,
        [postId],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed" });
            }
            if (!result[0]) {
                return res.status(404).json({ message: "Object not found !" });
            } else if (result[0].users_id !== req.auth && role === false) {
                return res.status(404).json({ message: "Unauthorized request" });
            } else {
                db.query("DELETE FROM thread WHERE thread.threads_id = ?", [postId], (error, resultat) => {
                    if (error) {
                        return res.status(500).json({ error: "Your request could not be completed" });
                    } else {
                        if (result[0].postTypes_id == 1) {
                            deleteImage(result[0], "post_picture");

                            //I also delete images from comments (Delete On Cascade from Posts)
                            for (let i = 1; i < result.length; i++) {
                                deleteImage(result[i], "comment_picture");
                            }
                        }

                        res.status(200).json({ message: "Deleted !" });
                    }
                });
            }
        }
    );
};

exports.updatePost = (req, res) => {
    const postId = parseInt(req.params.id);
    const bodyPost = JSON.parse(req.body.post);
    const { title, content, categorie } = bodyPost;
    const role = req.role;
    let data;

    if (!categorie || !title) {
        return res.status(400).json({ message: "Please complete all fields" });
    } else {
        db.query(
            `
                SELECT
                    *
                FROM contents
                WHERE contents_id = ? `,
            [postId],
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "Please complete all fields" });
                }
                if (!result[0]) {
                    if (req.file) {
                        deleteImage(req.file.filename, "post_picture");
                    }
                    return res.status(404).json({ message: "Object not found !" });
                }

                if (result[0].users_id !== req.auth && role === "true") {
                    if (req.file) {
                        deleteImage(req.file.filename, "post_picture");
                    }
                    return res.status(401).json({ message: "unauthorized request" });
                }
                // Preparing the object to insert
                if (req.file) {
                    data = {
                        content:
                            req.protocol +
                            "://" +
                            req.get("host") +
                            "/images/post_picture/" +
                            req.file.filename,
                        title: title,
                        categories_id: categorie,
                        postTypes_id: 1,
                    };
                } else {
                    if (content.includes("/images/post_picture/")) {
                        data = {
                            title: title,
                            categories_id: categorie,
                        };
                    } else {
                        data = {
                            content: content,
                            title: title,
                            postTypes_id: 2,
                            categories_id: categorie,
                        };
                    }
                }

                db.query(
                    `
                        UPDATE
                            contents
                            JOIN thread
                        ON contents.threads_id = thread.threads_id
                            SET ? WHERE contents.contents_id = ? `,
                    [data, postId],
                    (error, resultat) => {
                        if (error) {
                            return res.status(500).json({ error: "Your request could not be completed" });
                        } else {
                            if (resultat.affectedRows !== 0) {
                                if (req.file || !content.includes("images/post_picture")) {
                                    deleteImage(result[0], "post_picture");
                                }
                                return res.status(200).json({ message: "Post has been updated" });
                            } else {
                                return res.status(500).json({ message: "Post not updated" });
                            }
                        }
                    }
                );
            }
        );
    }
};



