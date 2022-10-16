// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser: true});

const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articlesSchema);

//////////////////////////////////////////////Resuest Targeting all articles ///////////////////////////////////////////////////

app.get("/articles", function(req,res){
  Article.find(function(err, foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send(err);
    }
  });
});

app.post("/articles",function(req,res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Sucessfully added")
    }else{
      res.send(err);
    }
  });
});

app.delete("/articles",function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Sucessfully deleted all articles.");
    }else{
      res.send(err);
    }
  });
});

//////////////////////////////////////////////Resuest Targeting a specific articles ///////////////////////////////////////////////////

///app.route()

///// req.prams.articlesTitle = "Jquery" means when user search anything in the url will be able to get that data/////////

app.get("/articles/:articleTitle",function(req,res){
  Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles are matching that title");
    }
  });
});

app.put("/articles/:articleTitle",function(req,res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Sucessfully updated articles");
      }else{
        console.log(err);
      }
    }
  );
});

app.patch("/articles/:articleTitle",function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
      res.send("Sucessfully updated selected articles.")
    }else {
      res.send(err);
    }
  }
);
});

app.delete("/articles/:articleTitle",function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Sucessfully deleted the articles");
      }else{
        res.send(err);
      }
    }
  );
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
