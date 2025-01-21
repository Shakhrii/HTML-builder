const fs = require('fs');
const path = require('path');
const pathTemplate = path.join(__dirname, 'template.html');

async function readFile(pathFile) {
  return new Promise(function (resolve, reject) {
    const stream = new fs.createReadStream(pathFile);
    let fileString = '';

    stream.on('readable', function (chunk, err) {
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

async function replaceContent() {
  let templateFileString = await readFile(pathTemplate);
  console.log(templateFileString);
}

async function doScript() {
  replaceContent();
}

doScript();
