import config from "../app.json";
import React from "react";
import QueryString from "query-string";
import localStorage from "local-storage";
import "./OAuth.css";

export default class OAuth extends React.Component {
  state = {
    finished: false
  };

  componentDidMount() {
    const query = QueryString.parse(window.location.search);
    fetch(
      `https://au3pm.green-tag.dk/?client_id=${config.github.client_id}&code=${query.code}`
    )
      .then((response) => response.json())
      .then((json) => {
        localStorage.set("ghtoken", json.access_token);
        window.close();
        this.setState({ finished: true });
      });
    //FIXME: add promise catch
  }

  render() {
    return (
      <div className="oauth">
        <img src="logo.png" alt="au3pm logo" />
        <div>
          {this.state.finished
            ? "You may now close this window"
            : "Please wait..."}
        </div>
      </div>
    );
  }
}
