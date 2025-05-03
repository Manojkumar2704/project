/// <reference types="cypress" />
import "cypress-file-upload";

describe("Upload Product Page", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "your-valid-test-token");
    cy.visit("http://localhost:3000/upload");
  });

  it("fills and submits the form successfully", () => {
    cy.intercept("POST", "http://localhost:7000/product/uploads", {
      statusCode: 200,
      body: { message: "Product added successfully" },
    }).as("addProduct");

    cy.get('input[name="name"]').type("Cypress Test Product");
    cy.get('input[name="description"]').type("Test description");
    cy.get('input[name="price"]').type("100");
    cy.get('input[name="quantity"]').type("5");

    const fileName = "test.jpg";

    cy.fixture(fileName, "base64").then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
        mimeType: "image/jpeg",
        encoding: "base64",
      });
    });

    cy.get('button[type="submit"]').click();

    cy.wait("@addProduct");

    cy.url().should("include", "/home");
  });
});
