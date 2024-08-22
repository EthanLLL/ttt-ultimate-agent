import { getContentByStr } from "../embedding.js";

export async function searchFromKB({ input }) {
  const res = await getContentByStr(input, 0.6, 2)
  if (res) {
    return `Found some document: ${res}\nPlease choose the right document and continue finish the task.`
  } else {
    return 'Found nothing. You may have to stop. You are OK to say you cannot process.'
  }
}
