import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  // Example: trigger Supabase function to refresh materialized view
  // In production, secure this endpoint (verify secret, use service_role key)
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: 'Stats recalculation queued' })
  }
}
