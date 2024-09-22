describe('POST /accountrest/api/v1/login', () => {
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

    it('Deve se logar com sucesso', () => {
     
            const email = "934149@test.com";
            const loginPassword = "Alice2024$";
            const loginUser = "login934149";
    
            cy.request({
                method: 'POST',
                url: '/accountservice/accountrest/api/v1/login',
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
    
            
            });
        });
   
});