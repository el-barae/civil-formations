const View = require('../models/View'); 
const Subscribe = require('../models/Subscribe'); 

exports.setView = async (req, res) => {
  const { userId, videoId } = req.params; 
  const { pourcentage, idFormation } = req.body;
  const view = true;

  try {
    // 1️⃣ Créer la vue
    const v = await View.create({ view, userId, videoId });

    // 2️⃣ Vérifier si l'utilisateur est déjà abonné à la formation
    let subscribe = await Subscribe.findOne({
      where: { userId, formationId: idFormation },
    });

    if (subscribe) {
        let p = pourcentage + subscribe.pourcentage;
        if(p>100){
          p = 100;
        }
        subscribe.pourcentage = p;
        await subscribe.save();
    } 

    // 5️⃣ Retourner la réponse
    res.json({
      message: 'Vue enregistrée et progression mise à jour avec succès',
      view: v,
      subscribe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la vue ou de la mise à jour du pourcentage' });
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
