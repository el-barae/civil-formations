const Formation = require('../models/Formation'); 

exports.getFormationById = async (req, res) => {
    try {
        const formation = await Formation.findByPk(req.params.id);
        if (formation) {
            res.json(formation);
          } else {
            res.status(404).json({ error: 'Formation not found' });
          }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getFormations = async (req, res) => {
    try {
      const formations = await Formation.findAll();
      res.json(formations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.createFormation = async (req, res) => {
    try {
      const formation = await Formation.create(req.body);
      res.status(201).json(formation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.updateFormation = async (req, res) => {
    try {
      const formation = await Formation.findByPk(req.params.id);
      if (formation) {
        await formation.update(req.body);
        res.json(formation);
      } else {
        res.status(404).json({ error: 'Formation not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.DeleteFormation = async (req, res) => {
    try {
      const formation = await Formation.findByPk(req.params.id);
      if (formation) {
        await formation.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Formation not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };