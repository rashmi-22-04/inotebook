const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECERT = "RashmiisaGo$odgirl";

//Route:1 create a user post /api/auth/createuser
router.post(
  "/createuser",
  [
    body("email", "enter a valid name").isEmail(),
    body("name", "enter a email name").isLength({ min: 3 }),
    body("password", "password must be 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({success, email: req.body.email });
      if (user) {
        return res.status(400).json({ err: "Soory user already exists!" });
      }

      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECERT);
       success=true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured!");
    }
  }
);

//Route:2 login a user post /api/auth/login
router.post(
  "/loginuser",
  [body("email", "enter a valid name").isEmail()],
  [body("password", "password can not be blank").exists()],
  async (req, res) => {
   let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success=false;
        return res
          .status(400)
          .json({ success ,error: "Please try to login with correct credentails!" });
      }
      const passwordComapre = await bcrypt.compare(password, user.password);
      if (!passwordComapre) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Please try to login with correct credentails!" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECERT);
         success=true;
      res.json({success ,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route:3 get logged in user details /api/auth/getuser :Login Required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
