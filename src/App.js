import React, { Component, PropTypes } from 'react';
import './App.css';

// Fetching data
const DEFAULT_QUERY = "redux";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = "10";

// https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=10
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage="

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: "", // key to refer cache of previous results
      searchTerm: DEFAULT_QUERY,
    };

    // Binding of class methods
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopstories(searchTerm) {
    // Needs to search when cache is not found for the search term
    return !this.state.results[searchTerm];
  }

  setSearchTopstories(result) {
    // result is an object returned by the API which contains objectID,
    // hits (array), page, hitsPerPage, nbHits, and so on.
    const { hits, page } = result;
    // results contains previous results cached by searchKey
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    // If the searchKey already exists in results then the existing content
    // will be refreshed with the latest content.
    this.setState({
      results: {
        ...results,
        // [searchKey] is a computed property name.
        // page is is shorthand property. This syntax can be used when
        // both the property and value have the same name.
        [searchKey]: { hits: updatedHits, page }
      },
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    // https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=10
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      // The response needs to get transformed to JSON, which is a
      // mandatory step in a native fetch.
      // The names response and result are arbitrary. They could be named as
      // res and rst also.
      .then(response => response.json())
      // result contains the content returned by response.json()
      .then(result => this.setSearchTopstories(result))
      .catch(error => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id) {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey];

    // This filtering function includes those items NOT having the
    // desired ID.
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    // If the searchKey already exists in results then the existing content
    // will be refreshed with the latest content.
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  // Syntatic event
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    // Prevent refresh of web page
    event.preventDefault();
  }

  render() {
    // ES6 destructuring
    const { searchTerm, results, searchKey } = this.state;

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

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { results &&
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

// Converting an ES6 class component to a functional stateless component:
// 1. Replace "class ClassName extends Component" with "function ClassName(props)"
// 2. Best practice - destructure the props in the function signature
// 3. Remove "render()" and return statement
const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

// Converting an ES6 class component to a functional stateless component:
// 1. Replace "class ClassName extends Component" with "function ClassName(props)"
// 2. Best practice - destructure the props in the function signature
// 3. Remove "render()"
const Table = ({ list, onDismiss }) => {
  const largeColumn = { width: "40%" };
  const midColumn = { width: "30%" };
  const smallColumn = { width: "10%" };

  return (
    <div className="table">
      { list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>
            {item.author}
          </span>
          <span style={smallColumn}>
            {item.num_comments}
          </span>
          <span style={smallColumn}>
            {item.points}
          </span>
          <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  //list: PropTypes.array.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};

const Button = ({ onClick, className, children }) =>
  // A concise body wihout curly braces nor return statement (implicit)
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.defaultProps = {
  className: ""
};

// PropType type check happens after the default prop is evaluated.
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default App;

export {
  Button,
  Search,
  Table
};
