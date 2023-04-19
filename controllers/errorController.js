module.exports = (err, req, res, next) => {
   return res.status(404).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
   });
};
