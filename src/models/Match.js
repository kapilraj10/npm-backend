import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short: { type: String },
  color: { type: String }
}, { _id: false });

const MatchSchema = new mongoose.Schema({
  date: { type: String, required: true }, // ISO date (YYYY-MM-DD)
  startTime: { type: String, required: true }, // HH:mm
  teams: { type: [TeamSchema], validate: v => Array.isArray(v) && v.length === 2 },
  venue: { type: String, default: '' },
  streamUrl: { type: String, default: '' },
  status: { type: String, enum: ['scheduled','soon','live','completed'], default: 'scheduled' }
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema);
