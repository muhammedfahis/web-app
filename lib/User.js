const mongoose=require('mongoose');



const userSchema=new mongoose.Schema({
  email:{type:'string'},
  name:{type:'string'},
  password:{type:'string'},
});

const user=mongoose.model('myuser',userSchema);
module.exports=user;

