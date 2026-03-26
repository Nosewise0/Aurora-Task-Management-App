import ollama from 'ollama'

const response = await ollama.chat({
  model: 'mistral',
  stream: false,
  messages: [{ role: 'user', content: 'Can you generate a picture of a cat?' }],
})

console.log('Response Message')
console.log(response.message.content)