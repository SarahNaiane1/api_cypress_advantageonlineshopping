describe("POST /accountrest/api/v1/register", () => {
    it("Deve cadastrar um usuário novo", () => {
        const randomString = Cypress._.random(0, 1e6);
        const email = `${randomString}@test.com`;
        const loginName = `login${randomString}`;
        
        cy.log(`Email: ${email}`);
        cy.log(`Login Name: ${loginName}`);
   
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            failOnStatusCode: false,
            body: {
                "accountType": "USER",
                "email": email,
                "loginName": loginName,
                "password": "Alice2024$",
                "address": "789 Maple Drive",
                "cityName": "Brisbane",
                "country": "AUSTRALIA_AU",
                "phoneNumber": "+61 7 1234 5678",
                "stateProvince": "QLD",
                "zipcode": "4000"
            }
            
        }).then((response) => {
            if (response.status === 200) {
                expect(response.body.response.success).to.be.true;
            }
        });
    });

    it("Deve retornar 403 se o email já existir", () => {
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            failOnStatusCode: false,
            body: {
                "accountType": "USER",
                "email": "existinguser@test.com", 
                "loginName": "newUser",
                "password": "SecurePassword123!",
                "address": "789 Maple Drive",
                "cityName": "Brisbane",
                "country": "AUSTRALIA_AU",
                "phoneNumber": "+61 7 1234 5678",
                "stateProvince": "QLD",
                "zipcode": "4000"
            }
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.response.reason).to.eq("Incorrect user name or password.");
        });
    });

    it("Deve retornar 500 se o corpo da requisição estiver vazio", () => {
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            failOnStatusCode: false,
            body: {} 
        }).then((response) => {
            expect(response.status).to.eq(500);         
            expect(response.body.response.reason).to.contain("Could not accept null for argument [login name]");
        });
    });
    it("Deve retornar 403 se o nome estiver vazio", () => {
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            failOnStatusCode: false,
            body: {
                "accountType": "USER",
                "email": "newUser@test.com",
                "loginName": "newUser",
                "password": "SecurePassword123!",
                "firstName": "",  
                "lastName": "Smith"
            }
        }).then((response) => {
            expect(response.status).to.eq(403);
             expect(response.body).to.be.an('object');    
            expect(response.body).to.have.property('response');
            expect(response.body.response.reason).to.eq("Incorrect user name or password.");
        });
    });
    

    it("Deve retornar 403 se a senha for muito fraca", () => {
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            failOnStatusCode: false,
            body: {
                "accountType": "USER",
                "email": "weakpassword@test.com",
                "loginName": "weakUser",
                "password": "1" 
            }
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.response.reason).to.eq("Incorrect user name or password.");
        });
    });
    it("Deve retornar 500 se o email estiver vazio", () => {
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            failOnStatusCode: false,
            body: {
                "accountType": "USER",
                "email": "", 
                "loginName": "newUser",
                "password": "SecurePassword123!"
            }
        }).then((response) => {
            expect(response.status).to.eq(500);
            
            expect(response.body).to.be.an('object');
    
            expect(response.body).to.have.property('response');
            expect(response.body.response.reason).to.include("Could not accept a blank string for argument [email]");
        });
    });
    

    it("Deve retornar 400 se a senha estiver vazia", () => {
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            failOnStatusCode: false,
            body: {
                "accountType": "USER",
                "email": "novusertest@test.com",
                "loginName": "newUser",
                "password": "" 
            }
        }).then((response) => {
            expect(response.status).to.eq(500);
        });
    });
});
