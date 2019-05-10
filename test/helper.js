'use strict';

var fs = require('fs');


function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

module.exports.readFile = readFile;


var ApmnModdle = require('apmn-moddle').default;

var camundaDescriptor = require('../resources/camunda');

function createModdle() {
  return new ApmnModdle({
    camunda: camundaDescriptor
  });
}

module.exports.createModdle = createModdle;