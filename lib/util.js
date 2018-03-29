'use strict';

const fs = require('fs');
const path = require('path');

function removeAll (elements, list) {
  var ind;

  for (var i = 0, l = elements.length; i < l; i++) {
    while ((ind = list.indexOf(elements[i])) > -1) {
      list.splice(ind, 1);
    }
  }
}

function loadModels (PATH, sequelize, opts = {}) {
  let files = fs.readdirSync(PATH);
  let models = {};

  if (opts.exclude) {
    removeAll(opts.exclude, files);
  }

  files.forEach(function (file) {
    let pathFile = path.join(PATH, file);
    if (fs.statSync(pathFile).isDirectory()) {
      models[file] = loadModels(pathFile, sequelize, opts);
    } else {
      file = file.replace('.js', '');
      console.log('file-load:', file, require(pathFile)(sequelize));
      models[file] = require(pathFile)(sequelize);
    }
  });

  return models;
}

function convertLinealObject (data) {
  let ob = {};
  for (let i in data) {
    for (let j in data[i]) {
      ob[j] = data[i][j];
    }
  }
  return ob;
}

module.exports = {
  loadModels,
  convertLinealObject
};
