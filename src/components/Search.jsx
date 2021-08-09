import React from "react";
import { withRouter } from "react-router";
import QueryString from "query-string";

class Search extends React.Component {
  state = {
    searchString: "",
    value: ""
  };

  constructor(props) {
    super(props);
    this.onChangeDebounced = debounce(this.fetchSearchResults.bind(this), 500); //used to be 250
  }

  componentDidMount() {
    var search = QueryString.parse(this.props.location.search);
    this.setState({
      searchString: search.q || ""
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      var search = QueryString.parse(this.props.location.search);
      var q = search.q === undefined ? "" : search.q;
      this.setState({ searchString: q });
    }
  }

  searchChange = function (e) {
    this.setState({ searchString: e.target.value });
    this.onChangeDebounced();
  };

  fetchSearchResults = function () {
    if (this.state.searchString) {
      //console.log(this.props.history.location.search);
      this.props.history.push(`/packages/?q=${this.state.searchString}`);
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <div className="search">
        <div
          className="material-icons"
          style={{ fontSize: "30px", width: "30px" }}
        >
          search
        </div>
        <input
          type="text"
          placeholder="Search"
          onChange={this.searchChange.bind(this)}
          value={this.state.searchString}
        />
      </div>
    );
  }
}

function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

export default withRouter(Search);
