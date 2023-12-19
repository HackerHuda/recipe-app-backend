import Recipe from "../models/recipe.js";
import cloudinary from "cloudinary"
import exp from "constants";
import fs from 'fs/promises';
import User from "../models/model.js";

const getAllRecipes=async(req,res)=>{
    try{
        const recipe = await Recipe.find({});
        res.status(200).json({
            success: true,
            message: 'All Recipies',
            recipe,
      });
    }catch(err){
        res.json(err);
    }
    
}
const getSingleRecipe=async(req,res)=>{
    try{
        const {recipeId}= req.params;
        const recipe= await Recipe.findById(recipeId);
        res.status(200).json({
            success: true,
            message:'Single recipe',
            recipe,
        })
    }catch(err){
        res.json(err);
    }
}
const createRecipe=async(req,res)=>{
    const {name,ingredients,desc,image,userOwner}=req.body;
    try{
        const recipe=await Recipe.create({
            name,
            ingredients,
            desc,
            image :{
                public_id: 'Dummy',
                secure_url : 'Dummy',
              }, 
            userOwner,    
        });
    
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'lmk',
            width: 250,
            height: 250,
            gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
            crop: 'fill',
            // Save files in a folder named lms
          });
    
          // If success
          if (result) {
            // Set the public_id and secure_url in array
            recipe.image.public_id = result.public_id;
            recipe.image.secure_url = result.secure_url;
          }
    
          // After successful upload remove the file from local storage
          fs.rm(`uploads/${req.file.filename}`);
    
          await recipe.save();
    
      res.status(200).json({
        success: true,
        message: 'Recipe created successfully',
        recipe,
      });
    }catch(err){
        res.json(err)
    }
    
}
const likedRecipes = async (req,res)=>{
    
    try{
        const recipe = await Recipe.findById(req.body.recipeId);
        const user =await User.findById(req.body.userId)
        const response = await recipe.save();
        user.likedRecipes.push(recipe);
        await user.save();
        res.json({likedRecipes:user.likedRecipes})
    }catch(err){
        res.json(err)
    }
}

const unlikedRecipes = async (req, res) => {
    try {
        const recipeId = req.body.recipeId;
        const userId = req.body.userId;
        const user = await User.findByIdAndUpdate(userId, { $pull: { likedRecipes: recipeId } }, { new: true });

        res.json({ likedRecipes: user.likedRecipes });
    } catch (err) {
        res.json(err);
    }
};


const getlikesids = async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        res.json({likedRecipes:user?.likedRecipes});

    }catch(err){
        res.json(err)
    }
}
const getlikes = async (req,res)=>{
    try{
        const user = await User.findById(req.body.userId);
        const likedRecipes =await Recipe.find({
            _id:{$in : user.likedRecipes},
        });
        res.json({likedRecipes:user?.likedRecipes});

    }catch(err){
        res.json(err)
    }
}

const searchRecipe=async(req, res) => {
    try {
        const searchName = req.params.name;

        // Use a regular expression to perform a case-insensitive search
        const recipe = await Recipe.findOne({ name: { $regex: new RegExp(searchName, 'i') } });
        console.log(recipe);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipes not found' });
          }

        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const updateRecipe = async (req, res, next) => {
  const { name, ingredients, desc } = req.body;
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (userId !== recipe.userOwner.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to update this recipe' });
    }

    if (name || ingredients || desc) {
      // Update only if the field is provided
      if (name) recipe.name = name;
      if (ingredients) recipe.ingredients = ingredients;
      if (desc) recipe.desc = desc;
    }

    if (req.file) {
      // Delete the previous image from Cloudinary
      await cloudinary.v2.uploader.destroy(recipe.image.public_id);

      // Upload the new image to Cloudinary
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms',
          width: 250,
          height: 250,
          gravity: 'faces',
          crop: 'fill',
        });

        if (result) {
          recipe.image.public_id = result.public_id;
          recipe.image.secure_url = result.secure_url;
        }
      } catch (err) {
        console.log(err);
      }
    }

    // Save the updated recipe object
    await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe details updated successfully',
    });
  } catch (error) {
    console.error(error);
  }
};    

const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    const {userId} =req.body;
    try {
        // Find the recipe by ID
        const recipe = await Recipe.findById(id);
        console.log(userId);
        if (!recipe) {
          return res.status(404).json({ success: false, message: 'Recipe not found' });
        }
        
        if (userId !== recipe.userOwner.toString()) {
          return res.status(403).json({ success: false, message: 'You do not have permission to delete this recipe' });
        }
    
        await cloudinary.v2.uploader.destroy(recipe.image.public_id);
 
        await Recipe.findByIdAndDelete(id);
    
        res.status(200).json({
          success: true,
          message: 'Recipe deleted successfully',
        });
      } catch (error) {

        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  };
  
export {
    getAllRecipes,
    getSingleRecipe,
    createRecipe,
    searchRecipe,
    likedRecipes,
    unlikedRecipes,
    getlikesids,
    getlikes,
    updateRecipe,
    deleteRecipe,
}