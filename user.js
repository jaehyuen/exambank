var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var app = express();
require("date-utils");
var newDate = new Date();
var time = newDate.toFormat("YYYY-MM-DD HH24:MI:SS");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("./db/user");
app.use(
  session({
    secret: "123qwe123qwe123qwe",
    resave: false,
    saveUninitialized: true
  })
);
router.get("/login", (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  res.render("login", { displayname: displayname });
});

router.get("/err", (req, res) => {
  res.send(
    '<script>alert("로그인하시오");location.href="/user/login";</script>'
  );
});
router.get("/join", (req, res) => {
  res.render("join");
});

router.get("/logout", (req, res) => {
  delete req.session.displayname;
  res.redirect("/main");
});

router.post("/login", (req, res) => {
  var id = req.body.user_id;
  var password = req.body.user_password;
  User.find({ userid: id }, (err, user) => {
    if (user == "") {
      res.send(
        '<script>alert("아이디확인");location.href="/user/login";</script>'
      );
    } else {
      if (user[0].userpassword == password) {
        req.session.displayname = user[0].usernickname;
        res.redirect("/main");
      } else {
        res.send(
          '<script>alert("비번틀림");location.href="/user/login";</script>'
        );
      }
    }
  });
});

router.post("/join", (req, res) => {
  var id = req.body.user_id;
  var password = req.body.user_password;
  var nickname = req.body.user_nickname;
  var user = new User({
    userid: id,
    userpassword: password,
    usernickname: nickname
  });

  user.save((err, user) => {
    if (err) {
      res.send(
        '<script>alert("중복확인");location.href="/user/join";</script>'
      );
    } else {
      res.redirect("/user/login");
    }
  });
});
module.exports = router;
