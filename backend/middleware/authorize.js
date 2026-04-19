export const requireRoles = (...allowedRoles) => {
  const roleSet = new Set(allowedRoles);

  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !roleSet.has(role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied for your role",
      });
    }

    next();
  };
};
