const express=require('express');

const instruct=['This is a web scrapper to extract any data from https://www.amazon.in/ use these paths :','/search/:query ---> To search a product(GET request)','/reviews ---> To get reviews of a product(POST request) pass link in req.body as query'];

const instruction=(req,res)=>{
    res.json(instruct);
}

exports.instruction=instruction;