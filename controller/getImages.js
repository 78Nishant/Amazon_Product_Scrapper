const express=require('express');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


const scrapeImages=async(req,res)=>{
    const query=req.body.query;
    let imagesList,reviewImages=[],promotionImages=[],productImage=[]
    let options = new chrome.Options();
        options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
        options.addArguments('--ignore-certificate-errors');  // Bypass SSL errors
        options.addArguments('--headless');
        options.addArguments("--no-sandbox")
        options.addArguments("--disable-dev-shm-usage")

    let driver=await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try{
        
        await driver.get(query);

        await driver.wait(until.elementLocated(By.css('img')), 10000);
        let images=await driver.findElements(By.css('img'));
        for(let image of images){
            try{
                const imageLink=await image.getAttribute('src');
                if(imageLink.includes('community-reviews')){
                    reviewImages.push(imageLink)
                }
                else if(imageLink.includes('aplus-media-library-service-media')){
                    promotionImages.push(imageLink);
                }
                else if (imageLink.includes('_SX') || imageLink.includes('_SY')) {
                    productImage.push(imageLink);
                }
                
                
            }catch(innerError){
                console.error('Error processing image:', innerError);
            }
        }
        imagesList={
            product:productImage,
            promotion:promotionImages,
            reviews:reviewImages,
        }
        // console.log(imagesList);
        res.json(imagesList);

    }catch(error){
        console.error('Error:', error);
    }
    finally{
        await driver.quit();
    }
    
    }       

    exports.scrapeImages=scrapeImages;