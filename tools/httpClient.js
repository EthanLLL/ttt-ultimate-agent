import axios from "axios";

export async function httpClient({ method, url, body }, shop, accessToken) {
  let res
  switch (method.toLowerCase()) {
    case 'get':
      res = await get(url)
      break;
    case 'post':
      res = await post(url, body)
      break;
    case 'put':
      res = await put(url, body)
      break
    case 'delete':
      res = await del(url)
      break
    default:
      res = 'Invalid http method provided.'
  }
  return res
}

async function get(url) {
  // const url = `https://${shop}${path}`
  const r = await axios.get(url, {
  })
  if (r.status >= 200 && r.status < 300) {
    return `Status: ${r.status} - result => ${JSON.stringify(r.data)}`
  } else {
    return `Status: ${r.status} - Http get failed`
  }
}

async function post(url, body) {
  let payload
  try {
    payload = JSON.parse(body)
  } catch (error) {
    logger.error(`Input body cannot parse to a valid json object: ${body}`)
    payload = {}
  }
  const r = await axios.post(url, payload, {
  })
  if (r.status >= 200 && r.status < 300) {
    return `Status: ${r.status} - Http post successed, result => ${JSON.stringify(r.data)}`
  } else {
    return `Status: ${r.status} - Http post failed`
  }
}

async function put(url, body) {
  const payload = JSON.parse(body)
  const r = await axios.put(url, payload, {
  })
  if (r.status >= 200 && r.status < 300) {
    return `Status: ${r.status} - Http put successed, result => ${JSON.stringify(r.data)}`
  } else {
    return `Status: ${r.status} - Http put failed`
  }
}

async function del(url) {
  const r = await axios.delete(url, {
  })
  if (r.status >= 200 && r.status < 300) {
    return `Status: ${r.status} - Http delete successed`
  } else {
    return `Status: ${r.status} - Http delete failed`
  }
}
