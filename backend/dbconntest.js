const oracledb = require('oracledb');

const dbConfig = {
  user: 'demonode',
  password: '123',
  connectString: 'localhost/xepdb1', // Replace with your Oracle Database connection string
  poolMax: 10,
  poolMin: 10,
};

async function run() {
  let connection;

  try {
    // Establish a connection to the Oracle Database
    connection = await oracledb.createPool(dbConfig);
    console.log(connection);

    // Your database operations go here

  } catch (error) {
    console.error('Error connecting to Oracle Database:', error.message);
  } finally {
    // Close the connection
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing the connection:', error.message);
      }
    }
  }
}

// Run the connection function
run();
