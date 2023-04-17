const app = require('./app');

app.listen(process.env.PORT, () => {
      console.log('Server Started on:', process.env.PORT);
});
