const express=require('express');
const router=express.Router();

//controller
const instructionsController=require('../controller/instructions');
const searchController=require('../controller/searchData');
const reviewsController=require('../controller/getReviews');
const imagesController=require('../controller/getImages');

router
.get('/',instructionsController.instruction)
.get('/search/:query',searchController.scrapeData)
.post('/reviews',reviewsController.scrapeReviews)
.post('/images',imagesController.scrapeImages)

exports.router=router;