export function required(req, res, next) {
  const userId = req.session.userId;
  if (!userId) {
    console.log("Access blocked:no userId is found ");
    return res.status(401).json({ error: `Unauthorized` });
  } else {
    next();
  }
}
