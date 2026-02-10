import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { exec } from "child_process";

const app = express();
const port = 3001;
const outDir = path.join(process.cwd(), "recordings");

app.use(cors());
app.use(express.raw({ type: "image/png", limit: "50mb" }));

// Ensure folder exists on startup without deleting anything yet
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

app.post("/save-frame", (req, res) => {
  const frameNum = req.query.frame;
  const fileName = `frame_${String(frameNum).padStart(4, "0")}.png`;

  // ensure directory exists
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  fs.writeFileSync(path.join(outDir, fileName), req.body);
  res.send("Saved");
});

app.post("/finish", (req, res) => {
  console.log("🎬 All frames received. Starting FFmpeg...");
  const outputName = `fractal_${Date.now()}.mp4`;

  const inputPattern = path.join("recordings", "frame_%04d.png");
  const cmd = `ffmpeg -framerate 60 -i ${inputPattern} -c:v libx264 -crf 15 -pix_fmt yuv420p ${outputName}`;

  exec(cmd, (err) => {
    if (err) {
      console.error("❌ FFmpeg Error:", err);
      return res.status(500).send(err);
    }

    console.log(`✅ Video Ready: ${outputName}`);

    console.log("🧹 Rendering finished. Cleaning up frames...");
    try {
      fs.rmSync(outDir, { recursive: true, force: true });
      fs.mkdirSync(outDir);
      console.log("✨ Recordings folder is now empty.");
    } catch (cleanupErr) {
      console.error("⚠️ Cleanup failed, but video is safe:", cleanupErr);
    }

    res.send({ video: outputName });
  });
});

app.listen(port, () =>
  console.log(`🚀 Pro Server at http://localhost:${port}`),
);
