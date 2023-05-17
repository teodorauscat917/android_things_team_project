const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const serialPort = new SerialPort({ path: 'COM5', baudRate: 9600 });
const parser = new ReadlineParser();
serialPort.pipe(parser);
const filename = 'data.json';



parser.on('data', (line) => {
  console.log('Received data:', line);

  const dataValues = line.split(',');

  const temperatureValue = dataValues.find((value) => value.includes('temperature='));
  const humidityValue = dataValues.find((value) => value.includes('humidity='));

  const temperature = temperatureValue ? temperatureValue.split('=')[1].trim() : null;
  const humidity = humidityValue ? humidityValue.split('=')[1].trim() : null;

  const dataObject = {
    temperature,
    humidity
  };

  const jsonData = JSON.stringify(dataObject);

  fs.writeFile(filename, jsonData, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Data saved to file:', filename);
    }
  });
});
const fs = require('fs');
const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;

      res.end(JSON.stringify(jsonData));
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


