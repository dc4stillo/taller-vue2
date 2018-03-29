'use strict';

const { ModelHandler } = require('sequelize-handlers');
const apiRest = '/api-rest/';
const util = require('../lib/util');
const types = {
  'post': {
    params: '',
    function: 'create'
  },
  'get-single': {
    params: '/:id',
    function: 'get'
  },
  'get': {
    params: '',
    function: 'query'
  },
  'delete': {
    params: '/:id',
    function: 'remove'
  },
  'put': {
    params: '/:id',
    function: 'update'
  }
};

function filterModel (model) {
  let pos = model.indexOf('?');
  if (pos !== -1) {
    console.log('cut', model.substring(0, pos));
    return model.substring(0, pos);
  }
  return model;
}

function init (app, sequelize) {
  // Cargando todos los modelos que se encuentran en la carpeta models y en sus subcarpetas
  console.log('PATH', __dirname);
  let models = util.loadModels(__dirname, sequelize, { exclude: ['index.js'] });
  // models = util.convertLinealObject(models);

  const { empresas, usuarios } = models;

  // Definiendo relaciones
  empresas.hasMany(usuarios, { foreignKey: { name: 'id_empresa', allowNull: false } });
  usuarios.belongsTo(empresas, { foreignKey: { name: 'id_empresa', allowNull: false } });

  // Creando manejadores sequelize-handler para cada modelo
  let handlers = {};

  for (let i in models) {
    handlers[i] = new ModelHandler(models[i]);
  }

  app.all(`${apiRest}*`, function (req, res, next) {
    let method = req.method.toLowerCase();
    let type = method;
    let url = req.url.split('/');
    let object = filterModel(url[2]);
    let model = models[object];

    if (method === 'get' && url.length === 4) {
      type = 'get-single';
    }
    app[method](`${apiRest}` + object + types[type].params || '', handlers[object][types[type].function](model));

    next();
  });

  return models;
}
module.exports = {
  init
};
