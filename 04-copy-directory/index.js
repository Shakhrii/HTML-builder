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

async function updateFiles(srcPath, destPath) {
  const srcPathFiles = await getFilesFromFolder(srcPath);
  const destPathFiles = await getFilesFromFolder(destPath);

  for (let file of destPathFiles) {
    let filePath = path.join(destPath, file);
    if (await isFile(filePath)) {
      if (isFileRemoved(file, srcPathFiles)) {
        removeFile(path.join(destPath, file));
      }
    } else {
      if (isFileRemoved(file, srcPathFiles)) {
        removeFolder(path.join(destPath, file));
      } else {
        updateFiles(path.join(srcPath, file), path.join(destPath, file));
      }
    }
  }
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

const isFileRemoved = (file, files) => {
  if (files.includes(file)) {
    return false;
  } else {
    return true;
  }
};

const removeFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const removeFolder = (folderPath) => {
  fs.rm(folderPath, { recursive: true }, () => {});
};

copyFolder(srcPath, destPath);
updateFiles(srcPath, destPath);
