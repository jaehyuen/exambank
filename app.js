var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var multer = require("multer");
var session = require("express-session");
var post = require("./post.js");
var user = require("./user.js");

var http = require("http").Server(app);
var io = require("socket.io")(http);
require("date-utils");
var newDate = new Date();
var time = newDate.toFormat("YYYY-MM-DD HH24:MI:SS");
app.use(
  session({
    secret: "123qwe123qwe123qwe",
    resave: false,
    saveUninitialized: true
  })
);
var mongoose = require("mongoose");
var Category = require("./db/category");
var Test = require("./db/test");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/post", post);
app.use("/user", user);

app.use(express.static("style"));

app.set("view engine", "jade");
app.set("views", "./views");
app.locals.pretty = true;

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/exam");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("ok");
});

app.get("/", (req, res) => {
  res.render("start");
});

app.get(["/main", "/main/:id"], (req, res) => {
  if (req.session.displayname) {
    var displayname = req.session.displayname;
  } else {
    var displayname = "login";
  }
  var page = req.param("page");
  if (page == null) {
    page = 1;
  }
  var skipSize = (page - 1) * 7;
  var limitSize = 7;
  var pageNum = 1;
  console.log(page + ", " + skipSize + ", " + limitSize + ", " + pageNum);
  var id = req.params.id;
  if (id) {
    Category.count((err, count) => {
      pageNum = Math.ceil(count / limitSize);
      Category.find(
        {
          $or: [
            { open: true },
            { $and: [{ open: false }, { author: displayname }] }
          ]
        },
        (err, category) => {
          Category.find({ _id: id }, (err, category3) => {
            console.log(category3);
            Test.find({ category: category3[0].name }, (err, test) => {
              res.render("main", {
                displayname: displayname,
                category: category,

                cate_find_author: category3[0].author,
                cate_find_id: category3[0]._id,
                test: test,
                page: pageNum
              });
            });
          });
        }
      )
        .skip(skipSize)
        .limit(limitSize);
    });
  } else {
    Category.count((err, count) => {
      pageNum = Math.ceil(count / limitSize);
      Category.find(
        {
          $or: [
            { open: true },
            { $and: [{ open: false }, { author: displayname }] }
          ]
        },
        (err, category) => {
          console.log(category);
          res.render("main", {
            displayname: displayname,
            category: category,
            page: pageNum
          });
        }
      )
        .skip(skipSize)
        .limit(limitSize);
    });
  }
});

http.listen(3005, () => {
  console.log("connected 3005 port");
});
