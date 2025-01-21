const fs = require('fs');
const path = require('path');
const pathTemplate = path.join(__dirname, 'template.html');
const pathComponent = path.join(__dirname, 'components');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathStyles = path.join(pathProjectDist, 'style.css');

async function readFile(pathFile) {
  return new Promise(function (resolve, reject) {
    const stream = new fs.createReadStream(pathFile);
    let fileString = '';

    stream.on('readable', function (err) {
      if (err) {
        reject(err);
      } else {
        let data = stream.read();
        if (data != null) {
          fileString += data.toString();
        } else {
          resolve(fileString);
        }
      }
    });
  });
}

const saveToFile = (path, input) => {
  const ws = fs.createWriteStream(path);
  ws.write(input);
};

function getFolderFiles(path) {
  return new Promise(function (resolve, reject) {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

const isFile = (file) => {
  return new Promise(function (resolve, reject) {
    fs.stat(file, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        if (stats.isFile()) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};

async function getStylesFiles() {
  const pathStylesFolder = path.join(__dirname, 'styles');
  const files = await getFolderFiles(pathStylesFolder);
  const styleFiles = [];

  for (let file of files) {
    const pathFile = path.join(pathStylesFolder, file);
    if (await isFile(pathFile)) {
      if (path.extname(pathFile) === '.css') {
        styleFiles.push(pathFile);
      }
    }
  }
  return styleFiles;
}

async function replaceContent() {
  let templateFileString = await readFile(pathTemplate);
  const components = await getFolderFiles(pathComponent);

  for (let component of components) {
    if (path.extname(component) === '.html') {
      const name = path.basename(component).slice(0, -5);
      const content = await readFile(path.join(pathComponent, component));
      templateFileString = templateFileString.replaceAll(
        `{{${name}}}`,
        content.trim(),
      );
    }
  }

  fs.mkdir(pathProjectDist, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });
  saveToFile(path.join(pathProjectDist, 'index.html'), templateFileString);
}

async function buildStyles() {
  const files = await getStylesFiles();
  console.log(files);
  const destination = fs.createWriteStream(pathStyles);

  for (let file of files) {
    console.log(file);
    const origin = fs.createReadStream(file);
    origin.pipe(destination);
  }
}

async function doScript() {
  replaceContent();
  buildStyles();
}

doScript();
