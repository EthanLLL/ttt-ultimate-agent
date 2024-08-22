import 'dotenv/config'
import express from 'express';
import { agent } from './agent.js'

const app = express();
const port = 3000;

app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
  console.log('User request: ' + req.body.messages[0].content)
  const result = await agent(req.body.messages[0].content)
  const response = {
    "id": "chatcmpl-abc123",
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": result
        },
        "finish_reason": "stop"
      }
    ]
  }
  res.send(response)
})

app.get('/', (req, res) => {
  res.send('Hello, How can I help you today?');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
