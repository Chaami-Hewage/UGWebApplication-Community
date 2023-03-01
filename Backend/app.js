const path = require("path");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

if (process.env.NODE_ENV === "development") {
    const morgan = require("morgan");
    const morganBody = require("morgan-body");
    /* It's a middleware that logs all requests, including the body, to the console. */
    morganBody(app);
    app.use(morgan("combined"));
}

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const likeRoutes = require("./routes/like.routes");
const categoriesRoutes = require("./routes/categories.routes");
const commentRoutes = require("./routes/comment.routes");

/* A middleware that parses the body of the request and makes it available on the `req.body` property. */
app.use(express.json());
app.use(cors());

app.use("/api/like", likeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/comment", commentRoutes);

/* A middleware that adds the database pool object to the request object */
app.use((req, res, next) => {
    req.db = pool;
    next();
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

module.exports = app;
