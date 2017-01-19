#!/usr/bin/env node

const glob = require('glob');
const fs = require('fs');
const request = require('request');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const _ = require('lodash');
const cap = require('capitalize')

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
  const data = csvToJSON(fs.readFileSync(file).toString().replace(/"/g, ''));
  request.post(`${api}/indicators`, {
    json: true,
    headers: {
      Authorization: '',
      'Content-Type': 'application/json'
    },
    body: {
      name: cap(_.last(file.split('/')).replace('egy_', '').replace(/_a\d_.*\.csv/g, '')) + ' - ' + data[0].data_year,
      data,
      data_geography: true,
      private: false,
      published: true,
      units: 'unknown',
      sources: ['initial data'],
      category: 'Sequential',
      themes: [
        {
          ar: 'المحور الأول: التنمية الاقتصادية',
          en: 'Pillar 1: Economic Development',
          type: 'sds'
        }
      ]
    }
  }, (err, resp, body) => {
    if (err) console.error(err);
    console.log(resp.statusCode);
    console.log(`upload ${file}`);
  });
}

function csvToJSON (csv) {
  const lines = csv.replace(/\r/g, '').split('\n');
  const header = lines[0].split(',');
  const body = lines.slice(1);
  // we need these two value + nothing falsey in the header
  if (header.indexOf('data_value') === -1 || header.indexOf('sub_nat_id') === -1 || header.some(h => !h)) {
    console.log(header);
    throw new Error('Invalid csv');
  }
  return body.map(b => {
    return Object.assign(...b.split(',').map((el, i) => ({ [header[i]]: el })));
  });
}
