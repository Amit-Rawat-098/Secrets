//jshint esversion:6
const express= require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const session= require("express-session");
const passport=require("passport");
const passportLocalMongoose= require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/userDB");

const app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: "Hello there its The amit Rawat.",
    resave: false,
    saveUninitialized: false
}));

// user schema
app.use(passport.initialize());
app.use(passport.session());

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(passportLocalMongoose);
const User=new mongoose.model("User",userSchema);




passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser=new User({
        email: req.body.username,
        password:req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Registered successfully");
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
User.findOne({email:req.body.username},function(err,element){
    if(err){
        console.log(err);
    }else{
        if(element){
            if(element.password===req.body.password){
                res.render("secrets");
            }else{
                res.send("Wrong email or password");
            }
        }else{
            res.send("Register First");
        }
    }
})
});

app.listen(3000,function(){
    console.log("Working on server 3000");
});