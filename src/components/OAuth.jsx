import React from "react";
import QueryString from "query-string";
import localStorage from "local-storage";
import "./OAuth.css";

export default class OAuth extends React.Component {
  componentDidMount() {
    const query = QueryString.parse(window.location.search);
    fetch(`https://au3pm.green-tag.dk/?code=${query.code}`)
      .then((response) => response.json())
      .then((json) => {
        localStorage.set("ghtoken", json.access_token);
        window.close();
      });
  }

  render() {
    return (
      <div className="oauth">
        <img src="logo.png" alt="au3pm logo" />
        <div>Please wait...</div>
      </div>
    );
  }
}
