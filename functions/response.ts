import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { datetime } from 'https://deno.land/x/ptera/mod.ts'
import env from '../env.ts'

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const ResponseFunctionDefinition = DefineFunction({
  callback_id: 'response_function',
  title: 'Send a message',
  description: 'Generate a message',
  source_file: 'functions/response.ts',
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: 'Message to the bot',
      },
    },
    required: ['message'],
  },
  output_parameters: {
    properties: {
      response: {
        type: Schema.types.string,
        description: 'Response from the bot',
      },
    },
    required: ['response'],
  },
})

export default SlackFunction(ResponseFunctionDefinition, ({ inputs }) => {
  const { message } = inputs
  const answer = `${env.answer}`

  const regex = /^(<@.*>) (.*)$/
  const found = message.match(regex)
  const matched = found && found[2]
  const msg = matched ?? ''

  const dt = datetime().toZonedTime(`${env.timezone}`)
  const res = msg.split(' ', 2)
  const dayOfWeek = dt.weekDay()
  const dayOfWeekStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    dayOfWeek
  ]

  const noMatchMsg = 'Please mention me, ' + `${env.answer}`
  console.log('length: ' + res?.length)
  console.log('res[0]: ' + res[0])
  console.log('res[1]: ' + res[1])

  // debug
  console.log('message: ' + message)
  console.log('answer: ' + answer)
  console.log('msg: ' + msg)
  console.log('dayOfweek: ' + dayOfWeek)
  console.log('dayOfWeekStr: ' + dayOfWeekStr)

  const response = msg === answer ? `${env.message[dayOfWeekStr]}` : noMatchMsg

  return { outputs: { response } }
})
