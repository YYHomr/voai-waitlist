const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { name, email, country } = req.body;

    if (!name || !email || !country) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("voai_waitlist")
      .insert([{ name, email, country }])
      .select();

    if (error) {
      console.error("Insert Error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, inserted: data });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
