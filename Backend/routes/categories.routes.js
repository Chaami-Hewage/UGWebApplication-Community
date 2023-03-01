const { Router } = require("express");
const express = require("express");
const { getAllCategorie, insertCategorie } = require("../controllers/categories.controllers");

const router = express.Router();
const authGuard = require("../middleware/auth.guard");

router.get("/", authGuard, getAllCategorie);
router.post("/", authGuard, insertCategorie);
module.exports = router;
