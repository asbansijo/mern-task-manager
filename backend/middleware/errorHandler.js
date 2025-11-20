module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  res.status(500).json({ message: 'Server Error' });
};
