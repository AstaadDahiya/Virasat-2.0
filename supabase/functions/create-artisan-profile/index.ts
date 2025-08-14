import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Main function to handle the incoming request.
Deno.serve(async (req) => {
  // This is needed for the Supabase Auth Hook to work
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create an admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the new user record from the request body.
    const { record: user } = await req.json();

    // The data for the new artisan profile.
    const newArtisan = {
      id: user.id,
      name: user.email?.split('@')[0] || 'New Artisan',
      name_hi: 'नया कारीगर',
      bio: 'Welcome to Virasat! Please update your bio.',
      bio_hi: 'विरासत में आपका स्वागत है! कृपया अपनी जीवनी अपडेट करें।',
      profileImage: 'https://placehold.co/100x100.png',
      location: 'India',
      location_hi: 'भारत',
      craft: 'Handicrafts',
      craft_hi: 'हस्तशिल्प',
    };

    // Insert the new artisan profile into the public.artisans table.
    const { error } = await supabaseAdmin.from('artisans').insert(newArtisan);

    if (error) {
      throw error;
    }

    // Return a success response.
    return new Response(JSON.stringify({ message: `Artisan profile created for ${user.id}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Return an error response.
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
