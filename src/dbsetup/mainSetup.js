import createUserTable from './userSetup.js';
import createProductTable from './productSetup.js';
import createOrderTable from './orderSetup.js';
import dropAllTables from './reset.js';

async function mainSetup(connection) {
    await dropAllTables(connection)
    /* create user account table  */
    await createUserTable(connection);
    /* create product table  */
    await createProductTable(connection);
    /* create order table  */
    await createOrderTable(connection);
}

export default mainSetup
