const express=require('express');
const router=express.Router();

//controller
const instructionsController=require('../controller/instructions');
const searchController=require('../controller/searchData');
const reviewsController=require('../controller/getReviews');
const imagesController=require('../controller/getImages');
const descriptionController=require('../controller/getDescription')

router
.get('/',instructionsController.instruction)
.get('/search/:query',searchController.scrapeData)
.post('/reviews',reviewsController.scrapeReviews)
.post('/images',imagesController.scrapeImages)
.post('/details',descriptionController.scrapeDescription)

exports.router=router;