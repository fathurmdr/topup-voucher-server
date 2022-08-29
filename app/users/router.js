var express = require("express");
var router = express.Router();
const {
  viewSignin,
  actionSignin,
  actionLogout,
  viewSignup,
  actionSignup,
} = require("./controller");

router.get("/signup", viewSignup);
router.post("/signup", actionSignup);
router.get("/", viewSignin);
router.post("/", actionSignin);
router.get("/logout", actionLogout);
module.exports = router;
