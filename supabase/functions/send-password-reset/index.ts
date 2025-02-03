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

interface PasswordResetRequest {
  email: string;
}

const generateResetToken = () => {
  return crypto.randomUUID();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetRequest = await req.json();
    console.log("Received password reset request for:", email);

    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", email)
      .single();

    if (userError || !userData) {
      console.log("User not found:", email);
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ message: "If the email exists, a reset link has been sent." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate reset token
    const token = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Store token in database
    const { error: tokenError } = await supabase
      .from("auth_tokens")
      .insert({
        user_id: userData.id,
        token: token,
        type: "password_reset",
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error storing token:", tokenError);
      throw new Error("Failed to create reset token");
    }

    // Send reset email
    const resetLink = `${req.headers.get("origin")}/reset-password?token=${token}`;
    
    const emailResponse = await resend.emails.send({
      from: "Kollect-It <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Kollect-It Password",
      html: `
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Kollect-It Team</p>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ message: "If the email exists, a reset link has been sent." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
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