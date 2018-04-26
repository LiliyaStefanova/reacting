import React, { Component } from 'react';
import './App.css';

const list = [
    {
        title: 'React',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments:3,
        points:4,
        objectID:0
    },
    {
        title:'Redux',
        url:'https://github.com/reactjs/redux',
        author:'Dan Abramov, Andrew Clark',
        num_comments:2,
        points:5,
        objectID:1,
    }

];

const isSearched = searchTerm  =>
    item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            searchTerm: '',
            list,
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }


    onDismiss(id){
        const isNotId = item => item.objectID!==id;
        const updatedList = this.state.list.filter(isNotId);
        this.setState({list:updatedList});
    }

    /*When using a handler in an element, get access to the synthetic
    React event in the callback signature function */
    onSearchChange(event){
        //The event holds the value of the input field of the target object
        this.setState({searchTerm: event.target.value});
    }

  render() {
        const {searchTerm, list} = this.state;
    return (
      <div className="page">
          <div className="interactions">
              <Search
              value={searchTerm}
              onChange={this.onSearchChange}/>
              <Table
              list={list}
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
        </form>

const Table = ({list, pattern, onDismiss}) =>
        <div className="table">
            {list.filter(isSearched(pattern)).map(item =>
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
        </div>
 const largeColumn = {width:'40%'};
 const midColumn = {width:'30%'};
 const smallColumn={width:'10%'};


const Button = ({onClick, className='', children}) =>
        <button
            onClick={onClick}
            className={className}
            type="button">
            {children}
        </button>

export default App;
