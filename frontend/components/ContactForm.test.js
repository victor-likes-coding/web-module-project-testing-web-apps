import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

test("renders without errors", () => {
    render(<ContactForm />);
});

test("renders the contact form header", () => {
    render(<ContactForm />);
    const header = screen.getByText("Contact Form");
    expect(header).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
    render(<ContactForm />);
    const firstName = screen.getByLabelText("First Name*");
    userEvent.type(firstName, "John");
    expect(await screen.findByText("Error: firstName must have at least 5 characters.")).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole("button", { name: "Submit" });
    userEvent.click(submitButton);
    expect(await screen.findAllByTestId("error")).toHaveLength(3);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
    render(<ContactForm />);
    const firstName = screen.getByLabelText("First Name*");
    const lastName = screen.getByLabelText("Last Name*");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    userEvent.type(firstName, "Victor");
    userEvent.type(lastName, "Hugo");
    userEvent.click(submitButton);
    expect(await screen.findByTestId("error")).toBeInTheDocument();
    expect(await screen.findByText("Error: email must be a valid email address.")).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const email = screen.getByLabelText("Email*");
    userEvent.type(email, "test");
    expect(await screen.findByText("Error: email must be a valid email address.")).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole("button", { name: "Submit" });
    userEvent.click(submitButton);
    expect(await screen.findByText("Error: lastName is a required field.")).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
    render(<ContactForm />);
    const firstName = screen.getByLabelText("First Name*");
    const lastName = screen.getByLabelText("Last Name*");
    const email = screen.getByLabelText("Email*");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    userEvent.type(firstName, "Victor");
    userEvent.type(lastName, "Hugo");
    userEvent.type(email, "something@something.com");
    userEvent.click(submitButton);
    expect(await screen.findByText("You Submitted:")).toBeInTheDocument();
    expect(await screen.findByTestId("firstnameDisplay")).toBeInTheDocument();
    expect(await screen.findByTestId("lastnameDisplay")).toBeInTheDocument();
    expect(await screen.findByTestId("emailDisplay")).toBeInTheDocument();
});

test("renders all fields text when all fields are submitted.", async () => {
    render(<ContactForm />);
    const firstName = screen.getByLabelText("First Name*");
    const lastName = screen.getByLabelText("Last Name*");
    const email = screen.getByLabelText("Email*");
    const message = screen.getByLabelText("Message");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    userEvent.type(firstName, "Victor");
    userEvent.type(lastName, "Hugo");
    userEvent.type(email, "something@something.com");
    userEvent.type(message, "This is a message.");
    userEvent.click(submitButton);
    expect(await screen.findByText("You Submitted:")).toBeInTheDocument();
    expect(await screen.findByTestId("firstnameDisplay")).toBeInTheDocument();
    expect(await screen.findByTestId("lastnameDisplay")).toBeInTheDocument();
    expect(await screen.findByTestId("emailDisplay")).toBeInTheDocument();
    expect(await screen.findByTestId("messageDisplay")).toBeInTheDocument();
});
