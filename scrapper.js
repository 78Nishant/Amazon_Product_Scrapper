const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('readline');

// Take user input
const inputQuery = () => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Search here: ', (query) => {
            console.log('You searched for: ' + query);
            rl.close();
            resolve(query);
        });
    });
};

const scrapeData = async () => {
    const query = await inputQuery();

    // Creating a new instance of the Chrome Browser
    let options = new chrome.Options();
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    options.addArguments('--ignore-certificate-errors');  // Bypass SSL errors
    // options.addArguments('--headless');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

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
                let productImage = await product.findElement(By.css('.s-image')).getAttribute('src');
                let productLink = await product.findElement(By.xpath('.//a[contains(@class, "a-link-normal") and contains(@class, "s-no-outline")]')).getAttribute('href');
                let productTitle=await product.findElement(By.css('.s-image')).getAttribute('alt');
                // let productTitle = await product.findElement(By.css('.a-size-base-plus a-spacing-none a-color-base a-text-normal')).getText();
                // let productLink = await productDescription.getAttribute('href');
                let productPrice = await product.findElement(By.css('.a-price-whole')).getText();

                console.log({
                    title: productTitle,
                    price: productPrice,
                    link: productLink,
                    image: productImage
                });
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

scrapeData();
