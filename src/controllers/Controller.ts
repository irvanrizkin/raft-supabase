import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database";
import { SupabaseSingleton } from "../services/SupabaseSingleton";
import { CustomError } from "../utils/CustomError";


export class Controller {
  protected supabase: SupabaseClient<Database>
  constructor() {
    this.supabase = SupabaseSingleton.getInstance().supabase;
  }

  protected throwCustomError(message: string, status: number) {
    throw new CustomError(message, status);
  }
}
