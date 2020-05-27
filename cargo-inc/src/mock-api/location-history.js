

const moment = require('moment');

const allStatusCodes = ['A', 'IT', 'AD', 'D'];
const allStatuses = {
  A: 'accepted',
  IT: 'in_transit',
  AD: 'delivery_attempted',
  D: 'delivered',
};
const allPackageCodes = ['PAK', 'PAL'];

/**
 * This is a mock implementation of a carrier"s API that returns the location history of a shipment
 */
function locationHistory(request) {
  const statusCode = allStatusCodes[Math.floor(Math.random() * allStatusCodes.length)];
  const status = allStatuses[statusCode];

  return {
    delivery_date: moment().format(),
    packages: [
      {
        package_code: allPackageCodes[Math.floor(Math.random() * allPackageCodes.length)],
        description: 'Large square box',
        length: 4,
        width: 4,
        height: 4,
        dim_unit: 'in',
        weight: 4,
        weight_unit: 'lb',
      },
    ],
    tracking_events: [
      {
        description: 'Received at facility,',
        date: moment().format(),
        status,
        errors: [],
        status_code: statusCode,
        address_line_1: '4009 Marathon Blvd.',
        address_line_2: '',
        city: 'Austin',
        state: 'TX',
        zip: '78756',
        country: 'US',
        address_type: 'residential',
        latitude: 30.308740,
        longitude: -97.741750,
        company_name: 'ShipEngine',
      },
    ],
    signedBy: {
      salutation: 'Mr.',
      first_name: 'Ship',
      middle_name: '',
      last_name: 'Engine',
      suffix: '',
    },
    notes: 'This package was tracked successfully',
  };
}

module.exports = locationHistory;
