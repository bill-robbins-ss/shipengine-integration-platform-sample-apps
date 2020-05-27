const data = [
	{
		status: 'success',
		code: 'AC',
		description: 'cancellation is complete.',
		notes: '',
	},
	{
		status: 'error',
		code: 'FA',
		description: 'cancellation failed.',
		notes: 'Please call ###-###-### to cancel.',
	},
];

/**
 * This is a mock implementation of a carrier"s API that voids one or more labels
 */
function voidLabels(request) {
	return {
		cancelledShipments: request.cancellations.map((cancellation) => {
			const { cancellationID } = cancellation;
			const {
				status, code, description, notes,
			} = data[Math.floor(Math.random() * data.length)];

			return {
				id: cancellationID,
				cancellation_status: status,
				cancellation_code: code,
				cancellation_description: description,
				cancellation_notes: notes,
				cancellation_confirmation: Buffer.from(new Date().toISOString()).toString('base64'),
			};
		}),
	};
}

module.exports = voidLabels;
