// Error handling middleware for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
      return res.status(400).json({ message: "Invalid JSON format" });
    }
    next(err);
  });
  