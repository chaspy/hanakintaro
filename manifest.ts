import { Manifest } from 'deno-slack-sdk/mod.ts'
import Workflow from './workflows/greeting_workflow.ts'

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: 'hanakin',
  description: 'Send comment if today is Hanakin or not',
  icon: 'assets/icon.png',
  workflows: [Workflow],
  outgoingDomains: [],
  botScopes: ['chat:write', 'chat:write.public', 'app_mentions:read'],
})
