const fs = require("fs");
const path = require("path");
const formatURL = require("../utils/formatURL");
const deep = require("../utils/deep");

const defaultOptions = {
  routeName_callback(rootPath, filePath) {
    return formatURL(filePath.replace(rootPath, ""));
  },
  logger(routes) {
    console.log('\n\x1b[35m%s\x1b[0m', '----------- AutoRoute -----------')
    console.log(`${routes.length} routes created.`);
    console.log(routes);
    console.log('\x1b[35m%s\x1b[0m', '---------------------------------\n')
  },
};

function serve(folderPath, options = defaultOptions) {
  folderPath = path.resolve(folderPath);
  options = deep.merge(deep.copy(defaultOptions), options);

  let files = getFilesIn(folderPath);

  let routes = files.map(
    (file) =>
      new Object({
        file,
        route: options.routeName_callback(folderPath, file),
      })
  );

  if (options.logger) options.logger(routes);

  return function staticServingMiddleware(req, res, next) {
    const route = routes.find((route) => route.route === req.path);

    if (!route) return next();

    res.sendFile(route.file);
  };
}

function getFilesIn(absPath, files = []) {
  fs.readdirSync(absPath).forEach((file) => {
    let absFilePath = path.join(absPath, file);
    if (!fs.statSync(absFilePath).isDirectory()) files.push(absFilePath);
    else getFilesIn(absFilePath, files);
  });
  return files;
}

module.exports = serve;
