import {Command, flags}from '@oclif/command'
const inquirer = require('inquirer')
import axios from 'axios'
import cli from 'cli-ux'
const storage = require("node-persist");
var tmp = require('tmp');
import * as fs from "fs";
import { getToken } from "../cognito";
const chalk = require('chalk')

export default class Request extends Command {
static description = 'Make a permission request to the STS Broker'

  static flags = {
    ...cli.table.flags(),
    reset: flags.boolean({ description: "Reset Cognito credentials" })
  }

  async run() {

    const { flags } = this.parse(Request);

    await storage.init({ dir: this.config.configDir })

    const config = await storage.getItem('config')

    var tmpobj = tmp.fileSync()

    fs.writeFileSync(tmpobj.name, JSON.stringify(config))

    try {

      const cognitoToken: string = await getToken({
        hostedUI: tmpobj.name,
        reset: flags.reset
      })

      cli.action.start(chalk.blue("Let's check what policies are available for you"))

      axios.defaults.headers.common['Authorization'] = cognitoToken
      axios.defaults.headers.post['Content-Type'] = 'application/json'
      const response = await axios.get(config.endpoint + '/policies')

      cli.action.stop(chalk.blue("Done!"))

      var policies = response.data

      if (policies) {
        var choices = policies.map(
          obj => {
            return {
              "name" : obj.policy_id + " - " + obj.description,
              "value": obj.policy_id
            }
          }
        );
        let policy = "";

        let policy_response: any = await inquirer.prompt([{
          name: 'policy',
          message: 'What STS Broker policy would you like to request access?',
          type: 'list',
          choices: choices,
        }])
        policy = policy_response.policy;

        let duration_response: any = await inquirer.prompt([{
          name: 'sessionDuration',
          message: 'What session duration would you like to request?',
          type: 'list',
          choices: [{name: '15 minutes', value: 900}, {name: '1 hour', value: 3600}, {name: '6 hours', value: 21600}, {name: '12 hours', value: 43200}],
        }])

        var sessionDuration = duration_response.sessionDuration;

        cli.action.start(chalk.blue("Making the permission request"))

        const {data: response} = await axios.post(config.endpoint + '/credentials/request', {
          policy: policy,
          sessionDuration: sessionDuration
        });

        cli.action.stop(chalk.blue(response));
      } else {
        this.error("No STS Broker policies are available for you.")
        process.exit();
      }
    } catch (error) {
      this.error(chalk.red("Sorry, it seems something went wrong while contacting your STS Broker"));
      return true;
    }

  }
}
