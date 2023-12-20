// controllers/productController.js

// Import oracledb
import oracledb from 'oracledb';
import { connAttrs } from '../server.js';

const productController = {

    getProductById: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 
    
            // Get the product id from the request
            const productId = req.query.id;
    
            // Query to get the product by id
            const result = await connection.execute(`
                SELECT * FROM products 
                WHERE id = :id
            `, { id: productId });
    
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
    
    // Get products with filter
    getProducts: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 
    
            const keyword = req.query.keyword || '';
            const category = req.query.categories || '';
            const brand = req.query.brand || '';
            const rating = req.query.rating || 0.0;
            const minPrice = req.query.minPrice || 0;
            const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;
    
            // Query and log the products
            const result = await connection.execute(`
                SELECT * FROM (
                    SELECT * FROM products 
                    WHERE 
                        LOWER(name) LIKE :keyword 
                        AND LOWER(categories) LIKE :category 
                        AND LOWER(brand) like :brand
                        AND rating >= :rating
                ) WHERE price BETWEEN :minPrice AND :maxPrice
            `, { 
                keyword: `%${keyword.toLowerCase()}%`, 
                category: `%${category.toLowerCase()}%`, 
                brand: `%${brand.toLowerCase()}%`,
                rating,
                minPrice,
                maxPrice
            });
    
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
    
    // Get the maximum price of all products
    getMaxPrice: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 

            // Query and log the maximum price
            const result = await connection.execute(`
                SELECT MAX(price) as max_price 
                FROM products
            `);

            res.status(200).json(result.rows[0]);
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

    // Get the minimum price of all products
    getMinPrice: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 

            // Query and log the minimum price
            const result = await connection.execute(`
                SELECT MIN(price) as min_price 
                FROM products
            `);

            res.status(200).json(result.rows[0]);
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

    // Get all product categories
    getProductTags: async (req, res) => {
        let connection;
        try {
            let pool = oracledb.getPool(connAttrs.poolAlias); 
            if (!pool) { 
                await oracledb.createPool(connAttrs); 
            }
            connection = await oracledb.getConnection({user: connAttrs.user, password: connAttrs.password, connectString: connAttrs.connectString, privilege: oracledb.SYSDBA}); 

            const tag = req.query.tag;

            // Query to get all product categories
            const result = await connection.execute(`
                SELECT DISTINCT ${tag} 
                FROM products
            `);

            res.status(200).json(result.rows.map(row => row[0]));
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

export default productController;
