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
  const data = csvToJSON(fs.readFileSync(file).toString().replace(/"/g, ''));
  request.post(`${api}/indicators`, {
    json: true,
    headers: {
      Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJlZGl0Il0sImlzcyI6Imh0dHBzOi8vZ3JhbmFyeS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTgyNGZmYTE3MGFlNTA3ZDZlNTEwNjQ2IiwiYXVkIjoiVkJraEx1anU2WWNDc01Oa0Y1STFsWGExRnQ3QkY5VlAiLCJleHAiOjE0Nzk4NzQzMjgsImlhdCI6MTQ3OTgzODMyOH0.1mrOlgzakRvxa_VuHOwbfwvjnB2-v_hdKlXr34oKOg0',
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
