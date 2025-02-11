
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required')
}

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    })
  }

  // Verify WebSocket upgrade request
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders
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
      // Send initial configuration
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
      headers: corsHeaders
    })
  }
})
