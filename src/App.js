import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = searchTerm  =>
    item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    setSearchTopStories(result){
        this.setState({result});
    }

    componentDidMount(){
        const {searchTerm } = this.state;

        //using native fetch API
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    onDismiss(id){
        const isNotId = item => item.objectID!==id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        //merge the old state.result and the updatedHits into a new object and assign to result
        // this.setState({result: Object.assign({}, this.state.result, {hits:updatedHits})});
        //or use the spread operator to merge all properties of result with the hits
        this.setState({result:{...this.state.result, hits:updatedHits}});
    }

    /*When using a handler in an element, get access to the synthetic
    React event in the callback signature function */
    onSearchChange(event){
        //The event holds the value of the input field of the target object
        this.setState({searchTerm: event.target.value});
    }

  render() {
        const {searchTerm, result} = this.state;
        if(!result) return null;
        console.log(this.state);
    return (
      <div className="page">
          <div className="interactions">
              <Search
              value={searchTerm}
              onChange={this.onSearchChange}/>
              <Table
              hits={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}/>
          </div>
      </div>
    );
  }
}
const Search =({value, onChange, children}) =>
        <form>
            {children}
            <input type="text"
                   value={value}
                   onChange={onChange}/>
        </form>;

const Table = ({hits, pattern, onDismiss}) =>
        <div className="table">
            {hits.filter(isSearched(pattern)).map(item =>
                <div key = {item.objectID} className="table-row">
                      <span style={largeColumn}>
                          <a href = {item.url}>{item.title}</a>
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
 const largeColumn = {width:'40%'};
 const midColumn = {width:'30%'};
 const smallColumn={width:'10%'};


const Button = ({onClick, className='', children}) =>
        <button
            onClick={onClick}
            className={className}
            type="button">
            {children}
        </button>;

export default App;
