function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Uploaded file is too large' });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
