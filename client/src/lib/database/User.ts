import { SupabaseClient } from "@supabase/supabase-js";
import getSupabaseClient from "./client";
import ENVIRONMENT from "@/configuration/environment";

const USER_TABLE_NAME = "user";

class UserDB {
  client: SupabaseClient;

  constructor() {
    this.client = getSupabaseClient;
  }

  async createUser(
    address: `0x${string}`,
    proof: string,
    merkle_root: string,
    nullifier_hash: string
  ) {
    try {
      const { error } = await this.client.from(USER_TABLE_NAME).insert({
        address: address.toLowerCase(),
        proof,
        merkle_root,
        nullifier_hash,
        verified: true,
      });
      if (!error) return true;
      return false;
    } catch (error) {
      console.log("createUser | Error - ", error);
      return false;
    }
  }

  async getUser(address: string) {
    try {
      const { data, error } = await this.client
        .from(USER_TABLE_NAME)
        .select("*")
        .eq("address", address.toLowerCase());
      if (data && Array(data)) return data[0];
      return null;
    } catch (error) {
      console.log("getUser | Error - ", error);
      return null;
    }
  }
}

const userDb = new UserDB();
export default userDb;
