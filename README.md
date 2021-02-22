# Description

Created for showing a demo of testing the same React component using Enzyme and React Testing Library.
Where with Enzyme, it is more around the implementation details, with React Testing Library it is around the behavior.

## How to run?

1. `npm i`
2. `npm run test`

This will trigger the tests and both will pass of course.

## What are we testing?

```js
import "./styles.css";
import { useState } from "react";
import { get } from "axios";

export default function App() {
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    try {
      const { data } = await get("https://api.icndb.com/jokes/random");
      if (data.type === "success") {
        setJoke(data?.value?.joke);
        setError(null);
      }
    } catch (e) {
      setError("Fetch failed. Please retry!");
    }
  };

  const renderJoke = () => {
    if (error) {
      return <h3>{error}</h3>;
    }

    return <h3>{joke}</h3>;
  };

  return (
    <div className="App">
      <button onClick={fetchJoke}>Get a random joke</button>

      {renderJoke()}
    </div>
  );
}
```

Here, how we render the joke is an implementation detail. The fact that the joke gets fetched and rendered on click of the button is the behavior.

For example, later on we could render the joke inside a `<p/>` tag. The behavior of the component would remain unchanged and as such we should not have to touch our tests for this change.

## Enzyme test

```js
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { shallow } from 'enzyme';
import App from './App';
import axios from 'axios';

Enzyme.configure({ adapter: new Adapter() });

const joke = 'Foo Bar!';

jest.mock('axios');

test('App', async () => {
    const wrapper = shallow(<App />);
    const P = new Promise(resolve => resolve({
        data: {
            type: "success",
            value: {
                joke
            }
        }
    }));
    
    axios.get = jest.fn().mockReturnValue(P);

    wrapper
        .find('button')
        .simulate('click');

    await P;

    expect(wrapper.find('h3').text()).toEqual(joke)
})
```

Here, you will see we are extracting text content of the `<h3/>` element using `wrapper.find('h3').text()`. So based on our contrived example above, if we were to convert the `<h3/>` into a `<p/>`, our test will break.
For a larger, more complex component, the changes will increase exponentially. This makes refactors hard.

## React Testing Library Test

```js
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
```

Here, we are only testing for the behavior. So, as long as the behavior stays same, an update in how we render the joke for this case makes no difference.
For larger projects with lot more complexity, passing tests accross refactors will give developers confidence and help them move fast.
