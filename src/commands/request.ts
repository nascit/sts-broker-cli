import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import axios from 'axios'
import cli from 'cli-ux'
const exec = require('await-exec')
const storage = require("node-persist");

export default class Request extends Command {
  static description = 'Make a permission request to the STS Broker'

  static flags = {
    ...cli.table.flags(),
  }

  async run() {

    await storage.init({ dir: this.config.configDir })

    const config = await storage.getItem('config');

    const command = `cognitocurl --cognitoclient ${config.userPoolWebClientId} --userpool ${config.userPoolId} --run "curl -X GET ${config.endpoint}/policies"`;

    try {
      cli.action.start('Retrieving policies available for you', 'Just a moment :)', {stdout: true});

      let policies = await exec(command);

      cli.action.stop('Done!');

      if (policies.stdout) {
        let choices = JSON.parse(policies.stdout).map(
          obj => {
            return {
              "name" : obj.id + " - " + obj.description,
              "value": obj.id
            }
          }
        );
        let policy = "";
        let sessionDuration = 3600;

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

        sessionDuration = duration_response.sessionDuration;

        cli.action.start('Making the permission request', 'Just a moment :)', {stdout: true})

        const command = `cognitocurl --cognitoclient ${config.userPoolWebClientId} --userpool ${config.userPoolId} --token`;

        let token = await exec(command);

        var url = new URL(config.endpoint);

        axios.defaults.baseURL = url.origin;
        axios.defaults.headers.common['Authorization'] = token.stdout.toString().replace(/\r?\n|\r/g, '');
        axios.defaults.headers.post['Content-Type'] = 'application/json';

        const {data: response} = await axios.post(url.pathname + '/credentials/request', {
          policy: policy,
          sessionDuration: sessionDuration
        });

        cli.action.stop(response);

      } else {
        this.log(policies.stdout, policies.stderr);
        process.exit();
      }
    } catch (error) {
      this.log("Sorry, it seems something went wrong while contacting your STS Broker");
      this.log(error);
      return true;
    }

  }
}
