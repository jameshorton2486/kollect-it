
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required')
}

serve(async (req) => {
  // Verify WebSocket upgrade request
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 })
  }

  try {
    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req)
    console.log("WebSocket connection established")

    // Set up connection to OpenAI's WebSocket
    const openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4-turbo-preview")
    
    // Handle incoming messages from client
    socket.onmessage = (event) => {
      console.log("Received message from client:", event.data)
      try {
        openAISocket.send(event.data)
      } catch (err) {
        console.error("Error sending to OpenAI:", err)
        socket.send(JSON.stringify({ error: "Failed to relay message to OpenAI" }))
      }
    }

    // Handle OpenAI responses
    openAISocket.onmessage = (event) => {
      try {
        socket.send(event.data)
      } catch (err) {
        console.error("Error sending to client:", err)
      }
    }

    // Handle WebSocket closure
    socket.onclose = () => {
      console.log("Client WebSocket closed")
      openAISocket.close()
    }

    return response
  } catch (err) {
    console.error("WebSocket setup error:", err)
    return new Response(`Failed to setup WebSocket: ${err.message}`, { status: 500 })
  }
})
