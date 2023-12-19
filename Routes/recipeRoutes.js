import { Router } from "express";
const router=Router();
import { getAllRecipes,createRecipe,searchRecipe, likedRecipes, getlikesids, getlikes, unlikedRecipes, getSingleRecipe, deleteRecipe, updateRecipe} from "../controller/recipeController.js";

import upload from '../multer/multer.js'

router.post('/createRecipe',upload.single("image"),createRecipe);
router.get('/getRecipe',getAllRecipes);
router.get('/singlerecipe/:recipeId',getSingleRecipe)
router.get('/search/:name',searchRecipe);
router.put('/like',likedRecipes);
router.put('/unlike', unlikedRecipes);
router.get("/likesIds/:userId",getlikesids);
router.get("/getlike",getlikes);
router.put('/edit/:id', upload.single('image'), updateRecipe);
router.delete('/delete/:id', deleteRecipe);
export default router;