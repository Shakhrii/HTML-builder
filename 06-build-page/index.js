const fs = require('fs');
const path = require('path');
const pathTemplate = path.join(__dirname, 'template.html');
const pathComponent = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathAssets = path.join(__dirname, 'assets');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathProjectDistStyles = path.join(pathProjectDist, 'style.css');
const pathProjectDistAssets = path.join(pathProjectDist, 'assets');

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
  const files = await getFolderFiles(pathStyles);
  const styleFiles = [];

  for (let file of files) {
    const pathFile = path.join(pathStyles, file);
    if (await isFile(pathFile)) {
      if (path.extname(pathFile) === '.css') {
        styleFiles.push(pathFile);
      }
    }
  }
  return styleFiles;
}

async function copyFolder(srcPath, destPath) {
  fs.mkdir(destPath, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });

  let files = await getFolderFiles(srcPath);
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

async function updateFiles(srcPath, destPath) {
  const srcPathFiles = await getFolderFiles(srcPath);
  const destPathFiles = await getFolderFiles(destPath);

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
  const destination = fs.createWriteStream(pathProjectDistStyles);

  for (let file of files) {
    const origin = fs.createReadStream(file);
    origin.pipe(destination);
  }
}

async function copyAssets() {
  fs.mkdir(pathProjectDistAssets, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });

  copyFolder(pathAssets, pathProjectDistAssets);
}

async function updateFolders() {
  updateFiles(pathAssets, pathProjectDistAssets);
}

async function doScript() {
  replaceContent();
  buildStyles();
  copyAssets();
  updateFolders();
}

doScript();
