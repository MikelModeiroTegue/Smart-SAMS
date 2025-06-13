const { Venue } = require('../models/model');

class VenueRepository {
  async bulkUpsertVenues(venues) {
    try {
      const upsertPromises = venues.map(venue =>
        Venue.upsert({
          v_name: venue.v_name,
          geolocations: venue.geolocations || null,
        })
      );
      await Promise.all(upsertPromises);
      return { message: 'Venues processed successfully' };
    } catch (error) {
      throw new Error(`Failed to upsert venues: ${error.message}`);
    }
  }
}

module.exports = new VenueRepository();