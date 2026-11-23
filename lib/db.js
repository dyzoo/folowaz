import postgres from "postgres";
import { databaseUrl } from "@/lib/env";

const safeUrl = databaseUrl || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
const url = new URL(safeUrl);
url.searchParams.delete("channel_binding");

export const sql = postgres(url.toString(), {
  ssl: databaseUrl ? "require" : false,
  max: 5,
});
