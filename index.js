'use strict';

const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');
const port = 4000;
const api = require('./api');
const hook = require('./lib/hook');

// Create the Sequelize instance
const sequelize = new Sequelize('sqlite://taller.sqlite');

// Create the Express application
const app = express();
app.use(cors());
const models = require('./models').init(app, sequelize);
hook.validate(sequelize);

app.use(bodyParser.json());
app.use('/api', api(models));

// Synchronize our models and start the application
sequelize
.sync()
.then(start);

function start () {
  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`);
  });
}

// Express Error Handler
app.use((err, req, res, next) => {
  console.error(`${chalk.magenta('[ERROR]')}`, err);

  res.status(500).send({ error: err.message });
});

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);
