const fs = require('fs');
const path = require('path');
const pathTemplate = path.join(__dirname, 'template.html');
const pathComponent = path.join(__dirname, 'components');

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

async function replaceContent() {
  let templateFileString = await readFile(pathTemplate);
  console.log(templateFileString);
  const components = await getFolderFiles(pathComponent);

  for (let component of components) {
    if (path.extname(component) === '.html') {
      const name = path.basename(component).slice(0, -5);
      const content = await readFile(path.join(pathComponent, component));
      templateFileString = templateFileString.replaceAll(
        `{{${name}}}`,
        content,
      );
    }
  }
  saveToFile(pathTemplate, templateFileString);
}

async function doScript() {
  replaceContent();
}

doScript();
