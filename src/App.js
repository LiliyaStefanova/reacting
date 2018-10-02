import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {sortBy} from 'lodash';
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStroopwafel, faSpinner} from '@fortawesome/free-solid-svg-icons'

library.add(faStroopwafel)

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

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list=> sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse()
};

class App extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: DEFAULT_QUERY,
            results: null,
            searchKey: '',
            error: null,
            isLoading: false,
            sortKey: 'NONE',
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey){
        this.setState({sortKey});
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        this.setState({isLoading: true});
        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
            .then(result => {
                this._isMounted &&
                this.setSearchTopStories(result.data);
            })
            .catch(error => this._isMounted && this.setState({error}));

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
            },
            isLoading: false,
        });
    }

    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    componentDidMount() {
        this._isMounted = true;
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /*When using a handler in an element, get access to the synthetic
    React event in the callback signature function */
    onSearchChange(event) {
        //The event holds the value of the input field of the target object
        this.setState({searchTerm: event.target.value});
    }

    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        if (this.needsToSearchTopStories(searchTerm)) {
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
        const {searchTerm, results, searchKey, error, isLoading, sortKey} = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;  //first will return result.page if result is not null
        const list = (results && results[searchKey] && results[searchKey].hits) || [];
        if (error) {
            return <p>Something went wrong</p>;
        }
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
                {error
                    ? <div className="interactions">
                        <p>Something went wrong</p>
                    </div> :
                    <Table
                        list={list}
                        pattern={searchTerm}
                        onDismiss={this.onDismiss}
                        sortKey={sortKey}
                        onSort={this.onSort}
                    />}
                <div className="interactions">
                    <ButtonWithLoading isLoading={isLoading}
                        onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</ButtonWithLoading>
                </div>
            </div>
        );
    }
}

class Search extends Component {

    render() {
        const {value, onChange, onSubmit, children} = this.props;
        return (
            <form onSubmit={onSubmit}>
                <input type="text" value={value} onChange={onChange}
                       ref={(node) => {
                           this.input = node;
                       }}/>
                <button type="submit">{children}</button>
            </form>
        )
    }

    componentDidMount() {
        if (this.input) {
            this.input.focus();
        }
    }

}

Search.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.string.isRequired,
};


const Table = ({list, onDismiss, sortKey, onSort}) =>
    <div className="table">
        <div className="table-header">
            <span style={largeColumn}>
                <Sort sortKey={'TITLE'} onSort={onSort}>Title</Sort>
            </span>
            <span style={midColumn}>
                <Sort sortKey={'AUTHOR'} onSort={onSort}>Author</Sort>
            </span>
            <span style={smallColumn}>
                <Sort sortKey={'COMMENTS'} onSort={onSort}>Comments</Sort>
            </span>
            <span style={smallColumn}>
                <Sort sortKey={'POINTS'} onSort={onSort}>Points</Sort>
            </span>
            <span style={smallColumn}>Archive</span>
        </div>
            {SORTS[sortKey](list).map(item =>
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

Table.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            objectID: PropTypes.string.isRequired,
            title: PropTypes.string,
            author: PropTypes.string,
            url: PropTypes.string,
            num_comments: PropTypes.number,
            points: PropTypes.number,
        })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
};


const Button = ({className, onClick, children}) =>
    <button className={className} onClick={onClick}>
        {children}
    </button>;

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Button.defaultProps = {
    className: '',
};

const Sort = ({sortKey, onSort, children}) =>
    <Button onClick={() => onSort(sortKey)} className="button-inline">{children}</Button>


const Loading = () =>
    <div>Loading...
        <FontAwesomeIcon icon="stroopwafel"/>
    </div>;

// Higher Order Component - typically starts with "with"

const withLoading = (Component) => ({isLoading, ...rest}) => isLoading ? <Loading/> : <Component {...rest} />

const ButtonWithLoading = withLoading(Button);

export default App;
