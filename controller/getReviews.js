const express = require('express');

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('readline');

const scrapeReviews=async(req,res)=>{
    const query=req.body.query;
    let reviewsList=[];
    let options = new chrome.Options();
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    options.addArguments('--ignore-certificate-errors');  // Bypass SSL errors
    

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    // await driver.sleep(5000);

   
    try{
        await driver.get(query)

    await driver.wait(until.elementLocated(By.css('.review.aok-relative')), 10000);
    const reviews = await driver.findElements(By.css('.review.aok-relative'));

    for (let review of reviews) {
      try {
        const reviewTitle = await review.findElement(By.css('.a-profile-name')).getText();
        const reviewDate = await review.findElement(By.css('.a-size-base.a-color-secondary.review-date')).getText();
        
        const reviewContent = await review.findElement(By.css('.a-expander-content.reviewText.review-text-content.a-expander-partial-collapse-content')).getText();
        
        //Issue :- Unable to scrap reviews 

        //const reviewRating = await review.findElement(By.xpath('//span[contains(@class, "a-icon-alt")]')).getText();
        
        reviewsList.push({
          title: reviewTitle,
          date: reviewDate,
          // rating: reviewRating,
          content: reviewContent
        });
      } catch (innerError) {
        console.error('Error processing review:', innerError);
      }
    }
    console.log(reviewsList);
    res.json(reviewsList);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await driver.quit();
  }
};
exports.scrapeReviews=scrapeReviews;