import {Command, flags} from '@oclif/command'
import * as fs from 'fs-extra'
import * as path from 'path'
import cli from 'cli-ux'

const storage = require("node-persist");

const prompt = async (): Promise<any> => {

  const region = await cli.prompt('In what region is the STS Broker hosted?', { required: false })

  const endpoint = await cli.prompt('What is your STS Broker endpoint? (eg.: "xxxxx.execute-api.us-east-2.amazonaws.com/Prod")')

  const userPoolId = await cli.prompt('What is your Cognito User Pool ID?')

  const userPoolWebClientId = await cli.prompt('What is your Cognito User Pool client ID?')

  const cognito_domain = await cli.prompt('What is your Cognito domain URL? (eg.: "stsbroker.auth.us-east-2.amazoncognito.com")')

  const config = {
    "region": region,
    "endpoint": endpoint,
    "userPoolId": userPoolId,
    "userPoolWebClientId": userPoolWebClientId,
    "cognito_domain": cognito_domain,
    "redirectSignIn": "http://localhost:3000",
    "redirectSignOut": "http://localhost:3000"
  }

  await storage.setItem('config', config)
}

export default class Configure extends Command {
  static description = 'Configure your STS Broker'

  async run() {

    await storage.init({ dir: this.config.configDir })

    await prompt()

    this.log(JSON.stringify(await storage.getItem('config'), null, 4))

  }

}
