//visit local host
// describe('Form Testing',function(){
//     cy.visit("http://localhost:3000/");
//     it('Check if Name input exist',function(){
//         cy.get('[data-cy="urname"]').type("Hello").should("have value","Hello");
//         })
// });

describe('My Second Test', function () {
    //Arrange
    it('Visits my new site!', function() {
    // Act
    cy.visit("http://localhost:3000/");
    cy.get('[name=fname]').type("StarMan").should("have.value","StarMan");
    cy.get('[name=email]').type("starman@gmail.com").should("have.value","starman@gmail.com");
    cy.get('[name=password]').type("Hello@123");
    cy.get('[name=confirmPassword]').type("Hello@123")
    cy.get('[name=terms]').click()
    cy.contains('Submit').click()
    })
})

// Use an assertion to check if the text inputted contains the name you provided (Hint: use the .should assertion)
// Get the Email input and type an email address in it
// Get the password input and type a password in it
// Set up a test that will check to see if a user can check the terms of service box
// Check to see if a user can submit the form data
// Check for form validation if an input is left empty


// // Get the Name input and type a name in it.
// describe('Name input',function(){
//     it('Check if Name input exist',function(){
//     cy.get('[data-cy="urname"]').type("Hello").should("have value","Hello");
//     })
// })