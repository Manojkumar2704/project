describe("Update Product Page", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "your-valid-test-token");
    cy.intercept("GET", "http://localhost:7000/product/getone/123", {
      statusCode: 200,
      body: {
        _id: "123",
        name: "Old Product",
        description: "Old description",
        price: 99,
        quantity: 10,
        image: ["http://localhost:7000/images/test.jpg"],
      },
    }).as("fetchProduct");

    cy.intercept("PUT", "http://localhost:7000/product/updateproduct/123", {
      statusCode: 200,
      body: { message: "Product updated successfully" },
    }).as("updateProduct");

    cy.visit("http://localhost:3000/update/123");
    cy.wait("@fetchProduct");
  });

  it("should fill the form, upload a new image and submit", () => {
    cy.get('input[name="name"]').clear().type("Updated Product");
    cy.get('input[name="description"]').clear().type("Updated description");
    cy.get('input[name="price"]').clear().type("120");
    cy.get('input[name="quantity"]').clear().type("5");

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

    cy.wait("@updateProduct");

    cy.url().should("include", "/home");
  });

  it("should remove an existing image", () => {
    cy.intercept(
      {
        method: "DELETE",
        url: /\/product\/delete-image\?imageUrl=.*&productId=.*/,
      },
      {
        statusCode: 200,
        body: {
          message:
            "Image deleted successfully from both file system and database",
        },
      }
    ).as("removeImage");

    cy.contains("Remove").click();

    cy.wait("@removeImage").its("response.statusCode").should("eq", 200);
  });
});
