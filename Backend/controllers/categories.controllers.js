// const pool = require("../config/db-config");
//
// exports.getAllCategorie = (req, res) => {
//     pool.query(
//         `
//             SELECT
//                 categories_id AS categoriesId,
//                 name,
//                 slug
//             FROM contentcategorie
//         `,
//         (error, result) => {
//             if (error) {
//                 return res.status(500).json({ error: "Your request could not be completed" });
//             } else {
//                 return res.status(200).json(result);
//             }
//         }
//     );
// };
//
// exports.insertCategorie = (req, res) => {
//     const { name, slug } = req.body;
//
//     pool.query(
//         `
//             INSERT INTO
//                 contentcategorie
//             SET ?
//         `,
//         {
//             name: name,
//             slug: slug,
//         },
//         (error, result) => {
//             if (error) {
//                 return res
//                     .status(500)
//                     .json({ error: "Your request could not be completed, error 1062, duplicate key" });
//             } else {
//                 return res.status(201).json(result);
//             }
//         }
//     );
// };

const db = require('../config/db-config');

exports.getAllCategorie = (req, res) => {
    db.query(
        `
      SELECT
        categories_id AS categoriesId,
        name,
        slug
      FROM contentcategorie
    `,
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Your request could not be completed' });
            } else {
                return res.status(200).json(result.rows);
            }
        }
    );
};

exports.insertCategorie = (req, res) => {
    const { name, slug } = req.body;

    db.query(
        `
      INSERT INTO
        contentcategorie(name, slug)
      VALUES ($1, $2)
      RETURNING categories_id AS categoriesId, name, slug
    `,
        [name, slug],
        (error, result) => {
            if (error) {
                if (error.code === '23505') {
                    return res.status(500).json({ error: 'Your request could not be completed, error 23505, duplicate key' });
                } else {
                    return res.status(500).json({ error: 'Your request could not be completed' });
                }
            } else {
                return res.status(201).json(result.rows[0]);
            }
        }
    );
};

