import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import env from '../env.ts'

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const GreetingFunctionDefinition = DefineFunction({
  callback_id: 'greeting_function',
  title: 'Generate a message',
  description: 'Generate a message',
  source_file: 'functions/greeting_function.ts',
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
      greeting: {
        type: Schema.types.string,
        description: 'Response from the bot',
      },
    },
    required: ['greeting'],
  },
})

export default SlackFunction(GreetingFunctionDefinition, ({ inputs }) => {
  const { message } = inputs
  const answer = `${env.answer}`

  const regex = /^(<@.*>) (.*)$/
  const found = message.match(regex)

  // debug
  console.log('message:' + message)
  console.log('answer: ' + answer)
  console.log('answer: ' + found[2])

  const greeting = found[2] === answer ? `${env.message}` : '...'

  return { outputs: { greeting } }
})
