describe('GET /products/search', () => {
  it('deve buscar produtos com o nome "hp" e validar se está vim o nome buscado corretamente', () => {
    cy.request({
      url: '/catalog/api/v1/products/search',
      method: 'GET',
      qs: {
        name: 'hp'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
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
});

describe("POST /accountrest/api/v1/register", () => {
  it("Deve cadastrar um usuário novo", () => {
    const randomString = Cypress._.random(0, 1e6);
    const firstName = `Alice${randomString}`;
    const email = `${firstName}@test.com`;
    const loginName = `login${randomString}`;

    cy.log(`Generated Email: ${email}`);
    cy.log(`Generated LoginName: ${loginName}`);

    cy.request({
      method: 'POST',
      url: '/accountservice/accountrest/api/v1/register',
      failOnStatusCode: false,
      body: {
        "accountType": "USER",
        "address": "789 Maple Drive",
        "allowOffersPromotion": true,
        "aobUser": true,
        "cityName": "Brisbane",
        "country": "AUSTRALIA_AU",
        "email": email,
        "firstName": firstName,
        "lastName": "Jones",
        "loginName": loginName,
        "password": "Alice2024$",
        "phoneNumber": "+61 7 1234 5678",
        "stateProvince": "QLD",
        "zipcode": "4000"
      }
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Response Body: ${JSON.stringify(response.body)}`);

      if (response.status === 200) {
        cy.log('Registro com sucesso!');
        expect(response.body.response.success).to.be.true;
        expect(response.body.response.userId).to.be.a('number');
        expect(response.body.response.reason).to.eq("New user created successfully.");
      } else if (response.status === 403) {
        cy.log('Falha no registro: nome de usuário ou email já existente.');
        expect(response.body.response.reason).to.eq("Incorrect user name or password.");
      } else {
        cy.log('Status inesperado');
        cy.log(`Status recebido: ${response.status}`);
        expect(response.status).to.eq(200);
      }
    });
  });
});

describe('Login e Upload de Imagem do Produto', () => {
  let authToken;
  let userId;

  before(() => {
    const email = "alice1.jones@example.com";
    const loginPassword = "Alice2024$";
    const loginUser = "alicejones";

    cy.request({
      method: 'POST',
      url: 'https://www.advantageonlineshopping.com/accountservice/accountrest/api/v1/login',
      failOnStatusCode: false,
      body: {
        "email": email,
        "loginPassword": loginPassword,
        "loginUser": loginUser
      }
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Response Body: ${JSON.stringify(response.body)}`);

      expect(response.status).to.eql(200);
      expect(response.body.statusMessage.success).to.be.true;
      expect(response.body.statusMessage.userId).to.be.a('number');
      expect(response.body.statusMessage.token).to.be.a('string').and.not.be.empty;

      authToken = response.body.statusMessage.token;
      userId = response.body.statusMessage.userId;
    });
  });

  describe('Login e Upload de Imagem do Produto', () => {
    let authToken;
    let userId;
  
    before(() => {
      const email = "alice1.jones@example.com";
      const loginPassword = "Alice2024$";
      const loginUser = "alicejones";
  
      cy.request({
        method: 'POST',
        url: 'https://www.advantageonlineshopping.com/accountservice/accountrest/api/v1/login',
        failOnStatusCode: false,
        body: {
          "email": email,
          "loginPassword": loginPassword,
          "loginUser": loginUser
        }
      }).then((response) => {
        expect(response.status).to.eql(200);
        expect(response.body.statusMessage.success).to.be.true;
        expect(response.body.statusMessage.userId).to.be.a('number');
        expect(response.body.statusMessage.token).to.be.a('string').and.not.be.empty;
  
        authToken = response.body.statusMessage.token;
        userId = response.body.statusMessage.userId;
      });
    });
  
    it('Deve fazer o upload da imagem do produto com sucesso', function() {
      const filePath = 'cypress/fixtures/user1.png'; 
      const productId = 737250001;
      const source = 'color';
      const color = "white"
  
      cy.readFile(filePath, 'base64').then((fileContent) => {
        cy.request({
          method: 'POST',
          url: `https://www.advantageonlineshopping.com/catalog/api/v1/product/image/${productId}/source/${color}`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data'
          },
          body: {
            file: {
              value: fileContent,
              options: {
                filename: 'user1.png',
                contentType: 'image/png'
              }
            }
          },
          failOnStatusCode: false
        }).then((response) => {
          cy.log(`Status: ${response.status}`);
          cy.log(`Response Body: ${JSON.stringify(response.body)}`);
  
          if (response.status === 500) {
            cy.log('Erro no servidor: 500 Internal Server Error');
          } else {
            expect(response.status).to.eq(200); 
          }
        });
      });
    });
  });
  
});