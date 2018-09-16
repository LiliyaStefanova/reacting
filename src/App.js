import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH='query=';

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

const isSearched = searchTerm =>
    item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

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
    }

    setSearchTopStories(result){
        this.setState({result});
    }

    componentDidMount(){
        const {searchTerm} = this.state;

        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response =>response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }


    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId); //filter out on new state object
        //create new result object by gibing it the old result and updating the hits property
        // const updatedResults = Object.assign({}, this.state.result, {hits:updatedHits}); //approach 1
        const updatedResults = {...this.state.result, hits:updatedHits}; //approach 2 - object spreading
        //set the state with the updated results complex object
        this.setState({result:updatedResults})
    }

    /*When using a handler in an element, get access to the synthetic
    React event in the callback signature function */
    onSearchChange(event) {
        //The event holds the value of the input field of the target object
        this.setState({searchTerm: event.target.value});
    }

    render() {
        const {searchTerm, result} = this.state;
        if(!result) {return null;}
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}>
                        Search
                    </Search>
                </div>
                <Table
                    list={result.hits}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
            </div>
        );
    }
}


const Search = ({value, onChange, children}) =>
    <form>{children}
        <input type="text" value={value} onChange={onChange}/>
    </form>


const Table = ({list, pattern, onDismiss}) =>
    <div className="table">
        <Headers headings={columnHeadings}/>
        {list.filter(isSearched(pattern)).map(item =>
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
    </div>



const Headers = ({headings}) =>
    <div className="table-header">
        {headings.map(heading => {
                const {name, style} = heading;
                return (
                    <span style={style}>{name}</span>
                )
            }
        )}
    </div>


const Button = ({className = '', onClick, children}) =>
    <button className={className} onClick={onClick}>
        {children}
    </button>


export default App;
