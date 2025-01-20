const fs = require('fs');
const path = require('path');
const destPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function buildBundle() {
  const files = await getStylesFiles();
  const destination = fs.createWriteStream(destPath);

  for (let file of files) {
    const origin = fs.createReadStream(file);
    origin.pipe(destination);
  }
}

async function getStylesFiles() {
  const pathStylesFolder = path.join(__dirname, 'styles');
  const files = await getFilesFromFolder(pathStylesFolder);
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

const getFilesFromFolder = (srcPath) => {
  return new Promise(function (resolve, reject) {
    fs.readdir(srcPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

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

buildBundle();
