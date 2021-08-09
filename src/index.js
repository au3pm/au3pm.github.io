import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { HashRouter, Route, Switch, Link } from "react-router-dom";
import Search from "./components/Search";
import Packages from "./components/Packages";
import Package from "./components/Package";
import Add from "./components/Add";
import QueryString from "query-string";
import localStorage from "local-storage";
import OAuth from "./components/OAuth";
import ThemeToggle from "./components/ThemeToggle";

// https://www.npmjs.com/package/react-loading-skeleton

// cancellable fetch requests
// https://www.npmjs.com/package/axios
// https://www.npmjs.com/package/react-axios

// https://github.com/FortAwesome/react-fontawesome

// https://stackoverflow.com/a/53072538
// https://stackoverflow.com/questions/38425902/accessing-data-from-url-in-real-time-search-using-reactjs-and-ajax?rq=1

//function App() {
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header>
          <HashRouter>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center"
              }}
            >
              <Link to="/">
                <div id="logo" />
              </Link>
              <Link to="/" style={{ alignSelf: "end", paddingBottom: "5px" }}>
                au3pm
              </Link>
            </div>
          </HashRouter>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              gap: "10px"
            }}
          >
            <ThemeToggle />
            <div id="hero" />
          </div>
        </header>
        <div>
          <HashRouter>
            <Search />
          </HashRouter>
        </div>
        <HashRouter>
          <Switch>
            <Route path="/packages/:page?/?q=:query" component={Packages} />
            <Route path="/packages/:page?/" component={Packages} />
            <Route path="/package/:package/" component={Package} />
            <Route path="/add/" component={Add} />
            <Route exact path="/:page?/" component={Packages} />
            <Route>404</Route>
          </Switch>
          <Link className="fab" to="/add/">
            <i className="material-icons">add_circle</i>
          </Link>
        </HashRouter>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/oauth" component={OAuth} />
      <Route component={App} />
    </Switch>
  </HashRouter>,
  rootElement
);
