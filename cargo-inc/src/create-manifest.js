const apiClient = require('./mock-api/client');

async function createManifest(transaction, manifest) {
  // STEP 1: Validation


  // STEP 2: Create the data that the carrier"s API expects

  const data = {
    fromAddress: manifest.shipFrom,
    startDate: manifest.openDateTime,
    endDate: manifest.closeDateTime,
  };

  // STEP 3: Call the carrier"s API
  const response = await apiClient.request({ data });

  // STEP 4: Create the output data that ShipEngine expects
  return formatTrackingResponse(response.data);
}

/**
 * Formats a shipment in the way ShipEngine expects
 */
async function formatTrackingResponse(response) {
  const deliveryTzSplit = response.deliveryDate.split();
  const eventTzSplit = response.trackingEvents[0].date.split();

  return {
    deliveryDateTime: {
      value: deliveryTzSplit[0],
      timeZone: deliveryTzSplit[1],
    },
    packages: [
      {
        packaging: {
          description: response.packaging[0].description,
          requiresWeight: true,
          requiresDimensions: false,
        },
        dimensions: {
          length: response.packages[0].length,
          width: response.packages[0].width,
          height: response.packages[0].height,
          unit: response.packages[0].dimUnit,
        },
        weight: {
          value: response.packages[0].weight,
          unit: response.packages[0].weightUnit,
        },
      },
    ],
    events: [
      {
        name: response.trackingEvents[0].description,
        dateTime: {
          value: eventTzSplit[0],
          timezone: eventTzSplit[1],
          status: response.trackingEvents[0].status,
          isError: (response.trackingEvents[0].length != 0),
          code: response.trackingEvents[0].status_code,
          description: response.trackingEvents[0].description,
          address: {
            company: response.trackingEvents[0].company_name,
            addressLine1: response.trackingEvents[0].address_line_1,
            addressLine2: response.trackingEvents[0].address_line_1,
            cityLocality: response.trackingEvents[0].city,
            stateProvince: response.trackingEvents[0].state,
            postalCode: response.trackingEvents[0].zip,
            country: response.trackingEvents[0].country,
            timeZone: eventTzSplit[1],
            isResidential: (response.trackingEvents[0].address_type == 'residential'),
            coordinates: {
              latitude: response.trackingEvents[0].latitude,
              longitude: response.trackingEvents[0].longitude,
            },
          },
          signer: {
            title: response.signedBy.salutation,
            given: response.signedBy.first_name,
            middle: response.signedBy.middle_name,
            family: response.signedBy.last_name,
            suffix: response.signedBy.suffix,
          },
          notes: [
            response.notes,
          ],
        },
      },
    ],
  };
}

module.exports = createManifest;
