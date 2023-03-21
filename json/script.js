const url = 'https://api-manager.elcorteingles.es/financialpromotionsservices/v1.0/financePromotions?references=001094612100019';
const url2 = 'https://www.elcorteingles.es/api/products/?product_id='


fetch(url)
  .then(response => response.json())
  .then(data => {
	console.log(data.products_finance_promotions[0].product_id);
    const valorPepito = data.products_finance_promotions[0].product_id;
    document.getElementById('resultado').textContent = valorPepito;
	return fetch(url2+valorPepito);
  })
  .then(response => response.json())
  .then(data => {
    const datos_precio = data.data[0]._datalayer[0].product.price;
    const datos_nombre = data.data[0].title;
    const datos_ean = data.data[0]._gtin;
    const datos_marca = data.data[0]._brand.name;
	console.log(datos_precio, datos_nombre, datos_ean, datos_marca);
    document.getElementById('resultado').textContent = datos_marca+' '+datos_nombre+' '+datos_ean+' '+datos_precio.f_price+' euros';
	
  })
  .catch(error => {
    console.error('Error al descargar el archivo JSON:', error);
  });