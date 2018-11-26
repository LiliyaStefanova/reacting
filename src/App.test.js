import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';
import Search from './Search';
import Button from './Button';
import Table from './Table';
import Sort from './Sort'
Enzyme.configure({adapter:new Adapter()});

describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <App />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Search', () => {

    const props = {
        value:'redux',
        onChange:jest.fn(),
        onSubmit:jest.fn(),
        children:'search',
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Search {...props}>Search</Search>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Search {...props}>Search</Search>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});

describe('Button', () => {

    const props = {
        onClick: jest.fn(),
        className:'inline-button',
        children:'More',
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Button {...props}>Give Me More</Button>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Button {...props}>Give Me More</Button>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});

describe('Table', () => {

    const props = {
        list: [
            { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
            { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
        ],
        pattern: "",
        sortKey: 'TITLE',
        isSortReverse:false,
        onDismiss:jest.fn()
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Table { ...props } />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('shows two items in list', () => {
        const element = shallow(
            <Table { ...props } />
        );

        expect(element.find('.table-row').length).toBe(2);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Table { ...props } />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});

describe('Sort', () => {

    const props = {
        sortKey:'TITLE',
        activeSortKey:'TITLE',
        onSort:jest.fn(),
        children:'Sort'
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Sort {...props}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(<Sort {...props}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
