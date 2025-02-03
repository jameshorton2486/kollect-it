import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailVerificationRequest {
  email: string;
  userId: string;
}

const generateVerificationToken = () => {
  return crypto.randomUUID();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId }: EmailVerificationRequest = await req.json();
    console.log("Received verification request for:", email);

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Store token in database
    const { error: tokenError } = await supabase
      .from("auth_tokens")
      .insert({
        user_id: userId,
        token: token,
        type: "email_verification",
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error storing token:", tokenError);
      throw new Error("Failed to create verification token");
    }

    // Send verification email
    const verificationLink = `${req.headers.get("origin")}/verify-email?token=${token}`;
    
    const emailResponse = await resend.emails.send({
      from: "Kollect-It <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your Kollect-It account",
      html: `
        <h1>Welcome to Kollect-It!</h1>
        <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationLink}">Verify Email Address</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with Kollect-It, please ignore this email.</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);