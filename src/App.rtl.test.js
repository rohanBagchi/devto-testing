import { render, fireEvent, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";

const joke = 'Foo Bar!';

const server = setupServer(
  rest.get("https://api.icndb.com/jokes/random", (req, res, ctx) => {
    return res(
      ctx.json({
        type: "success",
        value: {
          joke
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("App", async () => {
  render(<App />);

  fireEvent.click(screen.getByText("Get a random joke"));

  expect(await screen.findByText(joke)).toBeDefined();
});
