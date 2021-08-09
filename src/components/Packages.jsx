import React from "react";
import Collection from "../Collection";
import PackageCard from "./PackageCard";
import QueryString from "query-string";
import { Link, NavLink } from "react-router-dom";
import PackageRepo from "../api/PackageRepo";

export default class Packages extends React.Component {
  static defaultProps = {
    perPage: 10
  };

  state = {
    packages: new Collection()
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      this.setState({ page: 0 });
    }
  }

  componentDidMount() {
    PackageRepo.getIndex().then((json) =>
      this.setState({ packages: new Collection(json) })
    );
  }

  render() {
    const page = (this.props.match.params.page ?? 1) - 1;
    const search = QueryString.parse(this.props.location.search);
    const results =
      search.q !== undefined
        ? this.state.packages.filter((p) => p.includes(search.q))
        : this.state.packages;
    const keys = results.keys();
    return (
      <div className="packageList">
        {results //apply search
          .keys()
          .slice(
            page * this.props.perPage,
            page * this.props.perPage + this.props.perPage
          )
          .map((key) => (
            <NavLink to={`/package/${key}/`} key={key}>
              <PackageCard name={key} path={this.state.packages.all()[key]}>
                {key}
              </PackageCard>
            </NavLink>
          ))}
        <div>
          {new Array(Math.ceil(keys.length / this.props.perPage))
            .fill(null)
            .map((nul, _page) => (
              <Link
                to={`/packages/${++_page}/${this.props.location.search}`}
                key={_page}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    lineHeight: "30px",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                  className={page === _page - 1 ? "active" : ""}
                  //onClick={(e) => this.setState({ page: --_page })}
                >
                  {_page}
                </div>
              </Link>
            ))}
        </div>
      </div>
    );
  }
}
