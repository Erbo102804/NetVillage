const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Get all tariffs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tariffs')
      .select('*')
      .order('price');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tariff by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tariffs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
