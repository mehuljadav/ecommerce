castErrorHandler = (err, res) => {
   return res.status(err.statusCode).json({
      status: err.status,
      message: `Invalid ID: ${err.value}`,
   });
};
duplicatekeyErrorHandler = (err, res) => {
   return res.status(err.statusCode).json({
      status: err.status,
      message: `Duplicate Value for : ${Object.entries(err.keyValue)}`,
   });
};
validationErrorHandler = (err, res) => {
   return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
};

const sendErrorDev = (err, req, res) => {
   // A) API
   if (req.originalUrl.startsWith('/api')) {
      return res.status(err.statusCode).json({
         status: err.status,
         error: err,
         message: err.message,
         stack: err.stack,
      });
   }

   // B) RENDERED WEBSITE
   console.error('ERROR', err);
   return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
   });
};

const sendErrorProd = (err, req, res) => {
   // A) API
   if (req.originalUrl.startsWith('/api')) {
      // A) Operational, trusted error: send message to client
      if (err.isOperational) {
         return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
         });
      }
      // B) Programming or other unknown error
      console.error('ERROR', err);
      return res.status(500).json({
         status: 'error',
         message: 'Something went very wrong!',
      });
   }
};

module.exports = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, req, res);
   } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;

      if (err.name === 'CastError') castErrorHandler(err, res);
      if (err.name === 'ValidationError') validationErrorHandler(err, res);
      if (err.code === 11000) duplicatekeyErrorHandler(err, res);
      else sendErrorProd(error, req, res);
   }
};
