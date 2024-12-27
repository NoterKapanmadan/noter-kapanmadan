const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { parse } = require("csv-parse");

const INITIAL_YEAR = 1992;
const FINAL_YEAR = 2024;

const setupVehicleData = async () => {
    const client = new Client({
        user: process.env.DB_USERNAME,
        host: process.env.DB_ENDPOINT,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    try {
        await client.connect();
        console.log('Connected to the database.');



        
        for (let year = INITIAL_YEAR; year <= FINAL_YEAR; year++) {
            
            const models = []

            await new Promise((resolve, reject) => { 
                
                fs.createReadStream(`../vehicle-data/${year}.csv`)
                .pipe(parse({ delimiter: ",", from_line: 2 }))
                .on("data", function (row) {
                    if(row[1] && row[2]) {
                        models.push([row[1], row[2]]);
                    }
                })
                .on("end", async function () {
                    console.log(`Vehicle data for year ${year} migration has been started.`);
                    await client.query('BEGIN');
                    const queryText = `INSERT INTO VehicleModel (brand, model) 
                    VALUES ${models.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')}
                    ON CONFLICT (brand, model) DO NOTHING;
                    ;`;
                    const queryValues = models.flat();
                    // console.log(queryText, queryValues.length);
                    await client.query(queryText, queryValues);
                    await client.query('COMMIT');
                    console.log(`Vehicle data for year ${year} has migrated.`);
                    resolve();
                })
                .on("error", async function (err) {
                    console.error('Error during vehicle data migration:', err);
                    await client.query('ROLLBACK');
                    reject(err);
                });

        });

    }


    } catch (err) {
        console.error('Error during vehicle data migration:', err);
        await client.query('ROLLBACK');
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }


}

module.exports = setupVehicleData;
