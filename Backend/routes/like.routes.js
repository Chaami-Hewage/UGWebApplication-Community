const express = require("express");
const { contentLike} = require("../controllers/like.controllers");

const router = express.Router();
const authGuard = require("../middleware/auth.guard");

router.post("/:id", authGuard, contentLike);

module.exports = router;
