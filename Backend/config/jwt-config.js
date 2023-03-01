// const dotenv = require("dotenv").config();

/*
 *    ttl - JWT time to live(seconds or time units(https://github.com/vercel/ms))
 *    ttl: 3600 // 1 hour
 *    ttl: '1h' // 1 hour
 *    ttl: '7d' // 7 days
 */
// module.exports = {
//     secret: process.env.JWT_KEY,
//     ttl: 3600,
// };


const dotenv = require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.verifyToken = async (token) => {
    const secret = await getSecret();
    return jwt.verify(token, secret);
};

exports.createToken = async (data) => {
    const secret = await getSecret();
    return jwt.sign(data, secret, {expiresIn: process.env.JWT_TTL});
};

async function getSecret() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT secret FROM jwt_secrets WHERE id = 1");
        return res.rows[0].secret;
    } finally {
        client.release();
    }
}
