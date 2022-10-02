import { SlackFunctionTester } from 'deno-slack-sdk/mod.ts'
import { assertEquals } from 'https://deno.land/std@0.153.0/testing/asserts.ts'
import ResponseFunction from './response.ts'

const { createContext } = SlackFunctionTester('response')

Deno.test('Response function test', async () => {
  const inputs = { message: '<@U0454P74J6M> 今日花金？' }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(outputs?.response.includes('今日花金？'), true)
})
