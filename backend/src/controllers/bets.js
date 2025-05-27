const playDice = require('../services/dice');
const { Bet, User } = require('../models');

exports.placeBet = async (req, res) => {
  const { game, amount } = req.body;
  let result = {};
  if (game === 'dice') result = playDice(amount);
  const bet = await Bet.create({
    user_id: req.user.id,
    game,
    amount,
    payout: result.payout,
    result,
  });
  await User.increment({ balance: result.payout - amount }, { where: { id: req.user.id } });
  req.io.to(req.user.id).emit('bet_result', { bet, result });
  res.json({ bet, result });
};
