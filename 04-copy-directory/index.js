const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

const copyFolder = (srcPath, destPath) => {
  fs.mkdir(destPath, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });

  fs.readdir(srcPath, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        let filePath = path.join(srcPath, file);

        let promise = isFile(filePath);
        promise.then(
          (isFile) => {
            if (isFile) {
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
          },
          (error) => console.log(error),
        );
      });
    }
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
