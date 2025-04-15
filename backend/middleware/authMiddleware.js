import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
