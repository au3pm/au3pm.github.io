import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import config from "../app.json";
import localStorage from "local-storage";

class Auth {
  github_id = null;
  github_token = null;
  /**
   * @type Octokit
   */
  octokit = null;

  constructor() {
    this.octokit = new Octokit({
      // authStrategy: createAppAuth
    });
  }

  github_isAuthenticated() {
    return this.github_token !== null; //FIXME: we need to check local storage for a github token and then validate if the token is still valid.
  }

  github_reauthenticate() {
    this.github_token = null;
    // TODO: look into invalidating token.
    return this.github_authenticate();
  }

  github_authenticate() {
    if (this.github_token !== null) {
      return new Promise((resolve, reject) => {
        resolve(this.github_token);
      });
    }

    const client_id = config.github.client_id;
    const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=public_repo&redirect_uri=${
      encodeURIComponent(window.location.origin) + "/#/oauth/"
    }`;

    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    const w = 600;
    const h = 700;
    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    const gWindow = window.open(
      oauthUrl,
      "_blank",
      `noopener,scrollbars=no,location=yes,menubar=no,status=yes,resizable=no,width=${w},height=${h},top=${top},left=${left}`
    );

    return new Promise((resolve, reject) => {
      localStorage.on("ghtoken", (token) => {
        this.github_token = token;
        resolve(token);
      });
    });
  }

  github_connect() {
    // TODO: Add github auth for enabling abillity to create issues.
    //Octokit.request();
    //const { token } = await auth({ type: "app" });
    // this.octokit.auth({ type: "app" });
    //console.log("test");
  }
}

export default new Auth();
