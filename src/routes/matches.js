import { Router } from 'express';
import Match from '../models/Match.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();

// List all matches
router.get('/', async (_req, res) => {
  const list = await Match.find().sort({ date: 1, startTime: 1 });
  res.json(list);
});

// Get single match
router.get('/:id', async (req, res) => {
  const m = await Match.findById(req.params.id);
  if (!m) return res.status(404).json({ message: 'Not found' });
  res.json(m);
});

// Create
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const created = await Match.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Update
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  const deleted = await Match.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

// Set a specific match as LIVE (demote any other live matches)
router.post('/:id/live', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  // Demote other live matches to scheduled (keep their date)
  await Match.updateMany({ _id: { $ne: id }, status: 'live' }, { $set: { status: 'scheduled' } });
  const updated = await Match.findByIdAndUpdate(id, { $set: { status: 'live' } }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

export default router;
