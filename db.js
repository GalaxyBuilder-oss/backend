import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

const { HOST, PORT, USERNAME, PASSWORD, DATABASE } = process.env;

// Pastikan variabel-variabel environment sudah di-set dengan benar
if (!HOST || !PORT || !USERNAME || !PASSWORD || !DATABASE) {
  console.error("Missing environment variables. Please check your .env file.");
  process.exit(1); // Keluar jika ada yang kosong
}

export const client = new Pool({
  host: HOST,
  user: USERNAME,
  password: PASSWORD,
  port: PORT,
  database: DATABASE,
});

client.connect()
