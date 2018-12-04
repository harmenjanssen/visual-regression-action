const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const { promisify } = require('util');
const BlinkDiff = require('blink-diff');

/**
 * Turn any command into a background process by appending an ampersand
 */
const toBackgroundProcess = cmd => cmd[cmd.length - 1] === '&'
  ? cmd
  : `${cmd} > /dev/null 2>&1 &`;

/**
 * Take (full-page) screenshot and return image buffer.
 * @see https://stackoverflow.com/questions/47616985/node-puppeteer-take-screenshot-full-page-spa
 */
const takeScreenshot = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });
  await page.waitFor(500);

  return page.screenshot({ fullPage: true });
};

/**
 * Compare screenshots, and return an image showing the diff.
 */
module.exports = async (startServer, localUrl, productionUrl) => {
  execSync(toBackgroundProcess(`${startServer}`));

  const browser = await puppeteer.launch({
    timeout: 100000
  });
  const screenLocal = await takeScreenshot(browser, localUrl);
  const screenProduction = await takeScreenshot(browser, productionUrl);

  const diff = new BlinkDiff({
    imageA: screenLocal,
    imageB: screenProduction,
    composition: false,

    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01, // 1% threshold

    imageOutputPath: './diff.png'
  });

  const diffRun = promisify(diff.run).bind(diff);
  return diffRun();
};
