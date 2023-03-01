const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controllers");
const authGuard = require("../middleware/auth.guard");
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authGuard, logout);

module.exports = router;
