const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const view = document.querySelector('#view-login');
    console.log('view-login class:', view.className);
    console.log('view-login display:', getComputedStyle(view).display);
    console.log('view-login opacity:', getComputedStyle(view).opacity);
    
    const wrapper = document.querySelector('.login-wrapper');
    if (!wrapper) {
      console.log('NO LOGIN WRAPPER FOUND!');
      return;
    }
    console.log('login-wrapper display:', getComputedStyle(wrapper).display);
    console.log('login-wrapper opacity:', getComputedStyle(wrapper).opacity);
    console.log('login-wrapper width:', getComputedStyle(wrapper).width);
    console.log('login-wrapper height:', getComputedStyle(wrapper).height);
    console.log('login-wrapper visibility:', getComputedStyle(wrapper).visibility);
    console.log('login-wrapper z-index:', getComputedStyle(wrapper).zIndex);
    
    const left = document.querySelector('.left-section');
    if (left) {
      console.log('left-section bg:', getComputedStyle(left).background);
      console.log('left-section width:', getComputedStyle(left).width);
    }
  });

  await browser.close();
})();
