import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../../src/components/App";

describe("App", () => {
  it("renders counter button", () => {
    render(<App />);

    screen.debug();

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Count is/);
  });

  it("counter button", async () => {
    const user = userEvent.setup();
    render(<App />);
    const counter = screen.getByText(/Count/);
    await user.click(counter);
    await user.click(counter);
    expect(counter.textContent).toEqual("Count is 2");
  });
});

// import { vi, test, describe, it, expect } from "vitest";
// import userEvent from "@testing-library/user-event";
// import {
//   render,
//   screen,
//   waitForElementToBeRemoved,
// } from "@testing-library/react";
// import App from "../App.jsx";
// import { Input } from "../App.jsx";
//
// window.fetch = vi.fn(() => {
//   const user = { name: "Jack", email: "jack@email.com" };
//
//   return Promise.resolve({
//     json: () => Promise.resolve(user),
//   });
// });
//
// describe("Testing App Component", () => {
//   test("render h1 element", () => {
//     render(<App />);
//     screen.debug();
//     expect(screen.getByText(/Hello/)).toBeInTheDocument();
//     // expect(screen.getByText("Hello World")).toBeInTheDocument();
//   });
//
//   test("list contains 5 animals", () => {
//     render(<App />);
//
//     const listElement = screen.getByRole("list");
//     const listItems = screen.getAllByRole("listitem");
//
//     expect(listElement).toBeInTheDocument();
//     expect(listElement).toHaveClass("animals");
//     expect(listItems.length).toEqual(5);
//   });
//
//   test("loading text is shown while API request is in progress", async () => {
//     render(<App />);
//     const loading = screen.getByText("Loading...");
//
//     expect(loading).toBeInTheDocument();
//
//     await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
//   });
//
//   test("user's name is rendered", async () => {
//     render(<App />);
//     const userName = await screen.findByText("Jack");
//     expect(userName).toBeInTheDocument();
//   });
//
//   test("error message is shown", async () => {
//     window.fetch.mockImplementationOnce(() => {
//       return Promise.reject({ message: "API is down" });
//     });
//
//     render(<App />);
//
//     const errorMessage = await screen.findByText("API is down");
//     expect(errorMessage).toBeInTheDocument();
//   });
// });
//
// describe("Testing App Component", () => {
//   test("counter is incremented on increment button click", async () => {
//     const user = userEvent.setup();
//     render(<App />);
//
//     const counter = screen.getByTestId("counter");
//     const incrementBtn = screen.getByText("Increment");
//
//     await user.click(incrementBtn);
//     await user.click(incrementBtn);
//
//     expect(counter.textContent).toEqual("2");
//   });
//
//   test("counter is decremented on decrement button click", async () => {
//     const user = userEvent.setup();
//     render(<App />);
//
//     const counter = screen.getByTestId("counter");
//     const decrementBtn = screen.getByText("Decrement");
//
//     await user.click(decrementBtn);
//     await user.click(decrementBtn);
//
//     expect(counter.textContent).toEqual("-2");
//   });
// });
//
// test("input value is updated correctly", async () => {
//   const user = userEvent.setup();
//   render(<App />);
//
//   const input = screen.getByRole("textbox");
//   await user.type(input, "React");
//
//   expect(input.value).toBe("React");
// });
//
// test("call the callback every time input value is changed", async () => {
//   const handleChange = vi.fn();
//   const user = userEvent.setup();
//
//   render(<Input handleChange={handleChange} inputValue="" />);
//
//   const input = screen.getByRole("textbox");
//   await user.type(input, "React");
//
//   expect(handleChange).toHaveBeenCalledTimes(5);
// });
// // describe("something truthy and falsy", () => {
// //   it("true to be true", () => {
// //     expect(true).toBe(true);
// //   });
// //
// //   it("false to be false", () => {
// //     expect(false).toBe(false);
// //   });
// // });
// //
// // describe("App", () => {
// //   it("renders headline", () => {
// //     render(<App />);
// //
// //     const myHeading = screen.getByRole("heading");
// //     screen.debug(myHeading);
// //     expect(myHeading.textContent).toMatch(/Magnificent Monkeys/i);
// //
// //     // check if App components renders headline
// //   });
// // });
// //
// // describe("App component", () => {
// //   it("renders magnificent monkeys", () => {
// //     // since screen does not have the container property, we'll destructure render to obtain a container for this test
// //     const { container } = render(<App />);
// //     expect(container).toMatchSnapshot();
// //   });
// //
// //   it("renders radical rhinos after button click", async () => {
// //     const user = userEvent.setup();
// //
// //     render(<App />);
// //     const button = screen.getByRole("button", { name: "Click Me" });
// //
// //     await user.click(button);
// //
// //     expect(screen.getByRole("heading").textContent).toMatch(/radical rhinos/i);
// //   });
// // });
