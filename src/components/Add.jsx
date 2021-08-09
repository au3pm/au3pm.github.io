import React from "react";
import Auth from "../api/Auth";
import PackageRepo from "../api/PackageRepo";

export default class Add extends React.Component {
  state = {
    token: null,
    user: null,
    organizations: null,
    repositories: null,
    releases: null,

    complete: false,

    owner: null,
    repository: null,
    sha: "",
    shaValid: false,
    packageName: "",
    packageNameValid: false,
    packageVersion: "",
    packageVersionValid: false
  };

  constructor(props) {
    super(props);

    this.signInWithGithub = this.signInWithGithub.bind(this);
    this.submit = this.submit.bind(this);
    this.onPackageNameChange = this.onPackageNameChange.bind(this);
  }

  componentDidMount() {
    //Auth.github_connect(); // show github auth dialoughe window
    if (Auth.github_isAuthenticated()) {
      this.setState({ token: Auth.github_token });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.token !== this.state.token) {
      if (this.state.token !== null) {
        Auth.octokit
          .request("GET /user", {
            headers: {
              authorization: `token ${this.state.token}`
            }
          })
          .then((user) => this.setState({ user: user.data }));
      }
    }

    if (this.state.user !== null && prevState.user !== this.state.user) {
      Auth.octokit
        .request(`GET /users/${this.state.user.login}/orgs`, {}) //WARNING: curently we only get max 30 and we don't do pagination
        .then((organizations) =>
          this.setState({ organizations: organizations.data })
        );
    }

    if (
      prevState.organizations === null &&
      prevState.organizations !== this.state.organizations
    ) {
      /*
       * A fix for a bug, where input "onChange" does not trigger when data is loaded in async via React.
       */
      this.setState({ owner: this.state.user });
    }

    if (
      prevState.repositories === null &&
      prevState.repositories !== this.state.repositories
    ) {
      /*
       * A fix for a bug, where input "onChange" does not trigger when data is loaded in async via React.
       */
      this.setState({ repository: this.state.repositories?.[0] ?? null });
    }

    if (
      prevState.owner !== this.state.owner &&
      (this.state.owner ?? false) !== false
    ) {
      Auth.octokit
        .request(
          this.state.owner.login === this.state.user.login
            ? "GET /user/repos"
            : `GET /orgs/${this.state.owner.login}/repos`,
          {
            headers: {
              authorization: `token ${this.state.token}`
            }
          }
        ) //WARNING: curently we only get max 30 and we don't do pagination
        .then((repositories) =>
          this.setState({ repositories: repositories.data })
        );
    }

    if (
      prevState.repository !== this.state.repository &&
      (this.state.repository ?? false) !== false
    ) {
      if (this.state.repository.name !== undefined) {
        Auth.octokit
          .request(
            `GET /repos/${this.state.owner.login}/${this.state.repository.name}/releases`
          ) //WARNING: curently we only get max 30 and we don't do pagination
          .then((releases) => this.setState({ releases: releases.data }));
      }
    }

    if (prevState.sha !== this.state.sha) {
      if (this.state.sha.length === 40) {
        Auth.octokit
          .request(
            `GET /repos/${this.state.owner.login}/${this.state.repository.name}/git/commits/${this.state.sha}`
          )
          .then((commit) => this.setState({ shaValid: true }))
          .catch((error) => this.setState({ shaValid: false }));
      } else {
        this.setState({ shaValid: false });
      }
    }

    if (prevState.packageName !== this.state.packageName) {
      PackageRepo.getIndex().then((index) =>
        PackageRepo.getPackageVersions(index[this.state.packageName])
      );
    }

    if (prevState.packageVersion !== this.state.packageVersion) {
      this.setState({
        packageVersionValid: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(
          this.state.packageVersion
        )
      });
    }
  }

  signInWithGithub() {
    Auth.github_authenticate().then((token) => this.setState({ token: token }));
  }

  submit(event) {
    const formValid = this.isFormValid();
    if (!formValid) {
      return;
    }

    Auth.octokit
      .request("POST /repos/{owner}/{repo}/issues", {
        owner: "au3pm",
        repo: "action-test",
        headers: {
          authorization: `token ${this.state.token}`
        },
        title: this.state.packageName,
        body: `${this.state.owner.login}\n${this.state.repository.name}\n${this.state.packageVersion}\n${this.state.sha}`
      })
      .then((x) =>
        this.setState({ complete: true }, () =>
          setTimeout(
            () =>
              this.setState({
                complete: false,

                owner: null,
                repository: null,
                sha: "",
                shaValid: false,
                packageName: "",
                packageNameValid: false,
                packageVersion: "",
                packageVersionValid: false
              }),
            2000
          )
        )
      );
  }

