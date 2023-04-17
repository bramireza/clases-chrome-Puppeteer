const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    arg: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.goto("https://api.regulaforensics.com/?utm_source-docs");

  const fileElement = await page.$(".upload-data>input[type=file]");
  await fileElement.uploadFile("./images/dni.jpeg");

  const selectorRowsInformation = "tbody > tr";
  await page.waitForSelector(selectorRowsInformation);

  const dniInformation = await page.evaluate(
    ({ selectorRowsInformation }) => {
      const arrayElements = [
        ...document.querySelectorAll(selectorRowsInformation),
      ];
      const dniInformation = arrayElements.map((el) => {
        const [
          { innerText: attribute },
          { innerText: MRZ },
          { innerText: visualZone },
        ] = el.children;
        const value = visualZone != "" ? visualZone : MRZ;
        return { attribute, value };
      });
      return dniInformation;
    },
    {
      selectorRowsInformation,
    }
  );
  console.log(JSON.stringify(dniInformation, "", 2));
})();
