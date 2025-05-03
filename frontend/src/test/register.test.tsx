import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Registration from "../pages/Registration";
import { registerUser } from "../store/slice/authSlice";


jest.mock("../store/slice/authSlice", () => ({
  registerUser: jest.fn(),
}));

const fakeAuthReducer = () => ({
  error: null,
});

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      auth: fakeAuthReducer, 
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <Registration />
      </Provider>
    ),
  };
};

describe("Registration", () => {
  it("dispatches registerUser on valid form submit", async () => {

    (registerUser as unknown as jest.Mock).mockReturnValue(() =>
      Promise.resolve({
        meta: { requestStatus: "fulfilled" },
      })
    );

    const { store } = renderWithStore();

    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        userName: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
    });
  });
});
