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

    return (
      <div className="App">
          <form>
              <input type="text" onChange={this.onSearchChange}/>
          </form>
          {this.state.list.filter(isSearched(this.state.searchTerm)).map(item =>
                  <div key = {item.objectID}>
                      <span>
                          <a href = {item.url}>{item.title}</a>
                      </span>
                      <span>{item.author}</span>
                      <span>{item.num_comments}</span>
                      <span>{item.points}</span>
                      <button onClick={() => this.onDismiss(item.objectID)} type="button">
                          Dismiss
                      </button>
                  </div>
          )}
      </div>
    );
  }
}

export default App;
