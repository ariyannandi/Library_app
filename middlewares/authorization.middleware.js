const authorize = (permittedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized: User not authenticated");
    }

    const role = req.user.role;
    if (permittedRoles.includes(role)) {
      next();
    } else {
      return res.status(403).send(`user is not authorize for this`);
    }
  };
};

module.exports = authorize;
