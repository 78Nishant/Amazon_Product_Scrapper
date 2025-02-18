const express=require('express');
const router=express.Router();
const instructionsController=require('../controller/instructions');
const searchController=require('../controller/searchData');
const reviewsController=require('../controller/getReviews');

router
.get('/',instructionsController.instruction)
.get('/search/:query',searchController.scrapeData)
.post('/reviews',reviewsController.scrapeReviews);

exports.router=router;