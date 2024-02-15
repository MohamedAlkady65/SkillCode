const validationOptions = {
	abortEarly: false,
	stripUnknown: true,
	// allowUnknown :true,
	errors: {
		wrap: {
			label: false,
			array: false,
			string: false,
		},
	},
};

module.exports = validationOptions