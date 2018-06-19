import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPoP = 'hitsPerPage=';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchTerm: '',
            searchTerm: DEFAULT_QUERY
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchTopSearchStories = this.fetchTopSearchStories.bind(this);
    }

    setSearchTopStories(result) {
        const {hits, page} = result;
        const {searchKey, results} = this.state;
        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
        const updatedHits = [...oldHits, ...hits];
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        }
        );
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        this.setState({searchKey:searchTerm});
        this.fetchTopSearchStories(searchTerm);
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.results.hits.filter(isNotId);
        //merge the old state.result and the updatedHits into a new object and assign to results
        // this.setState({results: Object.assign({}, this.state.results, {hits:updatedHits})});
        //or use the spread operator to merge all properties of results with the hits
        this.setState({result: {...this.state.results, hits: updatedHits}});
    }

    /*When using a handler in an element, get access to the synthetic
    React event in the callback signature function */
    onSearchChange(event) {
        //The event holds the value of the input field of the target object
        this.setState({searchTerm: event.target.value});
    }

    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        this.setState({searchKey:searchTerm});
        this.fetchTopSearchStories(searchTerm);
        event.preventDefault();
    }

    fetchTopSearchStories(searchTerm, page = 0) {
        const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;
        fetch(url)
            .then(response => response.json())
            .then(results => this.setSearchTopStories(results))
            .catch(error => error);

        console.log(url);
    }

    render() {
        const {searchTerm, results, searchKey} = this.state;
        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;
        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];
        console.log(this.state);
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSearchSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                {results &&
                <Table
                    list={list}
                    onDismiss={this.onDismiss}/>
                }
                <div className="interactions">
                    <Button onClick={() => this.fetchTopSearchStories(searchKey, page +1)}>
                        More
                    </Button>
                </div>
            </div>
        );
    }
}

const Search = ({value, onChange, onSearchSubmit, children}) =>
    <form onSubmit={onSearchSubmit}>
        <input type="text"
               value={value}
               onChange={onChange}
        />
        <button type="submit">
            {children}
        </button>
    </form>;

const Table = ({list, onDismiss}) =>
    <div className="table">
        {list.map(item =>
            <div key={item.objectID} className="table-row">
                      <span style={largeColumn}>
                          <a href={item.url}>{item.title}</a>
                      </span>
                <span style={midColumn}>{item.author}</span>
                <span style={smallColumn}>{item.num_comments}</span>
                <span style={smallColumn}>{item.points}</span>
                <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
                    Dismiss
                </Button>
            </div>
        )}
    </div>;
const largeColumn = {width: '40%'};
const midColumn = {width: '30%'};
const smallColumn = {width: '10%'};


const Button = ({onClick, className = '', children}) =>
    <button
        onClick={onClick}
        className={className}
        type="button">
        {children}
    </button>;

export default App;
