import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não encontrada. Configure o arquivo .env.local antes.");
  }

  const sql = neon(databaseUrl);
  const schema = await readFile(resolve(process.cwd(), "database/schema.sql"), "utf8");
  const statements = schema.split(";").map((statement) => statement.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);

  process.stdout.write("Schema aplicado. Nenhum projeto foi criado ou alterado.\n");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
