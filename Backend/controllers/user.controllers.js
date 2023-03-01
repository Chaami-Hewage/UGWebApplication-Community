const db = require("../config/db-config");
const bcrypt = require("bcrypt");
const { deleteImage } = require("../config/deleteImage-config");

exports.getAllUsers = (req, res) => {
    db.query(
        `
        SELECT 
            users_id AS userId, 
            firstname, 
            lastname, 
            email, 
            profile_picture_location AS imgUser 
        FROM users 
        ORDER BY lastname`,
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed" });
            } else {
                return res.status(200).json(result);
            }
        }
    );
};

exports.getOneUser = (req, res) => {
    const userId = req.params.id;

    db.query(
        `SELECT 
                users_id AS userId, 
                firstname, 
                lastname, 
                email, 
                role_id as role,
                profile_picture_location AS imgUser 
            FROM users 
            WHERE users_id = ? `,
        [userId],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed" });
            } else {
                return res.status(200).json(result[0]);
            }
        }
    );
};

exports.updateProfilUser = (req, res) => {
    const userId = req.params.id;
    const bodyUser = JSON.parse(req.body.user);
    const lastname = bodyUser.lastname;
    const firstname = bodyUser.firstname;
    let data;

    if (!lastname || !firstname) {
        return res.status(404).json({ error: "Please Enter information" });
    } else {
        db.query(
            `
                SELECT 
                    * 
                FROM users 
                WHERE users_id = ?`,
            [userId],
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "Your request could not be completed" });
                }

                if (!result[0]) return res.status(404).json({ message: "User not found !" });

                if (!result[0] || result[0].users_id !== req.auth) {
                    if (req.file) {
                        deleteImage(req.file.filename, "profil_picture");
                    }
                    return res.status(401).json({ message: "Unauthorized request" });
                }

                if (req.file) {
                    data = {
                        profile_picture_location: req.file.location,
                        firstname: firstname,
                        lastname: lastname,
                    };
                } else {
                    data = {
                        profile_picture_location: req.body.image,
                        firstname: firstname,
                        lastname: lastname,
                    };
                }

                db.query(
                    `
                            UPDATE 
                                users 
                            SET ? 
                            WHERE users_id = ?`,
                    [data, userId],
                    (error, updateUser) => {
                        if (error) {
                            return res.status(500).json({ error: "Your request could not be completed" });
                        } else {
                            if (req.file) {
                                const imageProfil = result[0].profile_picture_location;
                                if (imageProfil !== null) {
                                    //We check that the image is not a default image so as not to delete it
                                    const isImageProfilDefault =
                                        imageProfil.includes("/images/default_picture");
                                    if (isImageProfilDefault === false) {
                                        deleteImage(result[0], "profil_picture");
                                    }
                                    // deleteImage(result[0], "profil_picture");
                                }
                            }
                            return res.status(200).json({ message: "User has been updated" });
                        }
                    }
                );
            }
        );
    }
};

exports.updatePasswordUser = async (req, res) => {
    const userId = req.params.id;
    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;

    if (oldPassword == newPassword) return res.status(405).json({ message: "New password already used" });

    db.query(
        `
        SELECT 
            * 
        FROM users 
        WHERE users_id = ?`,
        [userId],
        async (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed" });
            }
            if (!result[0]) {
                return res.status(404).json({ message: "User not found !" });
            } else {
                const userValid = await bcrypt.compare(oldPassword, result[0].password);
                if (!userValid) {
                    return res.status(401).json({ message: "Old Password incorrect" });
                } else {
                    const cryptPassword = await bcrypt.hash(newPassword, 12);
                    db.query(
                        `
                        UPDATE 
                            users 
                        SET password = ? 
                        WHERE users_id = ?`,
                        [cryptPassword, userId],
                        (error, result) => {
                            if (error) {
                                return res.status(500).json({ error: "Your request could not be completed" });
                            } else {
                                return res.status(200).json({ message: "Password change ! " });
                            }
                        }
                    );
                }
            }
        }
    );
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    db.query(
        `
        SELECT 
            * 
        FROM users 
        WHERE users_id = ?`,
        [userId],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Your request could not be completed" });
            }
            if (!result[0]) {
                return res.status(404).json({ error: "User not found !" });
            }

            if (result[0].users_id !== req.auth) {
                return res.status(4013).json({ message: "Forbidden" });
            }

            db.query(
                `
                    DELETE 
                    FROM users 
                    WHERE users_id = ?`,
                [userId],
                (error, resultat) => {
                    if (error) {
                        return res.status(500).json({ error: "Your request could not be completed" });
                    } else {
                        const imageProfil = result[0].profile_picture_location;
                        if (imageProfil !== null) {
                            const isImageProfilDefault = imageProfil.includes("/images/default_picture");
                            // If include the path default_picture then it's a default image so I don't delete it
                            if (isImageProfilDefault === false) {
                                deleteImage(result[0], "profil_picture");
                            }
                        }
                        return res.status(200).json({ message: "User Deleted" });
                    }
                }
            );
        }
    );
};
