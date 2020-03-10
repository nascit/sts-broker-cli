import {Command, flags}from '@oclif/command'
const inquirer = require('inquirer')
import axios from 'axios'
import cli from 'cli-ux'
const storage = require("node-persist");
var tmp = require('tmp');
import * as fs from "fs";
import { getToken } from "../cognito";
const chalk = require('chalk')
const exec = require('await-exec')

export default class Access extends Command {
  static description = 'Assume the temporary session'

  static flags = {
    help: flags.help({char: 'h'}),
    profile: flags.string({description: 'AWS Profile', required: true}),
    console: flags.boolean({char: 'c', description: 'Open AWS Console'})
  }

  async run() {
    const {args, flags} = this.parse(Access)

    await storage.init({ dir: this.config.configDir })

    const config = await storage.getItem('config')

    var tmpobj = tmp.fileSync()

    fs.writeFileSync(tmpobj.name, JSON.stringify(config))

    try {
      const cognitoToken: string = await getToken({
        hostedUI: tmpobj.name
      })

      cli.action.start(chalk.blue("Retrieving your AWS temporary credentials"))

      axios.defaults.headers.common['Authorization'] = cognitoToken
      axios.defaults.headers.post['Content-Type'] = 'application/json'
      const response = await axios.get(config.endpoint + '/credentials')

      await exec(`aws configure set aws_access_key_id ${response.data.credentials.AccessKeyId} --profile ${flags.profile}`)
      await exec(`aws configure set aws_secret_access_key ${response.data.credentials.SecretAccessKey} --profile ${flags.profile}`)
      await exec(`aws configure set aws_session_token ${response.data.credentials.SessionToken} --profile ${flags.profile}`)

      cli.action.stop(chalk.blue(`Temporary credentials have been set. Use \'--profile ${flags.profile}\' to use your temporary credentials.`));

      if (flags.console) {
        await cli.open(response.data.signin_url)
      }

      process.exit();
    } catch (error) {
      this.error(chalk.red("Sorry, it seems something went wrong while contacting your STS Broker"));
      process.exit();
    }
  }
}
