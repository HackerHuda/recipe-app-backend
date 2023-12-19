import mongoose, {Schema,model, mongo} from "mongoose"

const userSchema=new Schema({

Name:{
    type:"string",
    
},
email:{
    type:"string"
},
password:{
type:"string"
},
likedRecipes:[{
    type:mongoose.Schema.Types.ObjectId, 
    ref:"Recipe"
}]},
{
    timestamps:true
}
);

const User=model('User',userSchema);
export default User;