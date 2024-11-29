import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { decrypt } from '@/lib/auth';

export async function POST(request) {
    try {
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)

        const formData = await request.formData()
        const vehicleType = formData.get("vehicleType");
        const title = formData.get("title");
        const description = formData.get("description");
        const model = formData.get("model");
        const price = formData.get("price");
        const location = formData.get("location");
        const year = formData.get("year");
        const km = formData.get("km");
        const brand = formData.get("brand");
        const transmission = formData.get("transmission").toLowerCase();
        const fuelType = formData.get("fuelType").toLowerCase();
        const adID = uuidv4();
        const vehicleID = uuidv4();
        //TODO get user ID from session
        const userID = account_id
        //TODO get image from form data
        //const report = formData.get("report");
        //const image = formData.get("image");
        let res;

        switch (vehicleType) {
            case "car":
                const seatCount = formData.get("seatCount");
                const bodyType = formData.get("bodyType");
                // Begin transaction
                await query('BEGIN');

                // Insert into Vehicle table
                await query(
                    `INSERT INTO Vehicle(vehicle_ID, brand, model, year, km, gear_type, fuel_type)
                    VALUES ($1, $2, $3, $4, $5, $6::gear_type, $7::fuel_type);`,
                    [vehicleID, brand, model, year, km, transmission, fuelType]
                );

                await query(
                    `INSERT INTO Ad (ad_ID,vehicle_ID, user_ID, title, description, price, location)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [adID, vehicleID, userID, title, description, price, location]
                );

                // Insert into Car table
                await query(
                    `INSERT INTO Car(vehicle_ID, seat_count, body_type)
                    VALUES ($1, $2, $3);`,
                    [vehicleID, seatCount, bodyType]
                );

                // Commit transaction
                res = await query('COMMIT');
                console.log('Transaction committed successfully.');
                break;
            case "motorcycle":
                const engineCapacity = formData.get("engineCapacity");
                const cylinderCount = formData.get("cylinderCount");
                // Begin transaction
                await query('BEGIN');

                // Insert into Vehicle table
                await query(
                    `INSERT INTO Vehicle(vehicle_ID, brand, model, year, km, gear_type, fuel_type)
                    VALUES ($1, $2, $3, $4, $5, $6::gear_type, $7::fuel_type);`,
                    [vehicleID, brand, model, year, km, transmission, fuelType]
                );

                await query(
                    `INSERT INTO Ad (ad_ID,vehicle_ID, user_ID, title, description, price, location)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [adID, vehicleID, userID, title, description, price, location]
                );

                // Insert into Car table
                await query(
                    `INSERT INTO Motorcycle(vehicle_ID, engine_capacity, cylinder_count)
                    VALUES ($1, $2, $3);`,
                    [vehicleID, engineCapacity, cylinderCount]
                );

                // Commit transaction
                res = await query('COMMIT');
                console.log('Transaction committed successfully.');
                break;
            case "truck":
                const loadCapacity = formData.get("loadCapacity");
                const tractionType = formData.get("tractionType");
                // Begin transaction
                await query('BEGIN');

                // Insert into Vehicle table
                await query(
                    `INSERT INTO Vehicle(vehicle_ID, brand, model, year, km, gear_type, fuel_type)
                    VALUES ($1, $2, $3, $4, $5, $6::gear_type, $7::fuel_type);`,
                    [vehicleID, brand, model, year, km, transmission, fuelType]
                );

                await query(
                    `INSERT INTO Ad (ad_ID,vehicle_ID, user_ID, title, description, price, location)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [adID, vehicleID, userID, title, description, price, location]
                );

                // Insert into Car table
                await query(
                    `INSERT INTO Truck(vehicle_ID, load_capacity, traction_type)
                    VALUES ($1, $2, $3);`,
                    [vehicleID, loadCapacity, tractionType]
                );

                // Commit transaction
                res = await query('COMMIT');
                console.log('Transaction committed successfully.');
                break;
            case "van":
                const roofHeight = formData.get("roofHeight");
                const bedCapacity = formData.get("bedCapacity");
                // Begin transaction
                await query('BEGIN');

                // Insert into Vehicle table
                await query(
                    `INSERT INTO Vehicle(vehicle_ID, brand, model, year, km, gear_type, fuel_type)
                    VALUES ($1, $2, $3, $4, $5, $6::gear_type, $7::fuel_type);`,
                    [vehicleID, brand, model, year, km, transmission, fuelType]
                );

                await query(
                    `INSERT INTO Ad (ad_ID,vehicle_ID, user_ID, title, description, price, location)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [adID, vehicleID, userID, title, description, price, location]
                );

                // Insert into Car table
                await query(
                    `INSERT INTO Van(vehicle_ID, roof_height, bed_capacity)
                    VALUES ($1, $2, $3);`,
                    [vehicleID, roofHeight, bedCapacity]
                );

                // Commit transaction
                res = await query('COMMIT');
                console.log('Transaction committed successfully.');
                break;
            default:
                break;
        }
        if (res.rowCount === 0) {
            return NextResponse.json({ error: 'Failed to add ad!' }, { status: 400 })
        }
        return NextResponse.json({ msg: 'Ad added!' }, { status: 200 })
    } catch (err) {
        console.log(err);
        query('ROLLBACK');
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}