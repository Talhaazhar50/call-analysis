import Scorecard from "../models/Scorecard.model.js";

// GET /api/scorecards
export const getScorecards = async (req, res) => {
  const scorecards = await Scorecard.find().sort({ createdAt: -1 });
  res.json(scorecards);
};

// GET /api/scorecards/:id
export const getScorecard = async (req, res) => {
  const scorecard = await Scorecard.findById(req.params.id);
  if (!scorecard)
    return res.status(404).json({ message: "Scorecard not found" });
  res.json(scorecard);
};

// POST /api/scorecards
export const createScorecard = async (req, res) => {
  const { name, description, team, active, criteria } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!criteria?.length)
    return res
      .status(400)
      .json({ message: "At least one criterion is required" });

  const scorecard = await Scorecard.create({
    name,
    description,
    team,
    active: active ?? true,
    criteria,
    createdBy: req.user._id,
  });

  res.status(201).json(scorecard);
};

// PUT /api/scorecards/:id
export const updateScorecard = async (req, res) => {
  const { name, description, team, active, criteria } = req.body;

  const scorecard = await Scorecard.findById(req.params.id);
  if (!scorecard)
    return res.status(404).json({ message: "Scorecard not found" });

  if (name !== undefined) scorecard.name = name;
  if (description !== undefined) scorecard.description = description;
  if (team !== undefined) scorecard.team = team;
  if (active !== undefined) scorecard.active = active;
  if (criteria !== undefined) scorecard.criteria = criteria;

  await scorecard.save();
  res.json(scorecard);
};

// PATCH /api/scorecards/:id/toggle
export const toggleScorecard = async (req, res) => {
  const scorecard = await Scorecard.findById(req.params.id);
  if (!scorecard)
    return res.status(404).json({ message: "Scorecard not found" });

  scorecard.active = !scorecard.active;
  await scorecard.save();
  res.json(scorecard);
};

// DELETE /api/scorecards/:id
export const deleteScorecard = async (req, res) => {
  const scorecard = await Scorecard.findByIdAndDelete(req.params.id);
  if (!scorecard)
    return res.status(404).json({ message: "Scorecard not found" });
  res.json({ message: "Scorecard deleted" });
};
