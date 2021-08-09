interface Index {
  [packageName: string]: PackagePathName;
}
interface Package {
  repo: string;
  versions: PackageVersions;
}
interface PackageVersions {
  [version: string]: RepositoryRef;
}
type RepositoryRef = string;

/** The offical lookup package name */
type PackageName = string;
/** The internal folder name used in lookup repo */
type PackagePathName = string;

export default class PackageRepo {
  static readonly baseUrl =
    "https://raw.githubusercontent.com/au3pm/action-test/master/";
  static readonly repoBaseUrl = "https://raw.githubusercontent.com/";

  private static _index: Index | null = null;

  private static _packages: { [id: string]: Package } = {
    au3pm: {
      repo: "genius257/au3pm",
      versions: [] as any //WARNING: missing versions could be problematic later in development.
    }
  };

  private static _cache = {};

  static async getIndex() {
    return (
      this._index ??
      fetch(`${this.baseUrl}au3pm.json`)
        .then((response) => response.json())
        .then((index: Index) => {
          this.postProcessIndex(index);
          //Sort the index object by keys
          index = Object.keys(index)
            .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
            .reduce((obj, key) => {
              obj[key] = index[key];
              return obj;
            }, {});
          this._index = index;
          return index;
        })
        .catch((reason) => {
          this._index = null;
          return {};
        })
    );
  }

  getPackageLookup() {
    //NOTE: not sure what the intent was here?
  }

  static async getPackageVersions(packageRef: PackagePathName) {
    return (
      this._packages[packageRef] ??
      fetch(`${this.baseUrl}${packageRef}/au3pm.json`)
        .then((response) => response.json())
        .catch((reason) => {
          return {
            repo: "",
            versions: []
          };
        })
        .then((packageVersions: Package) => {
          this._packages[packageRef] = packageVersions;
          return packageVersions;
        })
    );
  }

  static async getPackage(
    packageId: PackageName,
    version: string | null = null
  ) {
    return this.getIndex()
      .then((index?: Index) => index?.[packageId])
      .then((packageRef?: PackagePathName) => {
        return this.getPackageVersions(packageRef as string).then(
          (packageVersions: Package) => {
            version = this.resolveVersion(
              packageVersions.versions,
              version ?? "*"
            );
            return (
              this._cache?.[packageRef as string]?.[version as string] ??
              fetch(
                `${this.repoBaseUrl}${packageVersions.repo}/${
                  packageVersions.versions[version as string]
                }/au3pm.json`
              )
                .then((response) =>
                  response.status === 404 ? {} : response.json()
                )
                .catch((reason) => {
                  //TODO: if the package does not exist, url https://raw.githubusercontent.com/undefined/au3pm.json is called giving http status code 400
                  return {};
                })
                .then((json) => {
                  this._cache[packageRef as string] =
                    this._cache[packageRef as string] ?? {};
                  this._cache[packageRef as string][version] = json;
                  return json;
                })
            );
          }
        );
      });
  }

  static resolveVersion(packageVersions: PackageVersions, semver: string) {
    //FIXME: make true semver resolve it.
    //FIXME: if cannot resolve, throw new Exception.
    return Object.keys(packageVersions).reduce(
      (previousValue: string | null, currentValue: string) =>
        previousValue !== null && previousValue > currentValue
          ? previousValue
          : currentValue,
      null
    );
  }

  static postProcessIndex(index: Index) {
    index["autoit"] = "autoit";
    index["au3pm"] = "au3pm";
  }
}
