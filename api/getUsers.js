import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("voai_waitlist")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ error });

  if (req.query.csv) {
    const csv = [
      ["name","email","country","joined_at"],
      ...data.map(r => [r.name, r.email, r.country, r.joined_at])
    ].map(r => r.join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=waitlist.csv");
    return res.send(csv);
  }

  return res.json(data);
}
