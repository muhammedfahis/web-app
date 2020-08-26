const express=require('express');
const exhbr=require('express-handlebars');
const path=require('path');
const User=require('./lib/User');
const mongoose= require('mongoose');
const session=require('express-session');
const uri='mongodb://localhost/mydb'


mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const app=express();
const PORT=process.env.PORT ||9001;

app.engine('handlebars',exhbr());
app.set('view engine','handlebars');

app.use(express.static(path.join('public')));
app.set('views', path.join(__dirname, 'views'));


app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret:'ok',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*60*24
    }
}))

const loginchecker =(req,res,next)=>{
    if(!req.session.email){
        res.redirect('/login');
    }
    next()
}




app.get('/home',loginchecker,(req,res)=>{
res.render('home',{title:'home'});
});

app.get('/register',(req,res)=>{
    res.render('register',{title:'register',style:'register.css'});
});

app.get('/login',(req,res)=>{

    res.render('login',{title:'login',style:'login.css'});
});

app.post('/register',(req,res)=>{
   let email=req.body.email;
   let name=req.body.name;
   let password=req.body.password;


   const newUser=new User();
   newUser.name=name;
   newUser.email=email;
   newUser.password=password;
   newUser.save()
   res.redirect('/login');
   
});

app.post('/login',(req,res)=>{
   const { email,password }=req.body;
   User.findOne({email:email,password:password}).exec((err,user)=>{
       if(user){
           req.session.email=email;
           res.redirect('/home');
       }else{
           res.redirect('/login');
       }
   })
})

app.post('/logout',(req,res)=>{
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect('/login');
})















app.listen(PORT,()=>console.log(`server is running on ${PORT} `));