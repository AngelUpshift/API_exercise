const restrict = (role) => {
  return (req, res, next) => {
    if (req.body.role !== role) {
      return res.status(403).json({ message: "You are not allowed to delete" });
    }
    next();
  };
};

module.exports = restrict;
