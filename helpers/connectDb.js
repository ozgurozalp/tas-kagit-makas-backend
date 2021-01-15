import mongoose from 'mongoose';

const DATABASE_NAME = 'tasKagitMakasApp';
const DATABASE_USER = 'root';
const DATABASE_PASS = 'FRSPI6Nd123';
const CONNECTION_STRING = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASS}@taskagitmakas.lpj0s.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
