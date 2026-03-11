import Groq from "groq-sdk";

export const scoreTranscript = async (transcript, criteria) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const criteriaList = criteria
    .map((c, i) => `${i + 1}. ${c.label} (max ${c.weight} pts) [${c.category}]`)
    .join("\n");

  const prompt = `You are a call quality analyst. Score the following call transcript against these criteria.

CRITERIA:
${criteriaList}

TRANSCRIPT:
${transcript}

Respond ONLY with a JSON object in this exact format, no other text, no markdown:
{
  "criteriaResults": [
    {
      "label": "criterion label here",
      "category": "category here",
      "score": <number>,
      "max": <max points for this criterion>,
      "feedback": "one sentence explaining the score"
    }
  ],
  "overallFeedback": "2-3 sentence overall summary of the call quality"
}

Be strict but fair. Score each criterion from 0 to its max points based purely on what is demonstrated in the transcript.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message.content.trim();
  const clean = raw
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const parsed = JSON.parse(clean);

  const totalScore = parsed.criteriaResults.reduce(
    (s, c) => s + (c.score || 0),
    0,
  );
  const maxScore = parsed.criteriaResults.reduce((s, c) => s + (c.max || 0), 0);
  const percentage =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    criteriaResults: parsed.criteriaResults,
    overallFeedback: parsed.overallFeedback || "",
    totalScore,
    maxScore,
    percentage,
  };
};
