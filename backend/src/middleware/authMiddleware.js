/////////////////////////////////
// ===== AUTH MIDDLEWARE ===== //
/////////////////////////////////

// This middleware ensures that certain routes are accessible
// only to authenticated users and verifies resource ownership

// ===== requireAuth Middleware ===== //
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// ===== requireOwnership Middleware ===== //
const requireOwnership = (req, res, next) => {
  const sessionUserId = req.session?.user?.id;
  const targetUserId = req.params.userId;

  if (!sessionUserId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (sessionUserId !== targetUserId) {
    return res.status(403).json({ message: 'Forbidden: You can only access your own resources' });
  }

  next();
};

// ===== requireOwnershipOrAdmin Middleware ===== //
// Allows access if user owns the resource OR is an admin
const requireOwnershipOrAdmin = (req, res, next) => {
  const sessionUser = req.session?.user;
  const targetUserId = req.params.userId;

  if (!sessionUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Allow if user is admin OR owns the resource
  if (sessionUser.role === 'admin' || sessionUser.id === targetUserId) {
    return next();
  }

  return res.status(403).json({ message: 'Forbidden: You can only access your own resources' });
};

module.exports = {
  requireAuth,
  requireOwnership,
  requireOwnershipOrAdmin
};
