import { SlackFunctionTester } from 'deno-slack-sdk/mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'
import ResponseFunction from './response.ts'
import env from '../env.ts'

const { createContext } = SlackFunctionTester('response')

// when: @hanakin keyword
// expect: return answer
Deno.test('Response function test -- keyword', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ${env.answer}` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(
    Object.values(env.message).includes(`${outputs?.response}`),
    true
  )
})

// when: @hanakin non-keyword
// expect: return usage
Deno.test('Response function test -- non-keyword', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ABCDEFGH` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(outputs?.response, env.usage)
})
