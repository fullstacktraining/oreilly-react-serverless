'use strict';
const aws = require('aws-sdk');
const lambda = new aws.Lambda();

module.exports.hello = async (event, context) => {
  
  const options = {
    FunctionName: 'chaining-dev-hola'
  };

  const test = await lambda.invoke(options).promise();
  return {
    message: 'This is hello',
    dataFromHolaFunction: test
  };

};

module.exports.hola = async (event, context) => {
  return {
    message: 'Hola mundo!'
  };
};