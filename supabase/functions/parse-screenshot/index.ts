/**
 * parse-screenshot Edge Function
 *
 * Accepts a base64 image + source type ("ghin" | "arccos"),
 * sends to Claude Vision to extract structured golf data,
 * returns the parsed result for user confirmation before DB insert.
 *
 * POST /functions/v1/parse-screenshot
 * Body: { image: string (base64), source: "ghin" | "arccos", mimeType: string }
 * Auth: Bearer <supabase_jwt>
 */

import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

const GHIN_PROMPT = `You are a golf data extraction expert. The user has uploaded a screenshot from the GHIN (Golf Handicap and Information Network) mobile app or website.

Extract ALL of the following data from the screenshot. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation.

Expected JSON structure:
{
  "handicapIndex": <number or null>,
  "lowIndex": <number or null>,
  "rounds": [
    {
      "date": "<YYYY-MM-DD>",
      "course": "<course name>",
      "score": <number>,
      "rating": <number or null>,
      "slope": <number or null>,
      "differential": <number or null>,
      "scoreType": "<home|away|tournament|penalty or null>"
    }
  ]
}

Rules:
- Extract EVERY round visible in the screenshot
- Dates should be in YYYY-MM-DD format
- If a score shows "N" or "Net", use the adjusted gross score
- If course rating/slope is not visible, set to null
- If handicap index is shown at the top, include it
- Differential may show as "Diff" or "Differential"
- If the screenshot contains the posting history/scoring record, extract all rows
- Be precise with numbers — double-check each value`;

const ARCCOS_PROMPT = `You are a golf data extraction expert. The user has uploaded a screenshot from the Arccos Caddie mobile app.

Extract ALL strokes gained data visible in the screenshot. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation.

Expected JSON structure:
{
  "sgTotal": <number or null>,
  "sgOffTee": <number or null>,
  "sgApproach": <number or null>,
  "sgAroundGreen": <number or null>,
  "sgPutting": <number or null>,
  "handicap": <number or null>,
  "roundCount": <number or null>,
  "shotCount": <number or null>,
  "fairwayHitPct": <number or null>,
  "girPct": <number or null>,
  "avgPutts": <number or null>,
  "avgScore": <number or null>,
  "details": {
    "driving": {
      "avgDistance": <number or null>,
      "fairwayPct": <number or null>,
      "missedLeft": <number or null>,
      "missedRight": <number or null>,
      "distanceSG": <number or null>,
      "accuracySG": <number or null>,
      "penaltySG": <number or null>
    },
    "approach": {
      "gir": <number or null>,
      "avgProximity": <number or null>,
      "byDistance": [
        { "range": "<e.g. 50-100>", "sg": <number>, "shotsPerRound": <number or null> }
      ]
    },
    "shortGame": {
      "upAndDownPct": <number or null>,
      "sandSavePct": <number or null>,
      "avgProximity": <number or null>
    },
    "putting": {
      "avgPutts": <number or null>,
      "onePuttPct": <number or null>,
      "threePuttPct": <number or null>,
      "makeRateByDistance": [
        { "distance": "<e.g. 3-5 ft>", "pct": <number or null> }
      ]
    }
  }
}

Rules:
- Extract ALL visible strokes gained values — they are the most important data
- SG values are typically negative for amateur golfers (e.g., -0.8, -2.3)
- Positive SG means better than baseline, negative means worse
- The "details" section may not be fully visible — fill what you can see, null for the rest
- "sgTotal" is often shown prominently at the top of the Arccos dashboard
- Some screenshots show SG trends (up/down arrows) — note the direction in the values
- Be precise with decimal values — strokes gained is typically to 1 decimal place`;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Verify the JWT with Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Parse request body
    const body = await req.json();
    const { image, source, mimeType } = body as {
      image: string;
      source: 'ghin' | 'arccos';
      mimeType: string;
    };

    if (!image || !source) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: image, source' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (source !== 'ghin' && source !== 'arccos') {
      return new Response(
        JSON.stringify({ error: 'Source must be "ghin" or "arccos"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Call Claude Vision
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const prompt = source === 'ghin' ? GHIN_PROMPT : ARCCOS_PROMPT;
    const mediaType = (mimeType || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract text response
    const textBlock = response.content.find((b) => b.type === 'text');
    const rawText = textBlock?.type === 'text' ? textBlock.text : '';

    // Parse JSON from response (handle potential markdown code blocks)
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(cleanJson);
    } catch {
      // If JSON parsing fails, return the raw text for debugging
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response as JSON',
          rawText,
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ data, rawText }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
