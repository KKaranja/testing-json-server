module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', [
    'http://localhost:3000',
    'https://dashboard-kga2.onrender.com',
  ]);
  next();
};
