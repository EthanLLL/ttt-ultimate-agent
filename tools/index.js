import { httpClient } from "./httpClient.js";
import { searchFromKB } from "./searchFromKB.js";

export const functionMaps = {
  httpClient,
  searchFromKB,
}

export const tools = {
  tools: [
    {
      toolSpec: {
        name: "searchFromKB",
        description: 'Use this tool to get API document if user ask you to do anything such as shopping, book flight and control home devices',
        inputSchema: {
          json: {
            type: "object",
            properties: {
              input: {
                type: "string",
                description: "The summary of user request to semantic search relevant document in English",
              },
            }
          }
        }
      }
    },
    {
      toolSpec: {
        name: "httpClient",
        description: "Use this HTTP tool to make an HTTP GET, POST, Put or Delete request to api endpoint only after you find the API request sample.",
        inputSchema: {
          json: {
            type: 'object',
            properties: {
              method: {
                type: 'string',
                enum: ['get', 'post', 'put', 'delete']
              },
              url: {
                type: 'string',
                description: 'The full api url to use in http request',
              },
              body: {
                type: 'string',
                description: 'The request body in a valid JSON content type which can be empty string if http method is get or delete',
              },
            },
            required: ['method', 'path', 'body'],
          }
        }
      }
    }
  ]
}
