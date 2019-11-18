const [, token] = authHeader.split(' ');

try {
  const decoded = await promisify(jwt.verify)(token, authConfig.secret);
  req.userId = decoded.id;
  return next();
} catch (error) {
  return res.status(401).json({error: 'token invalid'});
};
};
