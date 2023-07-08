/// <reference types="cypress" />

Cypress.Commands.add('teardown', () => {
	cy.exec(
		`curl -v -X DELETE "http://127.0.0.1:8080/emulator/v1/projects/fir-chat-12754/database/(default)/documents"`
	);
	cy.exec(
		`curl -v -X DELETE "http://127.0.0.1:9099/emulator/v1/projects/fir-chat-12754/accounts"`
	);
	cy.logout();
});

declare namespace Cypress {
	interface Chainable {
		teardown(): Cypress.Chainable<void>;
	}
}