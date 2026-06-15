import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const envVars = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('=').map(s => s.trim())));

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: bookings, error: bErr } = await supabase.from('bookings').select('id, reference, status, guest_name');
  console.log("Bookings:", JSON.stringify(bookings, null, 2));
  if (bErr) console.error("Bookings Error:", bErr);

  const { data: submissions, error: sErr } = await supabase.from('payment_submissions').select('*');
  console.log("Submissions:", JSON.stringify(submissions, null, 2));
  if (sErr) console.error("Submissions Error:", sErr);
}

main();
