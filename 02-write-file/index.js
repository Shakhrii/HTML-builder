const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({ input, output });
const pathFile = path.join(__dirname, 'input.txt');
const ws = fs.createWriteStream(pathFile);

rl.setPrompt('Type something you want ');
rl.prompt();
rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    goodbye();
  } else {
    saveToFile(input);
  }
});

rl.on('SIGINT', () => {
  goodbye();
});

const goodbye = () => {
  console.log('Goodbye!');
  rl.close();
  ws.end();
};

const saveToFile = (input) => {
  ws.write(input);
};
