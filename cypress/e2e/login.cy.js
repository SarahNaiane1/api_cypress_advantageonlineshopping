describe('POST /accountrest/api/v1/register', () => {
    it('Deve cadastrar um usuário novo com sucesso', () => {
        const randomString = Cypress._.random(0, 1e6);
        const email = `${randomString}@test.com`;
        const loginName = `login${randomString}`;

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

    it('Deve retornar 403 se o email já existir', () => {
        const existingUserData = {
            "accountType": "USER",
            "email": "existinguser@example.com",
            "loginName": "existingLogin",
            "password": "Alice2024$",
            "address": "123 Example Street",
            "cityName": "Brisbane",
            "country": "AUSTRALIA_AU",
            "phoneNumber": "+61 7 1234 5678",
            "stateProvince": "QLD",
            "zipcode": "4000"
        };

        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/register',
            body: existingUserData,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.response.reason).to.eq("User name already exists");
        });
    });


    it('Deve retornar 403 se o email estiver incorreto', () => {
        const loginData = {
            "email": "uunsiqueuser@example.com1",
            "loginPassword": "Alice2024$",
            "loginUser": "validLogin"
        };

        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/login',
            body: loginData,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.statusMessage.reason).to.eq("Incorrect user name or password.");
        });
    });

    it('Deve retornar 403 se o LoginPassword estiver incorreto', () => {
        const loginData = {
            "email": "uunsiqueuser@example.com",
            "loginPassword": "Alice20241$",
            "loginUser": "validLogin"
        };

        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/login',
            body: loginData,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.statusMessage.reason).to.eq("Incorrect user name or password.");
        });
    });
    it('Deve retornar 403 se o LoginUser estiver incorreto', () => {
        const loginData = {
            "email": "uunsiqueuser@example.com",
            "loginPassword": "Alice2024$",
            "loginUser": "validLogin1"
        };

        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/login',
            body: loginData,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.statusMessage.reason).to.eq("Incorrect user name or password.");
        });
    });
    it('Deve retornar 500 se a requisição estiver vazia', () => {
        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/login',
            body: {},
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body.statusMessage.reason).to.eq("Client received SOAP Fault from server: java.lang.NullPointerException Please see the server log to find more detail regarding exact cause of the failure."); // Ajuste a mensagem conforme necessário

        });

    });

});
