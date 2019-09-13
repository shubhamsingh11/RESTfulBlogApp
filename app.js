var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require('method-override');
var expressSanitizer=require('express-sanitizer');
var express=require('express');
var app=express();

//APP Config
mongoose.connect("mongodb://localhost/blog",{useNewUrlParser : true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE Model Config
var blogSchema = new mongoose.Schema({
	title : String,
	image : String,
	body : String,
	date : {type : Date ,default : Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

// Blog.create(
// {
// 	title : "Football",
// 	image : "https://images.unsplash.com/photo-1526635090919-b5d79657c5a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
// 	body : "The best game in the whole world or even the galaxy as shown in the Samsung Galaxy Ad LOL !"
// });


//RESTful ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
});
	
//NEW
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE
app.post("/blogs",function(req,res){
	//CREATE BLOG
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
			{
					console.log("SOMETHING WENT WRONG !");
				console.log(err);
			}
		else{
			//THEN REDIRECT TO BLOG PAGE
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log("SOMETHING WENT WRONG !");
		}
		else{
			res.render("show",{blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			{
				res.send("SOMETHING IS WRONG");
			}
		else{
			res.render("edit",{blog : foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog ,function(err, updatedBlog){
		if(err)
			{
				res.send("SOMETHING WENT WRONG");
			}
		else
			{
				res.redirect("/blogs/"+ req.params.id);
			}
	});
});
//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err)
			{
				res.send("SOMETHING IS WRONG");
			}
		else{
			res.redirect("/blogs");
		}
	});
	
});

app.listen(3000,function(req,res){
	console.log("The server has started.");
});
