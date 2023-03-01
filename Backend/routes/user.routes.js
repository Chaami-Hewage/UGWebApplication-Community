const express = require("express");
const {
    getAllUsers,
    getOneUser,
    updateProfilUser,
    updatePasswordUser,
    deleteUser,

} = require("../controllers/user.controllers");

const multer = require("../middleware/multer-config");
const router = express.Router();

const authGuard = require("../middleware/auth.guard");
//--------------------------------------------

router.get("/", authGuard, getAllUsers);
router.get("/:id", authGuard, getOneUser);

router.put("/:id", authGuard, multer, updateProfilUser);
router.put("/password/:id", authGuard, updatePasswordUser);
router.delete("/:id", authGuard, deleteUser);
module.exports = router;
