import { SlackFunctionTester } from 'deno-slack-sdk/mod.ts'
import { assertEquals } from 'https://deno.land/std@0.153.0/testing/asserts.ts'
import ResponseFunction from './response.ts'
import env from '../env.ts'

const { createContext } = SlackFunctionTester('response')

// when: @hanakin keyword
// expect: return answer
Deno.test('Response function test -- success', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ${env.answer}` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(
    Object.values(env.message).includes(`${outputs?.response}`),
    true
  )
})

// when: @hanakin non-keyword
// expect: return usage
Deno.test('Response function test -- silince', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ABCDEFGH` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(outputs?.response, env.usage)
})
