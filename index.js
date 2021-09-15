const puppeteer = require('puppeteer');
const Sheet = require('./sheet');

const url = 'https://old.reddit.com/r/learnprogramming/comments/nlj8wz/what_is_a_term_or_a_basic_concept_that_beginners/';

(async function() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);

    const sheet = new Sheet();
    await sheet.load();
    // create new sheet with title as the title of reddit thread
    const title = await page.$eval('.title a', el => el.textContent);
    const sheetIndex = await sheet.addSheet(title.slice(0, 99), ['points', 'text']);
  
    //expand comment threads
    // let expandButtons = await page.$$('.morecomments');
    // while (expandButtons.length) {
    // for (let button of expandButtons) {
    //     await button.click();
    //     await page.waitFor(500);
    //     }
    //     await page.waitFor(1000);
    //     expandButtons = await page.$$('.morecomments');
    // }
    //select all comments, scrape text and points
    const comments = await page.$$('.entry');
    const formattedComments = [];
    for (let comment of comments) {
        //Scrape point
        const points = await comment.$eval('.score', el => el.textContent).catch(err => console.error('no score'));
        //Scrape text
        const rawText = await comment.$eval('.usertext-body', el => el.textContent).catch(err => console.error('no text'));
        if (points && rawText) {
            const text = rawText.replace(/\n/g, "");
            formattedComments.push({points, text});
        }
        console.log({points});
    }
    //sort comments by points
    formattedComments.sort((a, b) => {
        const pointsA = Number(a.points.split(' ')[0])
        const pointsB = Number(b.points.split(' ')[0])
        return pointsB - pointsA;
    })
    console.log(formattedComments.slice(0, 10));

    //insert into google spreadsheet
    sheet.addRows(formattedComments, sheetIndex);

    await browser.close();
})()