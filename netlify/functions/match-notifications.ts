import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  // Placeholder: send notifications when a match is created/updated
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  }
}
