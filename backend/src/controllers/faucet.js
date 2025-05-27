const { FaucetClaim, User } = require('../models');
const { Op } = require('sequelize');

exports.claimFaucet = async (req, res) => {
  const ip = req.ip;
  const cutoff = new Date(Date.now() - 24*60*60*1000);
  const existing = await FaucetClaim.findOne({
    where: { user_id: req.user.id, claimed_at: { [Op.gt]: cutoff } }
  });
  if (existing) return res.status(400).json({ message: 'Already claimed' });
  await FaucetClaim.create({ user_id: req.user.id, ip_address: ip });
  await User.increment({ balance: 0.00001 }, { where: { id: req.user.id } });
  const user = await User.findByPk(req.user.id);
  res.json({ success: true, balance: user.balance });
};
