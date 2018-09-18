import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH='query=';
const PARAM_PAGE = 'page=';

const largeColumn = {
    width:'40%',
};

const midColumn = {
    width:'30%',
};

const smallColumn = {
    width: '10%',
};

const columnHeadings = [{name:'Title', style: largeColumn}, {name:'Author',style:midColumn}, {name:'Comments',
    style:smallColumn}, {name:'Points', style:smallColumn}, {name:'', style:smallColumn}];

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: DEFAULT_QUERY,
            result:null,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    fetchSearchTopStories(searchTerm, page = 0){
        let response;
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
            .then(response =>response.json())
            .then(result => {
                this.setSearchTopStories(result);
                response = result;
            })
            .catch(error => error);

    }

    setSearchTopStories(result){
        const {hits, page} = result;

        //Concatenate old hits with new
        const oldHits = page !== 0 ? this.state.result.hits : [];
        const updatedHits = [...oldHits, ...hits];
        this.setState({result: {hits: updatedHits, page}});
    }

    componentDidMount(){
        const {searchTerm} = this.state;
        this.fetchSearchTopStories(searchTerm);
    }

    /*When using a handler in an element, get access to the synthetic
    React event in the callback signature function */
    onSearchChange(event) {
        //The event holds the value of the input field of the target object
        this.setState({searchTerm: event.target.value});
    }

    onSearchSubmit(event){
        const {searchTerm} = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId); //filter out on new state object
        //create new result object by giving it the old result and updating the hits property
        // const updatedResults = Object.assign({}, this.state.result, {hits:updatedHits}); //approach 1
        const updatedResults = {...this.state.result, hits:updatedHits}; //approach 2 - object spreading
        //set the state with the updated results complex object
        this.setState({result:updatedResults})
    }

    render() {
        const {searchTerm, result} = this.state;
        const page = (result && result.page) || 0;  //first will return result.page if result is not null
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit = {this.onSearchSubmit}>
                        Search
                    </Search>
                </div>
                { result &&
                    <Table
                        list={result.hits}
                        pattern={searchTerm}
                        onDismiss={this.onDismiss}
                    />
                }
                <div className="interactions">
                    <Button onClick={() => this.fetchSearchTopStories(searchTerm, page+1)}>More</Button>
                </div>
            </div>
        );
    }
}


const Search = ({value, onChange, onSubmit, children}) =>
    <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange}/>
        <button type="submit">{children}</button>
    </form>


const Table = ({list, pattern, onDismiss}) =>
    <div className="table">
        <Headers headings={columnHeadings}/>
        {list.map(item =>
            <div key={item.objectID} className="table-row">
                        <span style={largeColumn}>
                            <a href={item.url}>{item.title}</a>
                        </span>
                <span style={midColumn}>{item.author}</span>
                <span style={smallColumn}>{item.num_comments}</span>
                <span style={smallColumn}>{item.points}</span>
                <span style={smallColumn}>
                <Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button>
                </span>
            </div>
        )}
    </div>;



const Headers = ({headings}) =>
    <div className="table-header">
        {headings.map(heading => {
                const {name, style} = heading;
                return (
                    <span style={style}>{name}</span>
                )
            }
        )}
    </div>;


const Button = ({className = '', onClick, children}) =>
    <button className={className} onClick={onClick}>
        {children}
    </button>;


export default App;
