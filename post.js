var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
require("date-utils");
var newDate = new Date();
var time = newDate.toFormat("YYYY-MM-DD HH24:MI:SS");
var router = express.Router();
var mongoose = require("mongoose");
var Category = require("./db/category");
var Test = require("./db/test");
var User = require("./db/user");

app.use(
  session({
    secret: "123qwe123qwe123qwe",
    resave: false,
    saveUninitialized: true
  })
);
//app.use(bodyParser.urlencoded({extended: false}));

router.get("/ctdel/:id", (req, res) => {
  var id = req.params.id;
  Category.remove({ _id: id }, () => {
    res.redirect("/main");
  });
});

router.get("/exam/:id", (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  var id = req.params.id;
  Test.findOne({ _id: id }, (err, test) => {
    Category.findOne({ name: test.category }, (err, category) => {
      res.render("exam", {
        displayname: displayname,
        test: test,
        cate: category
      });
    });
  });
});
router.get("/ctnew", (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  res.render("ctnew", { displayname: displayname });
});

router.get("/start/:id", (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  var id = req.params.id;
  Category.find({ _id: id }, (err, category) => {
    Test.find({ category: category[0].name }, (err, test) => {
      if (test == "") {
        res.send(
          '<script>alert("문제없음");location.href="/main/' + id + '";</script>'
        );
      } else {
        var a = Math.floor(Math.random() * test.length);
        console.log(test[0].example);
        function arrayShuffle(oldArray) {
          var newArray = oldArray.slice();
          var len = newArray.length;
          var i = len;
          while (i--) {
            var p = parseInt(Math.random() * len);
            var t = newArray[i];
            newArray[i] = newArray[p];
            newArray[p] = t;
          }
          return newArray;
        }
        test[a].example = arrayShuffle(test[a].example);
        console.log(test[a].example);

        res.render("exstart", {
          displayname: displayname,
          test: test[a],
          id: id
        });
      }
    });
  });
});
router.get("/exnew/:id", (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  var id = req.params.id;
  Category.find({ _id: id }, (err, category) => {
    res.render("exnew", { displayname: displayname, cate: category, id: id });
  });
});

router.get("/exed/:id", (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  var id = req.params.id;
  Test.find({ _id: id }, (err, test) => {
    Category.find({ name: test[0].category }, (err, category) => {
      res.render("exed", {
        displayname: displayname,
        test: test,
        cate: category
      });
    });
  });
});

router.get("/cted/:id", (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  var id = req.params.id;

  Category.findOne({ _id: id }, (err, category) => {
    res.render("cted", { displayname: displayname, category: category });
  });
});

router.post("/cted/:id", (req, res) => {
  var id = req.params.id;
  var name = req.body.category;
  var open = req.body.open;
  console.log("zz=" + name);
  Category.findOne({ _id: id }, (err, category) => {
    category.name = name;
    if (open == "공개") {
      category.open = true;
    } else {
      category.open = false;
    }
    category.save();
    res.redirect("/main/" + id);
  });
});

router.get("/recommend/:id", (req, res) => {
  var id = req.params.id;
  var usernickname = req.session.displayname;
  Test.findOne({ _id: id }, (err, test) => {
    User.findOne({ usernickname: usernickname }, (err, user) => {
      User.find({ _id: { $in: test.recommend } }, (err, test2) => {
        Category.findOne({ name: test.category }, (err, category) => {
          if (test2 == "") {
            test.recommend.push(user._id);
            test.save();
            res.redirect("/main/" + category._id);
          } else {
            test.recommend.pull(user._id);
            test.save();
            res.redirect("/main/" + category._id);
          }
        });
      });
    });
  });
});

router.post("/exnew/:id", (req, res) => {
  var id = req.params.id;
  var title = req.body.title;
  var open = req.body.open;
  var answer = req.body.answer;
  var answer1 = req.body.answer1;
  var answer2 = req.body.answer2;
  var answer3 = req.body.answer3;
  Category.find({ _id: id }, (err, category) => {
    if (open == 2) {
      var test = new Test({
        title: title,
        testtype: false,
        example: answer[1],
        category: category[0].name,
        answer: answer[1],
        author: req.session.displayname
      });
      test.save((err, test) => {});
    } else {
      var test = new Test({
        title: title,
        testtype: true,
        example: [answer[0], answer1, answer2, answer3],
        category: category[0].name,
        answer: answer[0],
        author: req.session.displayname
      });
      test.save((err, test) => {});
    }
    res.redirect("/main/" + id);
  });
});

router.post("/exed/:id", (req, res) => {
  var id = req.params.id;
  var title = req.body.title;
  var open = req.body.open;
  var answer = req.body.answer;
  var answer1 = req.body.answer1;
  var answer2 = req.body.answer2;
  var answer3 = req.body.answer3;
  Test.findOne({ _id: id }, (err, test) => {
    if (open == 2) {
      test.title = title;
      test.testtype = false;
      test.example = answer[0];
      test.answer = answer[0];
      test.save((err, test) => {});
    } else {
      test.title = title;
      test.testtype = true;
      test.example = [answer[0], answer1, answer2, answer3];
      test.answer = answer[0];
      test.save((err, a) => {
        console.log(err);
      });
    }
    Category.find({ name: test.category }, (err, category) => {
      console.log(category);
      res.redirect("/main/" + category[0]._id);
    });
  });
});

router.post("/ctnew", (req, res) => {
  if (req.body.open == "공개") {
    var category = new Category({
      name: req.body.category,
      author: req.session.displayname,
      open: true
    });
  } else {
    var category = new Category({
      name: req.body.category,
      author: req.session.displayname,
      open: false
    });
  }
  category.save((err, user) => {
    if (err) {
      res.send(
        '<script>alert("카테고리 확인");location.href="/post/ctnew";</script>'
      );
    } else {
      res.redirect("/main");
    }
  });
});
module.exports = router;
