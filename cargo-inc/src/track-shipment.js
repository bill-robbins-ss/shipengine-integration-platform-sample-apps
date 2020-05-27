const apiClient = require('./mock-api/client');
const codeIdMap = require('./code-id-map');

async function trackShipment(transaction, trackingCriteria) {
	// STEP 1: Validation


	// STEP 2: Create the data that the carrier"s API expects

	const { trackingNumber, returns } = trackingCriteria;

	const data = {
		operation: 'location_history',
		trackingNumber,
		isReturn: returns.isReturn,
	};

	// STEP 3: Call the carrier"s API
	const response = await apiClient.request({ data });

	// STEP 4: Create the output data that ShipEngine expects
	return await formatTrackingResponse(response.data);
}

/**
 * Formats a shipment in the way ShipEngine expects
 */
async function formatTrackingResponse(response) {
	return {
		deliveryDateTime: response.delivery_date,
		packages: [
			{
				packaging: {
					id: codeIdMap[response.packages[0].package_code],
				},
				dimensions: {
					length: response.packages[0].length,
					width: response.packages[0].width,
					height: response.packages[0].height,
					unit: response.packages[0].dim_unit,
				},
				weight: {
					value: response.packages[0].weight,
					unit: response.packages[0].weight_unit,
				},
			},
		],
		events: [
			{
				name: response.tracking_events[0].description,
				dateTime: response.tracking_events[0].date,
				status: response.tracking_events[0].status,
				isError: (response.tracking_events[0].length != 0),
				code: response.tracking_events[0].status_code,
				description: response.tracking_events[0].description,
				address: {
					company: response.tracking_events[0].company_name,
					addressLines: [response.tracking_events[0].address_line_1, response.tracking_events[0].address_line_1],
					cityLocality: response.tracking_events[0].city,
					stateProvince: response.tracking_events[0].state,
					postalCode: response.tracking_events[0].zip,
					country: response.tracking_events[0].country,
					timeZone: '+05:30',
					isResidential: (response.tracking_events[0].address_type == 'residential'),
					coordinates: {
						latitude: response.tracking_events[0].latitude,
						longitude: response.tracking_events[0].longitude,
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
		],
	};
}

module.exports = trackShipment;
