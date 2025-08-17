import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Registration from "../models/Registration.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vehical_assignment";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const file = path.join(process.cwd(), "data", "sample.json");
    const raw = fs.readFileSync(file, "utf-8");
    const items = JSON.parse(raw).map(r => ({ ...r, date: new Date(r.date) }));

    await Registration.deleteMany({});
    await Registration.insertMany(items);
    console.log(`✅ Seeded ${items.length} records.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
