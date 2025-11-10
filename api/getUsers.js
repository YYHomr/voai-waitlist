const { createClient } = require("@supabase/supabase-js");

module.exports = async function (req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const csvRequested = req.url.includes("csv=1");

    const { data, error } = await supabase
      .from("voai_waitlist")
      .select("*")
      .order("id", { ascending: false });

    if (error) return res.status(500).json({ error });

    if (csvRequested) {
      const csv = [
        ["name","email","country","joined_at"],
        ...data.map(r => [r.name, r.email, r.country, r.joined_at])
      ].map(r => r.join(",")).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=waitlist.csv");
      return res.send(csv);
    }

    return res.json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server failed." });
  }
};
