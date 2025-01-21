const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, (err, files) => {
  console.log('\nSecret folder files:');
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      showFileInfo(path.join(pathFolder, file));
    });
  }
});

const showFileInfo = (file) => {
  fs.stat(file, (err, stats) => {
    if (err) {
      console.error(err);
    } else {
      if (stats.isFile()) {
        console.log(
          `${path.parse(file).name} - ${path
            .extname(file)
            .replace('.', '')} - ${stats.size}bytes`,
        );
      }
    }
  });
};
