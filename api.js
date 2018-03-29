'use strict';

const express = require('express');
const asyncify = require('express-asyncify');
const Sequelize = require('sequelize');
const api = asyncify(express.Router());
const Op = Sequelize.Op;

module.exports = function (models) {

  return api;
};
