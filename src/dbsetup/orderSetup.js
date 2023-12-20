async function createOrderTable(connection) {
  try {  
      await connection.execute(`
          CREATE TABLE orders (
          buyer_id NUMBER,
          item_id NUMBER,
          quantity NUMBER(10, 2) NOT NULL,
          FOREIGN KEY (buyer_id) REFERENCES users(id),
          FOREIGN KEY (item_id) REFERENCES products(id)
          )
      `);

      // Insert a row into the orders table
      await connection.execute(`
        INSERT INTO orders (buyer_id, item_id, quantity)
        VALUES (1, 2, 1)
      `,[], { autoCommit: true });
      console.log('Order inserted successfully');

      console.log('Order table created successfully');
      console.log("---------------")
  } catch (err) {
    console.error('Error occurred:', err);
  }
}
  
export default createOrderTable;
  