import React from "react";
import PackageRepo from "../api/PackageRepo";

/**
 * NOTE: We do currently not need to fetch package information for this component usage.
 *       To reduce useless requests to GibHub, the fetch code has been disabled
 */

export default class PackageCard extends React.Component {
  static defaltProps = {
    name: "",
    path: ""
  };

  state = {
    pack: null
  };

  componentDidMount() {
    //PackageRepo.getPackageVersions(this.props.path).then((json) => this.setState({ pack: json }));
  }

  render() {
    //return <div>{this.state.pack === null ? "Loading" : this.props.name}</div>;

    return <div>{this.props.name}</div>;
  }
}
