const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();

const readDir = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(__dirname + '/movies', (err, files) => {
      if (err) {
        reject(err);
      }
      const t = files.map((t) => {
        return { name: t, ext: 'video/' + path.extname(t).slice(1) };
      });
      resolve(t);
    });
  });
};

const error = { 500: { code: 500, msg: 'Server Side Error' } };

app.set('view engine', 'ejs');

app.use('/mv', express.static(__dirname + '/movies'));
app.use('/', express.static(__dirname + '/public'));

app.get('/:id?', (req, res) => {
  readDir()
    .then((fL) => {
      res.render('index', { files: fL, mv: req.params.id || -1 });
    })
    .catch((err) => {
      console.log(err);
      res.render('error', error['500']);
    });
});

app.get('/download/:id', (req, res) => {
  readDir()
    .then((fL) => {
      res.sendFile(__dirname + '/movies/' + fL[req.params.id].name);
    })
    .catch((err) => {
      console.log(err);
      res.render('error', error['500']);
    });
});
app.listen(8080, () => {
  console.log('Server Running at:  http://localhost:8080');
});
