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