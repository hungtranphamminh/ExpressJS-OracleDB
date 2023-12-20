// controllers/orderController.js

// Import oracledb
import oracledb from 'oracledb';
import { connAttrs } from '../server.js';

const orderController = {
    
    // Get order info for a user
    getOrderInfo: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 

            const userId = req.query.userId;
            console.log("user id is: ", req.params)
            // Query and log the order info
            const result = await connection.execute(`
                SELECT o.item_id, o.buyer_id, p.id, p.name, p.price, o.quantity, p.images
                FROM orders o
                JOIN products p ON o.item_id = p.id
                WHERE o.buyer_id = :userId
            `, { userId });

            console.log("result is: ", result)

            res.status(200).json(result.rows.map(row => {
                let obj = {};
                result.metaData.forEach((item, index) => {
                    obj[item.name] = row[index];
                });
                return obj;
            }));
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    // Update order quantity
    updateOrderQuantity: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 

            const { userId, productId, newQuantity } = req.query;

            // Update the order quantity
            await connection.execute(`
                UPDATE orders
                SET quantity = :newQuantity
                WHERE buyer_id = :userId AND item_id = :productId
            `, { userId, productId, newQuantity }, { autoCommit: true });

            res.status(200).json({ message: 'Order quantity updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    // Delete an order
    deleteOrder: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 

            const { buyer_id, item_id} = req.query;

            // Query to delete the order
            const result = await connection.execute(`
                DELETE FROM orders 
                WHERE buyer_id = :buyer_id AND item_id = :item_id
            `, { buyer_id: buyer_id, item_id: item_id}, { autoCommit: true });

            res.status(200).json({ message: 'Order deleted successfully.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    // Insert an order
    makeOrder: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 

            const {buyer_id, item_id, quantity} = req.body;

            console.log("req body is: ", req.body)

            // Query to insert the order
            const result = await connection.execute(`
                INSERT INTO orders (buyer_id, item_id, quantity) 
                VALUES (:buyer_id, :item_id, :quantity)
            `, 
            { buyer_id: buyer_id, item_id: item_id, quantity: quantity }, 
            { autoCommit: true });

            res.status(200).json({ message: 'Order inserted successfully.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    },
    // count all order
    getOrderCount: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 
    
            const userId = req.query.userId;
            // Query and log the order count
            const result = await connection.execute(`
                SELECT COUNT(*)
                FROM orders
                WHERE buyer_id = :userId
            `, { userId });
    
            console.log("result is: ", result)
    
            res.status(200).json({ orderCount: result.rows[0][0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
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
};

export default orderController;
