const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const headerMiddleware = require("../middleware/header");
const express = require('express')
const router = express.Router()
const {
     signUp,
     signIn,
     updateSignUp ,
     getAllUsers,
     getSingleUser,
     deleteSingleUser,
     deleteAllUsers,
     
    } = require('../controllers/user')

// -------------------------CUSTOM ROUTE-------------------------
router.use(headerMiddleware.header);
router.post("/sign-up",[verifySignUp.checkDuplicateEmail], signUp);
router.post("/sign-in", signIn);


router.put('/updateUser/:id', [authJwt.verifyToken, verifySignUp.updateEmail],updateSignUp)

router.get('/getAllUsers/', [authJwt.verifyToken],getAllUsers)

router.get('/getSingleUser/:id',[authJwt.verifyToken],getSingleUser)

router.delete('/delSingleUser/:id',[authJwt.verifyToken], deleteSingleUser)

router.delete('/delAllUsers/',[authJwt.verifyToken],deleteAllUsers)
// -------------------------EXPORT ROUTER-------------------------
module.exports = router