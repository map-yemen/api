#!/usr/bin/env node

const glob = require('glob');
const fs = require('fs');
const request = require('request');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const _ = require('lodash');

const api = 'https://ifpri-egypt-silo.herokuapp.com';

const cwd = argv.f || argv.folder || process.cwd();

glob('*a2*.csv', { cwd }, (err, files) => {
  if (err) console.error(err);
  const fileList = files.map(file => path.join(cwd, file));

  var nextStream = function () {
    return fileList.shift() || null;
  };

  const interval = setInterval(function () {
    readAndUpload(nextStream());
    if (fileList.length === 0) clearInterval(interval);
  }, 1000);
});

function readAndUpload (file) {
  if (!file) return;
  const data = fs.readFileSync(file).toString();

  request.post(`${api}/indicators`, {
    json: true,
    headers: {
      Authorization: '',
      'Content-Type': 'application/json'
    },
    body: {
      name: _.last(file.split('/')).replace('egy_', '').replace(/_a\d_.*\.csv/g, ''),
      data,
      private: false,
      published: true,
      units: 'unknown',
      sources: ['initial data']
    }
  }, (err, resp, body) => {
    if (err) console.error(err);
    console.log(resp.statusCode);
    console.log(`upload ${file}`);
  });
}
