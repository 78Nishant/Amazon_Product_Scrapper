
# Amazon Product Scraper

This project is a Node.js-based web scraper that extracts product details such as the title, price, rating, and image URL from Amazon search results. It uses Selenium WebDriver for automation and Puppeteer for headless browsing.

## Features

- Extracts product title, price, rating, and image URL from Amazon search results
- Uses Selenium WebDriver with ChromeDriver for automation
- Headless browsing with Puppeteer

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/)
- [ChromeDriver](https://chromedriver.chromium.org/downloads)
- [Google Chrome](https://www.google.com/chrome/)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/amazon-product-scraper.git
    cd amazon-product-scraper
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Open the `scrapper.js` file and modify the search query as needed.
2. Run the scraper using:
    ```sh
    node scrapper.js
    ```

## File Structure

```
amazon-product-scraper/
│
├── scrapper.js        # Main scraper script
├── package.json       # Node.js dependencies
└── README.md          # Project documentation
```

## Troubleshooting

- If you encounter errors related to `NoSuchElementError`, make sure the selectors in `scrapper.js` are up-to-date with Amazon's HTML structure.
- Ensure your ChromeDriver version matches your installed Google Chrome version.

## License

This project is licensed under the MIT License.
