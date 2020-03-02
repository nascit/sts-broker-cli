import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import { exec } from "child_process";
import cli from 'cli-ux'

const storage = require("node-persist");

export default class Policies extends Command {
  static description = 'Get policies this user can retrieve'

  static flags = {
    ...cli.table.flags(),
  }

  async run() {

    await storage.init({ dir: this.config.configDir })

    const config = await storage.getItem('config');

    const command = `cognitocurl --cognitoclient ${config.userPoolWebClientId} --userpool ${config.userPoolId} --run "curl -X GET ${config.endpoint}/policies"`;
    exec(command, (err, stdout, stderr) => {

      const {flags} = this.parse(Policies)

      const policies = JSON.parse(stdout);

      cli.table(policies,
        {
          id: {
            header: 'Policy ID',
            minWidth: 20,
          }
          ,
          description: {
            get: (row: any) => row.description,
          }
        },
        {
          printLine: this.log,
          ...flags, // parsed flags
        },
      )
    });
  }
}
