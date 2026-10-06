import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://burkkjwkgwfmzcdelwqn.supabase.co';
const supabaseKey = 'sb_publishable_mXOj2eeIV1AfffgSPpNXcA_ta0FPwE6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createMember() {
  const email = `testuser_${Date.now()}@example.com`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: {
        full_name: 'Test Karate Participant'
      }
    }
  });
  if (error) console.error(error);
  else console.log(data.user.id);
}
createMember();
