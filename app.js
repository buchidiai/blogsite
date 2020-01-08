//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/keys");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(mongoURI, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
  })
  .then(() => console.log(`Database has connected successfully`))
  .catch(error => {
    console.log("error connectiong to db", error);
  });

const blogSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  Blog.find({})
    .then(result => {
      res.render("home", { content: homeStartingContent, posts: result });
    })
    .catch(err => {
      console.log("error occured");
    });
});

app.get("/about", (req, res) => {
  res.render("about", { content: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { content: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const blog = new Blog({
    title: _.capitalize(req.body.composeTitle),
    body: _.capitalize(req.body.composeBody)
  });

  blog
    .save()
    .then(() => {
      console.log("saved " + req.body.composeTitle + req.body.composeBody);
      res.redirect("/");
    })
    .catch(err => {
      console.log("error while saving post");
    });
});

app.get("/posts/:id", (req, res) => {
  const requestId = req.params.id;

  Blog.findOne({ _id: requestId })
    .then(result => {
      res.render("post", { content: result });
    })
    .catch(err => {
      console.log("error occur finding post" + err);
    });
});

const port = 3000;
app.listen(port, function() {
  console.log("Server started on port " + port);
});
