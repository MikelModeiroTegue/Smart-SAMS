// updateOrCreateVenueGeolocations.js
require("dotenv").config({ path: "../../.env" });
// require('dotenv').config({ path: '/home/modeiro/Smart-SAMS/backend/.env' }); // Explicitly load .env
const { sequelize } = require('../config/db');
const { Venue } = require('../models/model'); // Adjust path to your models file


(async () => {
    try {
        // Sync the database (create tables if they don't exist)
        await sequelize.sync({ force: false }); // Set to true to drop and recreate tables (use cautiously)

        // Define the geolocations as an array of [longitude, latitude] pairs
        const geolocations = [
          [9.288848, 4.14303],
          [9.288842, 4.14311],
          [9.28849, 4.14316],
          [9.28856, 4.1431],
          [9.288848, 4.14303] // Closing the polygon by repeating the first point
        ];

        const v_name = "FET-BFF-HALL1"; // Venue name to check or create

        // Check if venue exists
        const existingVenue = await Venue.findOne({ where: { v_name } });

        if (existingVenue) {
            // Update existing venue
            await existingVenue.update({ geolocations });
            console.log(`Venue '${v_name}' updated successfully with new geolocations:`, {
                v_name: existingVenue.v_name,
                geolocations: existingVenue.geolocations // Shows decrypted array after update
            });
        } else {
            // Create new venue
            const newVenue = await Venue.create({ v_name, geolocations });
            console.log(`Venue '${v_name}' created successfully:`, {
                v_name: newVenue.v_name,
                geolocations: newVenue.geolocations // Shows decrypted array
            });
        }

    } catch (error) {
        console.error('Error processing venue:', error.message);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
})();