import { Database } from "../types/database";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

export class SupabaseSingleton {
  private static instance: SupabaseSingleton;
  supabase: SupabaseClient<Database>;
  private constructor(url: string = "", key: string = "") {
    this.supabase = createClient<Database>(
      url,
      key, {
        auth: {
          persistSession: false,
        }
      }
    );
  }

  public static getInstance() {
    if (!SupabaseSingleton.instance) {
      SupabaseSingleton.instance = new SupabaseSingleton(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY,
      )
    }
    return SupabaseSingleton.instance;
  }
}
