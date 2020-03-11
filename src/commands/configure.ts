import {Command, flags} from '@oclif/command'
import * as fs from 'fs-extra'
import * as path from 'path'
import cli from 'cli-ux'
const inquirer = require('inquirer')
const storage = require("node-persist")
const chalk = require('chalk')
const tmp = require('tmp');

const prompt = async (): Promise<any> => {

  let getRegion: any = await inquirer.prompt([{
    name: 'region',
    message: 'In what region is the STS Broker hosted?',
    type: 'input',
    validate: function(value) {
      var pass = value.match(
        /(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d/g
      );
      if (pass) {
        return true;
      }
      return 'Please enter a valid AWS region';
    }
  }])

  let getEndpoint: any = await inquirer.prompt([{
    name: 'endpoint',
    message: 'What is your STS Broker endpoint? (eg.: "xxxxx.execute-api.us-east-2.amazonaws.com/Prod")',
    type: 'input',
    validate: function(value) {
      var pass = value.match(
        /((www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -]/g
      );
      if (pass) {
        return true;
      }
      return 'Please enter a valid endpoint';
    }
  }])

  let getUserPoolId: any = await inquirer.prompt([{
    name: 'userPoolId',
    message: 'What is your Cognito User Pool ID?',
    type: 'input',
    validate: function(value) {
      var pass = value.match(
        /(us(-gov)?|ap|ca|cn|eu|sa)-(central|(north|south)?(east|west)?)-\d_([A-Za-z0-9]{9,9}$)/g
      );
      if (pass) {
        return true;
      }
      return 'Please enter a valid User Pool ID';
    }
  }])

  let getUserPoolWebClientId: any = await inquirer.prompt([{
    name: 'userPoolWebClientId',
    message: 'What is your Cognito User Pool App client ID?',
    type: 'input',
    validate: function(value) {
      var pass = value.match(
        /^([a-z0-9]{26,26}$)/g
      );
      if (pass) {
        return true;
      }
      return 'Please enter a valid User Pool App client ID';
    }
  }])

  let getCognitoDomain: any = await inquirer.prompt([{
    name: 'cognitoDomain',
    message: 'What is your Cognito domain URL? (eg.: "stsbroker.auth.us-east-2.amazoncognito.com")',
    type: 'input',
    validate: function(value) {
      var pass = value.match(
        /((www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -]/g
      );
      if (pass) {
        return true;
      }
      return 'Please enter a valid endpoint';
    }
  }])

  const config = {
    "region": getRegion.region,
    "endpoint": getEndpoint.endpoint,
    "userPoolId": getUserPoolId.userPoolId,
    "userPoolWebClientId": getUserPoolWebClientId.userPoolWebClientId,
    "domain": getCognitoDomain.cognitoDomain,
    "redirectSignIn": "http://localhost:3000",
    "redirectSignOut": "http://localhost:3000"
  }

  await storage.setItem('config', config)
}

export default class Configure extends Command {
  static description = 'Configure your STS Broker'

  async run() {

    try {
      await storage.init({ dir: this.config.configDir })
      await prompt()
    } catch(error) {
      this.error(chalk.red("Something wen wrong while configuring your STS Broker."))
    }
    this.log(chalk.blue("You have successfully configured your STS Broker."))
  }

}
