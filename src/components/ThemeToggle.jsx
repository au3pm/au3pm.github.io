import React from "react";
import localStorage from "local-storage";
import "./ThemeToggle.css";

export default class ThemeToggle extends React.Component {
  state = {
    checked: localStorage.get("theme") === "dark"
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.applyTheme();
    localStorage.on("theme", (theme) => {
      this.setState({ checked: theme === "dark" });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.checked !== this.state.checked) {
      localStorage.set("theme", this.state.checked ? "dark" : "light");
      this.applyTheme();
    }
  }

  toggle() {
    this.setState({ checked: !this.state.checked });
  }

  applyTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      this.state.checked ? "dark" : "light"
    );
  }

  render() {
    return (
      <div className="themeToggle">
        <div
          className="toggle"
          onClick={this.toggle}
          data-checked={this.state.checked ? true : null}
          //data-theme={this.state.checked ? "dark" : null}
        />
      </div>
    );
  }
}
