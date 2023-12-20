async function dropAllTables(connection) {
    try {
        const tables = ['users', 'products', 'orders'];

        for (let table of tables) {
          await connection.execute(`DROP TABLE ${table} CASCADE CONSTRAINTS`);
        }
  
        console.log(`
          ------------------
          All tables dropped
          ------------------
        `);
  
    } catch (err) {
      console.error(err);
    }
  }
  
export default dropAllTables  