import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
const chalk = require('chalk')
const storage = require("node-persist")
import { getToken } from "../cognito";
var tmp = require('tmp');
import * as fs from "fs";
const axios = require('axios');

export default class Policies extends Command {
  static description = 'Get STS Broker policies available'

  static flags = {
    ...cli.table.flags(),
    reset: flags.boolean({ description: "Reset Cognito credentials" })
  }

  async run() {

    const { flags } = this.parse(Policies);

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

      cli.table(response.data,
        {
          policy_id: {
            header: 'Policy ID',
            minWidth: 20,
          }
          ,
          description: {
            get: (row: any) => row.description,
          },
          account: {
            header: 'AWS Account'
          }
        },
        {
          printLine: this.log,
          ...flags, // parsed flags
        },
      )
      process.exit();

    } catch (error) {
      this.error(chalk.red("Sorry... It seems like something went wrong while retrieving your policy list"));
      process.exit();
    }

  }
}
