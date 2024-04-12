const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = require('./app');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection succesfull'))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server is live on ${process.env.PORT} port`);
});
