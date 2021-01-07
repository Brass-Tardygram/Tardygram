module.exports = (req, res, next) => {
  const token = req.cookies.session;
  console.log(token);
  next();
};
