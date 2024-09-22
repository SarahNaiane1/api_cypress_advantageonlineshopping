describe('Login e Upload de Imagem do Produto', () => {
    let authToken;
    let userId;

    before(() => {
        const email = "934149@test.com";
        const loginPassword = "Alice2024$";
        const loginUser = "login934149";

        cy.request({
            method: 'POST',
            url: '/accountservice/accountrest/api/v1/login',
            failOnStatusCode: false,
            body: {
                email,
                loginPassword,
                loginUser
            }
        }).then((response) => {
            cy.log(`Status: ${response.status}`);
            cy.log(`Response Body: ${JSON.stringify(response.body)}`);

            expect(response.status).to.eq(200);
            expect(response.body.statusMessage.success).to.be.true;
            expect(response.body.statusMessage.userId).to.be.a('number');
            expect(response.body.statusMessage.token).to.be.a('string').and.not.be.empty;

            authToken = response.body.statusMessage.token;
            userId = response.body.statusMessage.userId;
        });
    });

    it('Deve fazer o upload da imagem do produto com sucesso', function () {
        const filePath = 'cypress/fixtures/user.png';
        const productId = 737250001;
        const source = 'api_cypress_advantageonlineshopping/cypress/fixtures/user.png';
        const color = 'red'; 

        cy.readFile(filePath, 'base64').then((fileContent) => {
            cy.request({
                method: 'POST',
                url: `/catalog/api/v1/product/image/${userId}/${source}/${color}`,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                },
                body: {
                    file: {
                        value: Cypress.Blob.base64StringToBlob(fileContent, 'image/png'),
                        options: {
                            filename: 'user.png',
                            contentType: 'image/png'
                        }
                    }
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log(`Status: ${response.status}`);
                cy.log(`Response Body: ${JSON.stringify(response.body)}`);

                expect(response.status).to.eq(200); 
                expect(response.body.message).to.eq('Upload bem-sucedido'); // Ajustar conforme a resposta real
            });
        });
    });
});

describe('Não deve permitir mudar a imagem do produto sem login', () => {
    it('Deve retornar 404 ao tentar mudar a imagem do produto sem autenticação', function () {
        const filePath = 'cypress/fixtures/user.png'; 
        const productId = 737250001; 
        const source = 'color'; 

        cy.readFile(filePath, 'base64').then((fileContent) => {
            cy.request({
                method: 'POST',
                url: `/api/v1/product/image/0/${source}`,
                headers: {
                    'Authorization': 'Bearer invalidToken' 
                },
                body: {
                    file: {
                        value: Cypress.Blob.base64StringToBlob(fileContent, 'image/png'), 
                        options: {
                            filename: 'user.png',
                            contentType: 'image/png'
                        }
                    }
                },
                failOnStatusCode: false
            }).then((changeResponse) => {
                expect(changeResponse.status).to.eq(404); 
                expect(changeResponse.body.message).to.eq('Unauthorized'); 
            });
        });
    });
});
