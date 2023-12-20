// controllers/userController.js

// Import oracledb
import oracledb from 'oracledb';
import { connAttrs } from '../server.js';

const userController = {
  // Get all users
    getAllUsers: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 
            // Query and log the user that has just been added
            const result = await connection.execute(`
                SELECT * FROM users
            `);           
            res.status(200).json(result.rows);
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
    // Login
    login: async (req, res) => {
        let connection;
        try {
        let pool = oracledb.getPool(connAttrs.poolAlias); 
        if (!pool) { 
            await oracledb.createPool(connAttrs); 
        }
        connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA});

        const { username, password } = req.body;

        const result = await connection.execute(
            `SELECT COUNT(*) FROM users WHERE username = :username AND password = :password`,
            { username, password }
        );
        
        res.status(200).json(result.rows[0] > 0);
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

};

export default userController
