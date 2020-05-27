

const allServices = {
	ECO: { price: 0.27, days: 5 },
	STD: { price: 0.60, days: 3 },
	ON: { price: 1.40, days: 1 },
};

const allConfirmations = {
	SIG: { price: 1.25 },
	'SIG-A': { price: 2.5 },
	'SIG-R': { price: 2.99 },
};


/**
 * This is a mock implementation of a carrier's API that returns rate quotes for a shipment
 */
function quoteRates(request) {
	const services = request.service_codes.length > 0 ? request.service_codes : Object.keys(allServices);
	const confirmations = request.confirmation_codes.length > 0 ? request.confirmation_codes : Object.keys(allConfirmations);
	const packaging = request.parcel_codes.length > 0 ? request.parcel_codes : ['PAK', 'PAL'];
	const totalWeight = request.total_weight;
	const shipDate = new Date(request.ship_date);
	const rates = [];

	for (const service_code of services) {
		for (const confirmation_code of confirmations) {
			for (const parcel_code of packaging) {
				const service = allServices[service_code];
				const confirmation = allConfirmations[confirmation_code];

				rates.push({
					service_code,
					confirmation_code,
					parcel_code,
					ship_date: shipDate.toISOString(),
					delivery_date: new Date(shipDate.setDate(shipDate.getDate() + service.days)).toISOString(),
					delivery_days: service.days,
					shipment_cost: service.price * totalWeight,
					confirmation_cost: confirmation.price,
					tax_cost: service.price * totalWeight * 0.08,
				});
			}
		}
	}

	return rates;
}

module.exports = quoteRates;
