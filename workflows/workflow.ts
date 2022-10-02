import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { GreetingFunctionDefinition } from '../functions/greeting_function.ts'

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const Workflow = DefineWorkflow({
  callback_id: 'greeting_workflow',
  title: 'Send a greeting',
  description: 'Send a greeting to channel',
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
      },
      channelId: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ['channelId'],
  },
})

const greetingFunctionStep = Workflow.addStep(GreetingFunctionDefinition, {
  message: Workflow.inputs.message,
})

Workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: Workflow.inputs.channelId,
  message: greetingFunctionStep.outputs.greeting,
})

export default Workflow
