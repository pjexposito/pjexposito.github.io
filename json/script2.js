const url = 'https://api-manager.elcorteingles.es/financialpromotionsservices/v1.0/financePromotions?references=001094612100019';
const url2 = 'https://www.elcorteingles.es/api/products/?product_id='
const url3 = 'https://www.mediamarkt.es/es/search.html?query='
const ean = '4905524930184'

fetch(url3+ean)
  .then(response => response.text())
  .then(html => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    var scripts = doc.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      var texto = script.innerHTML.trim();
      var prefijo = "window.__PRELOADED_STATE__ = ";
      if (texto.startsWith(prefijo)) {
        var indice = prefijo.length;
        var resultado = texto.substring(indice);
        var json = JSON.parse(resultado);
        var apolloState = json.apolloState;
        var keys = Object.keys(apolloState);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          if (key.indexOf("GraphqlPrice") >= 0) {
            var price = apolloState[key].price;
            console.log(price);
            break;
          }
        }
      }
    }
  })
  .catch(error => console.log(error));

