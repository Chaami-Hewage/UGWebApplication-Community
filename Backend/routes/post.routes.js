const express = require("express");
const { createPost, getAllPosts, deletePost, updatePost } = require("../controllers/post.controllers");
const multer = require("../middleware/multer-config");
const router = express.Router();
const authGuard = require("../middleware/auth.guard");
const { isAdmin } = require("../middleware/admin");

router.post("/", authGuard, multer, createPost);
router.get("/", authGuard, getAllPosts);
router.delete("/:id", authGuard, isAdmin, deletePost);
router.put("/:id", authGuard, isAdmin, multer, updatePost);

module.exports = router;