  isFormValid() {
    return (
      this.state.token !== null &&
      this.state.owner !== null &&
      this.state.repository !== null &&
      this.state.shaValid &&
      this.state.packageNameValid &&
      this.state.packageVersionValid
    );
  }

  onPackageNameChange(event) {
    const packageName = event.target.value;
    let packageNameValid = false;
    packageNameValid = /^[a-zA-Z -_0-9]+$/.test(packageName);
    this.setState({
      packageName: packageName,
      packageNameValid: packageNameValid
    });
  }

  render() {
    const formValid = this.isFormValid();
    if (!Auth.github_isAuthenticated()) {
      return (
        <button
          onClick={this.signInWithGithub}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            padding: "10px",
            fontSize: "20px",
            margin: "20px auto"
          }}
        >
          <div>Sign in with GitHub</div>
          <img src="GitHub-Mark-32px.png" alt="Github logo" />
        </button>
      );
    } else {
      if (this.state.complete) {
        return "Success";
      }
      return (
        <table
          style={{
            borderCollapse: "collapse",
            backgroundColor: "transparent",
            width: "100%"
          }}
        >
          <tbody>
            <tr>
              <td>
                <label htmlFor="owner">Owner:</label>
              </td>
              <td>
                <select
                  name="owner"
                  id="owner"
                  disabled={
                    this.state.user === null ||
                    this.state.organizations === null
                  }
                  onChange={(event) =>
                    this.setState({
                      owner:
                        event.target.value === this.state.user.login
                          ? this.state.user
                          : (this.state.organizations ?? []).find(
                              (organization) =>
                                organization.login === event.target.value
                            ),
                      repositories: null,
                      repository: null,
                      releases: null,
                      sha: ""
                    })
                  }
                >
                  <optgroup label="Users">
                    {this.state.user === null ? null : (
                      <option value={this.state.user.login}>
                        {this.state.user.login}
                      </option>
                    )}
                  </optgroup>
                  <optgroup label="Organizations">
                    {(this.state.organizations ?? []).map((organization) => (
                      <option
                        key={organization.login}
                        value={organization.login}
                      >
                        {organization.login}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="repo">Repository:</label>
              </td>
              <td>
                <select
                  name="repo"
                  id="repo"
                  disabled={this.state.repositories === null}
                  onChange={(event) =>
                    this.setState({
                      repository: (this.state.repositories ?? []).find(
                        (repository) => repository.name === event.target.value
                      )
                    })
                  }
                >
                  {(this.state.repositories ?? []).map((repository) => (
                    <option key={repository.id} value={repository.name}>
                      {repository.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="sha">Commit</label>
              </td>
              <td>
                <input
                  type="text"
                  name="sha"
                  id="sha"
                  value={this.state.sha}
                  onChange={(event) =>
                    this.setState({ sha: event.target.value })
                  }
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    backgroundColor: this.state.shaValid ? "green" : "red",
                    borderRadius: "10px",
                    marginLeft: "10px"
                  }}
                ></span>
              </td>
            </tr>
            <tr>
              <td>or select a release: </td>
              <td>
                <select
                  disabled={
                    this.state.releases === null ||
                    (this.state.releases ?? []).length === 0
                  }
                  onChange={(event) =>
                    event.target.value === ""
                      ? null
                      : Auth.octokit
                          .request(
                            `GET /repos/${this.state.owner.login}/${this.state.repository.name}/git/ref/tags/${event.target.value}`
                          )
                          .then((tag) =>
                            this.setState({ sha: tag.data.object.sha })
                          )
                  }
                >
                  <option></option>
                  {(this.state.releases ?? []).map((release) => (
                    <option key={release.id} value={release.tag_name}>
                      {release.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="name">Package name</label>
              </td>
              <td>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={this.state.packageName}
                  onChange={this.onPackageNameChange}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    backgroundColor: this.state.packageNameValid
                      ? "green"
                      : "red",
                    borderRadius: "10px",
                    marginLeft: "10px"
                  }}
                ></span>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="version">Package version</label>
              </td>
              <td>
                <input
                  type="text"
                  name="version"
                  id="version"
                  value={this.state.packageVersion}
                  onChange={(event) =>
                    this.setState({ packageVersion: event.target.value })
                  }
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    backgroundColor: this.state.packageVersionValid
                      ? "green"
                      : "red",
                    borderRadius: "10px",
                    marginLeft: "10px"
                  }}
                ></span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">
                <button disabled={!formValid} onClick={this.submit}>
                  Create package request
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      );
    }
    // Auth.octokit.request() // load all elegable repos
    // Onclick repo verify package name availablility
  }
}
