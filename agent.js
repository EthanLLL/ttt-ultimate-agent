import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { tools, functionMaps } from './tools/index.js'

// Create a Bedrock Runtime client in the AWS Region you want to use.
console.log(process.env.REGION)
const client = new BedrockRuntimeClient({ region: process.env.REGION });

// Set the model ID, e.g., Claude 3 Haiku.
const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0'
// const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';

export async function agent(message) {
  const messages = [
    {
      role: "user",
      content: [{ text: message }],
    },
  ]

  let res = 'Hello'

  try {
    while (true) {
      const command = new ConverseCommand({
        modelId,
        messages: messages,
        inferenceConfig: { maxTokens: 512, temperature: 0 },
        toolConfig: tools
      });
      // calling LLM
      const response = await client.send(command);
      console.log(response)
      if (response.stopReason === 'tool_use') {
        const tools2use = response.output.message.content.filter(item => {
          return 'toolUse' in item
        })
        console.log(tools2use)
        messages.push(response.output.message)

        const toolsResults = []
        for (const toolCall of tools2use) {
          const name = toolCall.toolUse.name
          const args = toolCall.toolUse.input
          console.log(name)
          console.log(args)
          // call the function
          const functionToCall = functionMaps[name]
          const funcResult = await functionToCall(args)
          console.log(`Function calling result: ${JSON.stringify(funcResult)}`)
          // add function call result to prompt
          const toolResult = {
            toolUseId: toolCall.toolUse.toolUseId,
            content: [{ "text": funcResult }]
          }
          toolsResults.push(
            {
              "toolResult": toolResult
            }
          )
        }
        messages.push({
          role: "user",
          content: toolsResults
        })
      } else {
        res = response.output.message.content[0].text
        break
      }
    }
    // logger.info(`MsgId: ${msgId} agent loop result => ${res.result}, Input token => ${res.inputToken}, Output token => ${res.outputToken}`)
  } catch (e) {
    // logger.error(`MsgId: ${msgId} agent loop error => ${e}, Input token => ${res.inputToken}, Output token => ${res.outputToken}`)
    console.log(e)
    res = 'Oops! Something went wrong.'
  }
  return res

}




