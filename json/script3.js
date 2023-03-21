const url = 'https://api-manager.elcorteingles.es/financialpromotionsservices/v1.0/financePromotions?references=001094612100019';
const url2 = 'https://www.elcorteingles.es/api/products/?product_id='
const url3 = 'https://www.mediamarkt.es/es/search.html?query='
const ean = '4905524930184'

async function getPriceFromURL(url) {
  const response = await fetch(url);
  const html = await response.text();

  const doc = new DOMParser().parseFromString(html, "text/html");

  let price;
  let found = false;

  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === "script") {
      const text = node.textContent.trim();
      const prefix = "window.__PRELOADED_STATE__ = ";
      if (text.startsWith(prefix)) {
        const jsonStr = text.slice(prefix.length);
        const jsonData = JSON.parse(jsonStr);
        const apolloState = jsonData.apolloState;
        for (const key in apolloState) {
          if (key.includes("GraphqlPrice")) {
            price = apolloState[key].price;
            found = true;
            break;
          }
        }
      }
    }
    for (const child of node.childNodes) {
      processNode(child);
      if (found) {
        return;
      }
    }
  }

  processNode(doc);
  return price;
}


getPriceFromURL(url3+ean)
  .then(price => {
    console.log(price);
  })
  .catch(error => {
    console.error(error);
  });