const mongoose = require('mongoose');
const app = require('./app');

// UncaughtException Error
process.on('uncaughtException', (err) => {
   console.log(`Error: ${err.message}`);
   process.exit(1);
});

mongoose
   .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('Database Connected Successfully...');
   })
   .catch((error) => {
      console.log(error.message);
   });

const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log(`Server is running on PORT ${PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
   console.log(`Error: ${err.message}`);
   server.close(() => {
      process.exit(1);
   });
});
