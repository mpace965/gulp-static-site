const path = require("path");

module.exports = function resolveClientPath(clientPath) {
  return path.join(process.cwd(), clientPath);
};
