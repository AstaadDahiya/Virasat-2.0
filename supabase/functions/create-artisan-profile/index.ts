import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Create Artisan Profile function started.");

Deno.serve(async (req) => {
  // This is needed for the Supabase Auth Hook to work
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Get the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // 2. Get the service role key from the environment variables
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }

    // 3. Verify the token from the header matches the service key
    const token = authHeader.replace('Bearer ', '');
    if (token !== serviceRoleKey) {
      throw new Error('Invalid authorization token');
    }
    
    console.log("Authorization successful.");

    // 4. Create an admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    // 5. Get the new user record from the request body.
    const { record: user } = await req.json();
    if (!user || !user.id) {
        throw new Error('User data not found in request body');
    }
    
    console.log(`Processing user: ${user.id}`);

    // 6. Define the new artisan profile data.
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

    // 7. Insert the new artisan profile into the database.
    const { error } = await supabaseAdmin.from('artisans').insert(newArtisan);
    if (error) {
      console.error("Insert error:", error);
      throw new Error(`Database insert failed: ${error.message}`);
    }

    console.log(`Successfully created artisan profile for user: ${user.id}`);

    // 8. Return a success response.
    return new Response(JSON.stringify({ message: `Artisan profile created for ${user.id}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Function error:", error.message);
    const isAuthError = error.message.toLowerCase().includes('authorization') || error.message.toLowerCase().includes('token');
    
    // 9. Return an error response.
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: isAuthError ? 401 : 400,
    });
  }
});
