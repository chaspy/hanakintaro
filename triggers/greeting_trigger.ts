import { Trigger } from 'deno-slack-api/types.ts'
import Workflow from '../workflows/greeting_workflow.ts'
import env from '../env.ts'

/**
 * Triggers determine when Workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const greetingTrigger: Trigger<typeof Workflow.definition> = {
  type: 'event',
  event: {
    event_type: 'slack#/events/app_mentioned',
    channel_ids: [`${env.CHANNEL_ID}`],
  },
  name: 'Send a greeting',
  description: 'Send greeting to channel',
  workflow: '#/workflows/greeting_workflow',
  inputs: {
    channelId: {
      value: '{{data.channel_id}}',
    },
  },
}

export default greetingTrigger
