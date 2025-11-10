import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, country } = req.body;
  if (!name || !email || !country)
    return res.status(400).json({ error: "Missing fields" });

  const { error } = await supabase
    .from("voai_waitlist")
    .insert([{ name, email, country }]);

  if (error) return res.status(500).json({ error });

  return res.status(200).json({ ok: true });
}

