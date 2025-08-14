
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Create Artisan Profile function booting up...");

// This function is triggered by a Supabase Auth hook when a new user signs up.
serve(async (req) => {
  try {
    const { record: user } = await req.json();

    if (!user) {
      throw new Error("No user record found in the request body.");
    }
    
    // Use the SERVICE_ROLE_KEY for admin-level access to bypass RLS.
    // This key should be set as an environment variable in your Supabase function settings.
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if a profile already exists. This is a safety check.
    const { data: existingProfile, error: selectError } = await supabaseAdmin
      .from('artisans')
      .select('id')
      .eq('id', user.id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // 'PGRST116' means no rows found
        throw selectError;
    }

    // If a profile already exists, do nothing further.
    if (existingProfile) {
      console.log(`Profile for user ${user.id} already exists.`);
      return new Response(JSON.stringify({ message: "Profile already exists." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // Create the new artisan profile.
    const { error: insertError } = await supabaseAdmin.from("artisans").insert({
      id: user.id,
      name: user.email?.split('@')[0] || `Artisan ${user.id.substring(0, 6)}`,
      name_hi: "नया कारीगर",
      bio: "Welcome to Virasat! Please update your bio from the settings page.",
      bio_hi: "विरासत में आपका स्वागत है! कृपया अपनी जीवनी सेटिंग्स पृष्ठ से अपडेट करें।",
      craft: "Not specified",
      craft_hi: "निर्दिष्ट नहीं है",
      location: "Not specified",
      location_hi: "निर्दिष्ट नहीं है",
      profileImage: `https://placehold.co/100x100.png`
    });

    if (insertError) {
      throw insertError;
    }

    console.log(`Successfully created profile for user: ${user.id}`);
    
    return new Response(JSON.stringify({ message: "Profile created successfully" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error creating artisan profile:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
