const oracledb = require('oracledb');
async function runApp() {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: "demonode", password: "123", connectionString: "localhost/xepdb1" });
    console.log("Successfully connected to Oracle Database");

    // Create a table
    var resutl = await connection.execute(`select table_name from user_tables`);
    console.log(resutl);

    const favoriteGenre = await connection.execute(`
        SELECT NAME
        FROM (SELECT G.NAME
        FROM MOVIE M, MOVIE_GENRE MG, GENRE G, MOVIE_WATCH MW
        WHERE M.MOVIE_ID = MG.MOVIE_ID AND MG.GENRE_ID = G.GENRE_ID
                    AND MW.MOVIE_ID = M.MOVIE_ID AND MW.RATING = 10 AND MW.EMAIL = hr665102@gmail.com AND MW.PROFILE_ID = "habib"
        GROUP BY G.NAME
        ORDER BY COUNT(*) DESC)
        WHERE ROWNUM = 1
        `);

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
}
runApp();