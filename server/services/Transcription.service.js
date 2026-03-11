import fs from "fs";
import { AssemblyAI } from "assemblyai";

export const transcribeAudio = async (filePath) => {
  const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
  const audioFile = fs.createReadStream(filePath);

  const transcript = await client.transcripts.transcribe({
    audio: audioFile,
    speech_models: ["universal-2"],
    speaker_labels: true,
  });

  if (transcript.status === "error") {
    throw new Error(`Transcription failed: ${transcript.error}`);
  }

  const rawText = transcript.text || "";

  let lines = [];
  if (transcript.utterances && transcript.utterances.length > 0) {
    lines = transcript.utterances.map((u) => ({
      speaker: `Speaker ${u.speaker}`,
      time: formatMs(u.start),
      text: u.text,
    }));
  } else {
    lines = [{ speaker: "Speaker", time: "0:00", text: rawText }];
  }

  return { rawText, lines };
};

function formatMs(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
