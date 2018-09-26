import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, {Search, Button, Table} from './App';
Enzyme.configure({adapter:new Adapter()});
//
// describe('App', () =>{
//
//     it('renders without crashing', () => {
//         const div = document.createElement('div');
//         ReactDOM.render(<App/>, div);
//         // ReactDOM.unmountComponentAtNote(div);
//     });
//
//     test('has a valid snapshot', () => {
//         const component = renderer.create(<App/>);
//         let tree = component.toJSON();
//         expect(tree).toMatchSnapshot();
//     });
// });
//
// describe('Button', () => {
//
//     const props ={}
//
//     it('renders without crashing', () =>{
//         const div = document.createElement('div');
//         ReactDOM.render(<Button>Give Me More</Button>, div);
//         // ReactDOM.unmountComponentAtNode(div);
//     });
//
//     test('has a valid snapshot', () => {
//         const component = renderer.create(<Button>Give Me More</Button>);
//         let tree = component.toJSON();
//         expect(tree).toMatchSnapshot();
//     });
//
//
// });
//
// describe('Table', () => {
//     const props = {
//         list: [{title:'1', author:'1', num_comments:1, points:2, objectID:'y'},
//             {title:'2', author:'2', num_comments:1, points:2, objectID:'z'},],
//     };
//
//     it('renders without crashing', () => {
//         const div = document.createElement('div');
//         ReactDOM.render(<Table {...props}/>, div);
//     });
//
//     test('has a valid snapshot', () => {
//         const component = renderer.create(<Table {...props}/>);
//         let tree = component.toJSON();
//         expect(tree).toMatchSnapshot();
//     });
//
//     it('shows two items in list', () =>{
//         const element = shallow(<Table {...props}/>);
//         expect(element.find('table-row')).toBe(2);
//     });
// });
// import React from 'react';
// import ReactDOM from 'react-dom';
// import renderer from 'react-test-renderer';
// import Enzyme, { shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import App, { Search, Button, Table } from './App';

// Enzyme.configure({ adapter: new Adapter() });

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

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Search>Search</Search>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Search>Search</Search>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});

describe('Button', () => {

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Button>Give Me More</Button>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Button>Give Me More</Button>
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

describe('Headers', () => {

    const props = {
        headings: [{name: 'heading 1', style: 'style 1'}, {name: 'heading 2', style: 'style 2'}]
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Headers {...props}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });


    test('has a valid snapshot', () => {
        const component = renderer.create(<Headers {...props}/>);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});