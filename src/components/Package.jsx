import React from "react";
import { Link } from "react-router-dom";
import PackageRepo from "../api/PackageRepo";

// https://api.github.com/repos/octocat/hello-world

export default class Package extends React.Component {
  state = {
    name: null,
    packageIndex: null,
    package: null
  };

  //TODO: implement componentDidUpdate and update data, if packageName changes.

  load() {
    const packageName = this.props.match.params.package;

    this.setState({ name: packageName });
    PackageRepo.getIndex()
      .then((index) => PackageRepo.getPackageVersions(index[packageName]))
      .then((index) => this.setState({ packageIndex: index }));
    PackageRepo.getPackage(this.props.match.params.package).then((pkg) =>
      this.setState({ package: pkg })
    );
    /*fetch(
      `https://raw.githubusercontent.com/au3pm/action-test/master/${
        this.props.path
      }/au3pm.json`
    )
      .then(response => response.json())
      .then(json => this.setState({ pack: json }));*/
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.match.params.package !== prevProps.match.params.package) {
      this.load();
    }
  }

  renderRepoLink() {
    const url = `https://github.com/${this.state.packageIndex?.repo ?? ""}/`;

    switch (this.state.name) {
      case "autoit":
        return (
          <>
            repository:{" "}
            <a
              href="https://www.autoitscript.com/autoit3/files/archive/autoit/"
              target="_blank"
              rel="noreferrer"
            >
              {"https://www.autoitscript.com/autoit3/files/archive/autoit/"}
            </a>
          </>
        );
      default:
        if (this.state.packageIndex?.repo === undefined) {
          return <>Loading...</>;
        }

        return (
          <>
            github repository:{" "}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </>
        );
    }
  }

  render() {
    /*
    const url = `https://github.com/${this.state.packageIndex?.repo ?? ""}/`;
    */
    return (
      <div>
        {`package: ${this.state.name ?? "Loading..."}`}
        <div>{this.renderRepoLink()}</div>
        <div>
          install:
          <pre className="code">au3pm install {this.state.name}</pre>
        </div>
        <div>
          Dependencies:
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.state.package?.dependencies ?? []).map(
                (dependency) => (
                  <tr key={dependency[0]}>
                    <td>
                      <Link to={`/package/${dependency[0]}/`}>
                        {dependency[0]}
                      </Link>
                    </td>
                    <td>{dependency[1]}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
