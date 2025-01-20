const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

async function copyFolder(srcPath, destPath) {
  fs.mkdir(destPath, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });

  let files = await getFilesFromFolder(srcPath);
  for (let file of files) {
    let filePath = path.join(srcPath, file);
    if (await isFile(filePath)) {
      fs.copyFile(
        path.join(srcPath, file),
        path.join(destPath, file),
        (err) => {
          if (err) {
            console.error(err);
          }
        },
      );
    } else {
      copyFolder(filePath, path.join(destPath, file));
    }
  }
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

copyFolder(srcPath, destPath);
