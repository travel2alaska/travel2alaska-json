/**
 * Travel2Alaska - Events Ingest Worker
 * 
 * This worker can be triggered via webhook or cron job to fetch external event feeds,
 * normalize them matching the `event.schema.json`, and commit them back to this GitHub repository.
 */

export interface Env {
  GITHUB_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Basic Webhook intake for events
    if (request.method === "POST") {
      try {
        const data = await request.json();
        // 1. Validate incoming data lightly
        // 2. Normalize to T2A Event Schema
        // 3. Dispatch to GitHub Action or commit via API
        
        return new Response(JSON.stringify({ success: true, message: "Event queued for ingestion" }), {
          headers: { "content-type": "application/json" }
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 400 });
      }
    }
    
    return new Response("Travel2Alaska Ingest Worker - Active");
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // CRON JOB logic here:
    // e.g., Fetch ADF&G events or KCAW feeds, normalize, and push to GitHub.
    console.log("Running scheduled ingest event");
  }
};
