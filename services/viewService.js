const View = require('../models/View'); 

exports.setView = async (req, res) => {
  const {userId,videoId} = req.params;
  const view = true;
  try {
    const v = await View.create({ view, userId, videoId});
    res.json(v);
  } catch (error) {
    res.status(500).json({ error: 'Error create view' });
  }
};

exports.getViewsByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const views = await View.findAll({ where: { userId } });
    res.json(views);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching views' });
  }
};
