import mongoose from "mongoose";
import { Schema,model } from "mongoose"; 

const recipeSchema =new Schema({

    name:{
        type:String,
        required:"true",
        unique:"true"
    },
    ingredients:[{
        type:String,
        required:true
    }],
    desc:{
        type:String,
        required:"true"
    },
    image:{
        public_id: {
            type: String,
            required:true
            
          },
          secure_url: {
            type: String,
            required:true

          },
    },
    userOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{
    timestamps:true
        }

)
const Recipe=model('Recipe',recipeSchema)

export default Recipe;