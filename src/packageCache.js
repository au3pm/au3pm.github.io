let indexCache = null;
const packageCache = [];

export default function (key) {
  if (key !== undefined) {
    packageCache[key];
  }

  return packageCache;
}

export function index() {
  return indexCache;
}
