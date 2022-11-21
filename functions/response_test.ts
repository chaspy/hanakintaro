import { SlackFunctionTester } from 'deno-slack-sdk/mod.ts'
import { assertEquals } from 'https://deno.land/std@0.153.0/testing/asserts.ts'
import ResponseFunction from './response.ts'
import env from '../env.ts'

const { createContext } = SlackFunctionTester('response')

Deno.test('Response function test -- success', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ${env.answer}` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(outputs?.response.includes('花金'), true)
})

Deno.test('Response function test -- silince', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ABCDEFGH` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(outputs?.response.includes(`${env.message}`), false)
})
