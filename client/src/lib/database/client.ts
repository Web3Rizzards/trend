import { createClient } from "@supabase/supabase-js";
import ENVIRONMENT from "@/configuration/environment";

const getSupabaseClient = createClient(
  ENVIRONMENT.SUPABASE_URL,
  ENVIRONMENT.SUPABASE_KEY
);

export default getSupabaseClient;
