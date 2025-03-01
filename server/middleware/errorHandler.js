const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      error: messages,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      error: "Duplicate field value entered",
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || "Server Error",
  });
};

export default errorHandler;
