describe('GET /products/search', () => {
  it('deve buscar produtos com o nome "hp" e validar se está vindo o nome buscado corretamente', () => {
    cy.request({
      url: '/catalog/api/v1/products/search',
      method: 'GET',
      qs: { name: 'hp' },
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an('array');
      response.body.forEach((category) => {
        expect(category).to.have.property('products');
        expect(category.products).to.be.an('array');
        category.products.forEach((product) => {
          expect(product).to.have.property('productName');
          expect(product.productName).to.be.a('string');
          expect(product.productName.toLowerCase()).to.contain('hp');
        });
      });
    });
  });
  it('deve buscar produtos com o nome completo do produto e validar se está vindo o nome buscado corretamente', () => {
    const productName = 'HP Pavilion 15t Touch Laptop'; 
  
    cy.request({
      url: '/catalog/api/v1/products/search',
      method: 'GET',
      qs: { name: productName },
      failOnStatusCode: false, 
    }).then((response) => {
      expect(response.status).to.eq(200); 
      expect(response.body).to.be.an('array'); 
  
      
      const productsFound = response.body.filter((category) => category.products).flatMap(category => category.products);
      productsFound.forEach((product) => {
        expect(product).to.have.property('productName');
        expect(product.productName).to.contain(productName); 
      });
    });
  });
  
  it('Deve retornar 200 se o nome do produto estiver vazio', () => {
    cy.request({
      url: '/catalog/api/v1/products/search?name=',
      method: 'GET',
      qs: { name: '' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    
    });
  });

  it('Deve retornar 200 se o nome do produto contiver caracteres inválidos', () => {
    cy.request({
      url: '/catalog/api/v1/products/search',
      method: 'GET',
      qs: { name: '@@@' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200); 
      expect(response.body).to.be.empty; 
    });
  });
  
});
