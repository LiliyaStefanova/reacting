import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import Table from './Table';
import Search from './Search';
import Button from './Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faStroopwafel} from '@fortawesome/free-solid-svg-icons'
library.add(faStroopwafel);

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    const {searchKey, results} = prevState;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    return {
        results: {
            ...results,
            [searchKey]: {hits: updatedHits, page}
        },
        isLoading: false
    };
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
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
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
        this.setState(updateSearchTopStoriesState(hits, page));
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
        const {searchTerm, results, searchKey, error, isLoading} = this.state;
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
                    />}
                <div className="interactions">
                    <ButtonWithLoading isLoading={isLoading}
                                       onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                        More
                    </ButtonWithLoading>
                </div>
            </div>
        );
    }
}

const Loading = () =>
    <div>Loading...
        <FontAwesomeIcon icon="stroopwafel"/>
    </div>;

// Higher Order Component - typically starts with "with"

const withLoading = (Component) => ({isLoading, ...rest}) => isLoading ? <Loading/> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

export default App;
