const express = require("express");
const {
    createComment,
    getAllComments,
    deleteComment,
    getNumberCommentsForAThread,
} = require("../controllers/comment.controllers");
const { isAdmin } = require("../middleware/admin");

const multer = require("../middleware/multer-config");
const router = express.Router();
const authGuard = require("../middleware/auth.guard");

router.post("/", authGuard, multer, createComment);
router.get("/:id/:start/:limit", authGuard, getAllComments);
router.get("/:id/nb", authGuard, getNumberCommentsForAThread);
router.delete("/:id", authGuard, isAdmin, deleteComment);

module.exports = router;
