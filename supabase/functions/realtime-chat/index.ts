
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required')
}

// Define CORS headers with specific origin
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://loveable.dev',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute
const clientRequests = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(clientId: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const clientData = clientRequests.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit data
    clientRequests.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { limited: false };
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = clientData.resetTime - now;
    return { limited: true, retryAfter };
  }

  // Increment request count
  clientData.count++;
  return { limited: false };
}

serve(async (req) => {
  // Log the request for debugging
  console.log("Received request:", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request")
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    })
  }

  // Check rate limit
  const clientId = req.headers.get('x-client-info') || req.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitCheck = isRateLimited(clientId);
  
  if (rateLimitCheck.limited) {
    console.log(`Rate limit exceeded for client: ${clientId}`);
    return new Response(JSON.stringify({
      error: {
        message: 'Too many requests',
        code: 429,
        retryAfter: rateLimitCheck.retryAfter
      }
    }), {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': `${Math.ceil(rateLimitCheck.retryAfter! / 1000)}`
      }
    });
  }

  // Verify WebSocket upgrade request
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""
  if (upgradeHeader.toLowerCase() !== "websocket") {
    console.log("Non-WebSocket request received, returning 400")
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    })
  }

  try {
    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req)
    console.log("WebSocket connection established")

    // Add CORS headers to the WebSocket response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Set up connection to OpenAI's WebSocket with proper error handling
    const openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4-turbo-preview")
    
    // Handle OpenAI WebSocket connection
    openAISocket.onopen = () => {
      console.log("Connected to OpenAI WebSocket")
      try {
        openAISocket.send(JSON.stringify({
          type: 'init',
          data: {
            model: 'gpt-4-turbo-preview',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
          }
        }))
      } catch (err) {
        console.error("Error sending initial configuration:", err)
        socket.send(JSON.stringify({ 
          type: 'error', 
          error: 'Failed to initialize OpenAI connection' 
        }))
      }
    }

    openAISocket.onerror = (error) => {
      console.error("OpenAI WebSocket error:", error)
      socket.send(JSON.stringify({ 
        type: 'error', 
        error: 'OpenAI connection error' 
      }))
    }
    
    // Handle incoming messages from client
    socket.onmessage = async (event) => {
      console.log("Received message from client:", event.data)
      
      // Check rate limit for each message
      const messageRateLimit = isRateLimited(clientId);
      if (messageRateLimit.limited) {
        socket.send(JSON.stringify({
          type: 'error',
          error: {
            code: 429,
            message: 'Too many requests',
            retryAfter: messageRateLimit.retryAfter
          }
        }));
        return;
      }

      try {
        const message = JSON.parse(event.data)
        openAISocket.send(JSON.stringify(message))
      } catch (err) {
        console.error("Error handling client message:", err)
        socket.send(JSON.stringify({ 
          type: 'error', 
          error: 'Failed to process message' 
        }))
      }
    }

    // Handle OpenAI responses
    openAISocket.onmessage = (event) => {
      try {
        socket.send(event.data)
      } catch (err) {
        console.error("Error sending OpenAI response:", err)
        socket.send(JSON.stringify({ 
          type: 'error', 
          error: 'Failed to relay OpenAI response' 
        }))
      }
    }

    // Handle client disconnection
    socket.onclose = () => {
      console.log("Client WebSocket closed")
      openAISocket.close()
    }

    // Handle OpenAI disconnection
    openAISocket.onclose = () => {
      console.log("OpenAI WebSocket closed")
      socket.close()
    }

    return response
  } catch (err) {
    console.error("WebSocket setup error:", err)
    return new Response(`Failed to setup WebSocket: ${err.message}`, { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    })
  }
})
