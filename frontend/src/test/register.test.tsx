import React from "react";
import { render,screen} from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import axios from "axios";
import Registration from "../pages/Registration";

jest.mock("axios")
// const mockedAxios=axios as jest.Mocked<typeof axios>

describe ("register component",async()=>{
    beforeEach(()=>{
        localStorage.clear();
        jest.clearAllMocks()
    })

    test("render register form",()=>{
        render(<Registration></Registration>)
        expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
})
})
 