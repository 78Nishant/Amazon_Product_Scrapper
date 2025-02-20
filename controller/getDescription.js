const express=require('express')
const {Builder,By,wait,Key, until}=require("selenium-webdriver")
const chrome=require("selenium-webdriver/chrome")

const scrapeDescription=async(req,res)=>{
    const query=req.body.query;
    let productDescription=[]
    const options=new chrome.Options();

    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    options.addArguments('--ignore-certificate-errors');  // Bypass SSL errors

    const driver=await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try{
        await driver.get(query);

        await driver.wait(until.elementLocated(By.css(' .a-spacing-mini .a-list-item')),10000)
        let descriptions=await driver.findElement(By.css(' .a-spacing-mini .a-list-item'))
        
        for(let description of descriptions){
            let point=await description.getText()
            productDescription.push(point)
        }
        console.log(productDescription)
        res.json(productDescription)

    }catch(error){
        console.log("Error",error)
    }
    finally{
        await driver.quit()
    }
    
}

exports.scrapeDescription=scrapeDescription