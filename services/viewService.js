const View = require('../models/View'); 

exports.getViewsByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const views = await View.findAll({ where: { userId } });
    res.json(views);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching views' });
  }
};
