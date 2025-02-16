const express=require('express');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('readline');

const app=express();
app.use(express.json());
const port=3000;
let productInfo=[];
let reviewInfo=[];
app.get('/',(req,res)=>{
    res.json('This is a web scrapper');
})

app.get('/search/:query',async(req,res)=>{
    const query=req.params.query;
    // res.json('You searched for: '+query);
    productInfo=[];
    await scrapeData(query);
    res.json(productInfo);
})
app.post('/reviews',async(req,res)=>{
    const query=req.body.query;
    // const query=req.params.query;
    // res.json('You searched for: '+query);
    reviewInfo=[];
    await scrapeReviews(query);
    res.json("reviews scrapped");
})




// Take user input
// const inputQuery = () => {
//     return new Promise((resolve) => {
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout
//         });
//         rl.question('Search here: ', (query) => {
//             console.log('You searched for: ' + query);
//             rl.close();
//             resolve(query);
//         });
//     });
// };


//To get List of Searched Products
const scrapeData = async (query) => {
    // const query = await inputQuery();

    // Creating a new instance of the Chrome Browser
    let options = new chrome.Options();
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    options.addArguments('--ignore-certificate-errors');  // Bypass SSL errors
    options.addArguments('--headless');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    // await driver.sleep(5000);

    try {
        // Open Amazon
        await driver.get('https://www.amazon.in/');

        // Wait for the search bar to be present
        await driver.wait(until.elementLocated(By.id('twotabsearchtextbox')), 10000);

        // Finding the search bar and typing the search query
        let searchBar = await driver.findElement(By.id('twotabsearchtextbox'));
        await searchBar.sendKeys(query, Key.RETURN);

        // Wait for the product list to load
        await driver.wait(until.elementLocated(By.css('.s-main-slot .s-result-item')), 15000);

        // Get the list of products
        let productList = await driver.findElements(By.css('.s-main-slot .s-result-item'));

        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];

            // Extracting the product details
            try {
                let productDesc = await product.findElement(By.css('.s-image'))

                let productImage = await productDesc.getAttribute('src');
                let productLink = await product.findElement(By.xpath('.//a[contains(@class, "a-link-normal") and contains(@class, "s-no-outline")]')).getAttribute('href');
                let productTitle = await productDesc.getAttribute('alt');
                let productPrice = await product.findElement(By.css('.a-price-whole')).getText();

               // let productRating = await product.findElement(By.css('.a-icon a-icon-star-small a-star-small-4 .a-icon-alt')).getText();


                const products = ({
                    title: productTitle,
                    price: `₹${productPrice}`,
                    link: productLink,
                    image: productImage,
                    //rating: productRating
                });
                console.log(products)
                productInfo.push(products);
            } catch (err) {
                console.log('Error extracting product:', err);
            }
        }
    } catch (error) {
        console.log('Error:', error);
    } finally {
        await driver.quit();
    }
};

//To get Reviews of a Product
const scrapeReviews=async(query)=>{
    
    let options = new chrome.Options();
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    options.addArguments('--ignore-certificate-errors');  // Bypass SSL errors
    

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    // await driver.sleep(5000);

   
    try{
        await driver.get(query)

    let reviewsList = [];

    await driver.wait(until.elementLocated(By.css('.review.aok-relative')), 10000);
    const reviews = await driver.findElements(By.css('.review.aok-relative'));

    for (let review of reviews) {
      try {
        const reviewTitle = await review.findElement(By.css('.a-profile-name')).getText();
        const reviewDate = await review.findElement(By.css('.a-size-base.a-color-secondary.review-date')).getText();
        const reviewProductDetails = await review.findElement(By.css('.a-color-secondary')).getText();
        const reviewContent = await review.findElement(By.css('.a-expander-content.reviewText.review-text-content.a-expander-partial-collapse-content')).getText();
        const reviewRating = await review.findElement(By.css('.a-icon.a-icon-star.a-star-5.review-rating .a-icon-alt')).getText();
        
        reviewsList.push({
          title: reviewTitle,
          date: reviewDate,
          productDetails: reviewProductDetails,
          rating: reviewRating,
          content: reviewContent
        });
      } catch (innerError) {
        console.error('Error processing review:', innerError);
      }
    }
    console.log(reviewsList);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await driver.quit();
  }
};

// scrapeData();

app.listen(port,()=>{
    console.log('Server is running on port '+port);
})
