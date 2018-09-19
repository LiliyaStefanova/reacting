import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const largeColumn = {
    width: '40%',
};

const midColumn = {
    width: '30%',
};

const smallColumn = {
    width: '10%',
};

const columnHeadings = [{name: 'Title', style: largeColumn}, {name: 'Author', style: midColumn}, {
    name: 'Comments',
    style: smallColumn
}, {name: 'Points', style: smallColumn}, {name: '', style: smallColumn}];

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: DEFAULT_QUERY,
            results: null,
            searchKey: '',

        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        let response;
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
            .then(response => response.json())
            .then(results => {
                this.setSearchTopStories(results);
                response = results;
            })
            .catch(error => error);

    }

    setSearchTopStories(result) {
        const {hits, page} = result;
        const {searchKey, results} = this.state;
        //Concatenate old hits with new
        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
        const updatedHits = [...oldHits, ...hits];
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        });
    }

    needsToSearchTopStories(searchTerm){
        return !this.state.results[searchTerm];
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

    /*When using a handler in an element, get access to the synthetic
    React event in the callback signature function */
    onSearchChange(event) {
        //The event holds the value of the input field of the target object
        this.setState({searchTerm: event.target.value});
    }

    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        if(this.needsToSearchTopStories(searchTerm)){
            this.fetchSearchTopStories(searchTerm);
        }
        this.setState({searchKey: searchTerm});
        event.preventDefault();
    }

    onDismiss(id) {
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];
        const isNotId = item => item.objectID !== id;

        const updatedHits = hits.filter(isNotId);
        //set the state with the updated results complex object
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        });
    }

    render() {
        const {searchTerm, results, searchKey} = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;  //first will return result.page if result is not null
        const list = (results && results[searchKey] && results[searchKey].hits) || [];
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}>
                        Search
                    </Search>
                </div>
                {results &&
                <Table
                    list={list}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
                }
                <div className="interactions">
                    <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
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
