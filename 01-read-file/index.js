const fs = require('fs');
const path = require('path');
const pathFile = path.join(__dirname, 'text.txt');

const stream = new fs.createReadStream(pathFile);
stream.on('readable', function () {
  var data = stream.read();
  if (data !== null) {
    console.log(data.toString());
  }
});
