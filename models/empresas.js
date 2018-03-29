'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  // Define a Sequelize model
  const Empresa = sequelize.define('empresas', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    direccion: {
      type: Sequelize.STRING
    }
  });

  return Empresa;
};
