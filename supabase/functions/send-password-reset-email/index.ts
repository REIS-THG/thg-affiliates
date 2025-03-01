
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetEmailRequest {
  couponCode: string;
  adminEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { couponCode, adminEmail }: ResetEmailRequest = await req.json();

    if (!couponCode) {
      return new Response(
        JSON.stringify({ error: "Coupon code is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get admin email if not provided
    let recipientEmail = adminEmail;
    if (!recipientEmail) {
      const { data: adminUsers, error: adminError } = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/rest/v1/thg_affiliate_users?role=eq.admin&select=email`,
        {
          headers: {
            "Content-Type": "application/json",
            "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          },
        }
      ).then(res => res.json());

      if (adminError) {
        console.error("Error fetching admin emails:", adminError);
        return new Response(
          JSON.stringify({ error: "Failed to retrieve admin contact" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Use the first admin email found or default to a backup
      recipientEmail = adminUsers?.[0]?.email || "support@thg-affiliate.com";
    }

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "THG Affiliate <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Password Reset Request - Coupon ${couponCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3B751E;">Password Reset Request</h1>
          <p>A password reset has been requested for the following coupon code:</p>
          <p style="background-color: #f2f2f2; padding: 10px; border-radius: 5px; font-weight: bold;">${couponCode}</p>
          <p>Please contact the affiliate and verify their identity before resetting their password.</p>
          <p>You can reset their password from the admin dashboard.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">This is an automated message from the THG Affiliate System.</p>
        </div>
      `,
    });

    console.log("Reset email sent successfully:", emailResponse);

    // Record the request in the password_change_history table
    const { error: historyError } = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/rest/v1/password_change_history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({
          coupon_code: couponCode,
          changed_by: "forgot_password_request"
        })
      }
    ).then(res => res.json());

    if (historyError) {
      console.error("Error recording password change history:", historyError);
      // Continue despite history error
    }

    return new Response(JSON.stringify({ success: true, message: "Password reset request submitted" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset-email function:", error);
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
