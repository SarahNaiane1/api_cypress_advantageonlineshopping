describe('GET /products/search', () => {
  it('deve buscar produtos com o nome "hp"', () => {
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
      expect(response.body.length).to.be.greaterThan(0);  
    });
  });
});

describe("POST /accountrest/api/v1/register", () => {
  it("Deve cadastrar um usuário novo", () => {
    const randomString = Cypress._.random(0, 1e6);
    const email = `user${randomString}@test.com`;  
    const loginName = `user${randomString}`;

    cy.log(`Generated Email: ${email}`);
    cy.log(`Generated LoginName: ${loginName}`);

    cy.request({
      method: 'POST',
      url: '/accountservice/accountrest/api/v1/register',  
      failOnStatusCode: false,
      body: {
        accountType: "USER",
        address: "123 Elm Street, Apt 4B",
        allowOffersPromotion: true,
        aobUser: false,
        cityName: "Sydney",
        country: "AUSTRALIA_AU",
        email: email,
        firstName: "Jane100",
        lastName: "Doe100",
        loginName: loginName,
        password: "securePa$$w0rd",
        phoneNumber: "+61 2 9876 5432",
        stateProvince: "NSW",
        zipcode: "2000"
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
