import express from 'express';
import oracledb from 'oracledb';
import bodyParser from 'body-parser';
import cors from 'cors';
import mainSetup from './dbsetup/mainSetup.js'
import router from './routes/router.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(router)

export const connAttrs = {
  user: "sys",
  password: "12345",
  connectString: "localhost:1521/xe",
  privilege: oracledb.SYSDBA,
  poolAlias: 'default'
}

// Start the server
app.listen(3000, async () => {
  console.log('Server is running on port 3000');

  // Connect to the database and setup tables
  let connection;
  try {
    await oracledb.createPool(connAttrs);
    connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); // Modify this line
    await mainSetup(connection);
    console.log('Database setup completed successfully');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});
