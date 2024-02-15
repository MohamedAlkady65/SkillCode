module.exports = (obj) => {
	if (obj.whatsapp_phone) {
		obj.whatsapp = `https://api.whatsapp.com/send?phone=${obj.whatsapp_phone.replace(
			/\D/g,
			""
		)}`;
		delete obj.whatsapp_phone;
	}
};
