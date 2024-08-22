import axios from "axios";


async function content2embedding(input) {
  const url = 'https://api.voyageai.com/v1/embeddings'
  const payload = {
    'input': [
      input
    ],
    'model': 'voyage-large-2'
  }
  const headers = {
    'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`
  }
  const r = await axios.post(
    url,
    payload,
    { headers }
  )

  const embedding = r.data.data[0].embedding
  return embedding
}

async function queryByEmbeddingQdrant(vector, threshold, count) {
  const url = `${process.env.QDRANT_URL}/collections/api_document/points/search`
  const payload = {
    vector: vector,
    with_payload: true,
    score_threshold: threshold,
    limit: count
  }
  const headers = {
    'api-key': process.env.QDRANT_KEY
  }
  const r = await axios.post(url, payload, { headers })
  if (r.status === 200) {
    return r.data.result
  } else {
    return []
  }
}

export async function getContentByStr(input, threshold, count) {
  const vector = await content2embedding(input)
  console.log(vector)
  // const data = await queryByEmbedding(embedding, threshold, count)
  const data = await queryByEmbeddingQdrant(vector, threshold, count)
  console.log(data)
  // logger.info(`Query from embedding: ${JSON.stringify(data)}`)
  if (data.length > 0) {
    let content = ''
    data.map((item, i) => {
      content += `${i + 1}. ${item.payload.content}\n`
    })
    // const content = data[0].payload.content
    return content
  } else {
    return ''
  }
}
