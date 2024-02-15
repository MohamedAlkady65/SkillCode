module.exports = async (fn) => {
	const d1 = Date.now();
	const res = await fn();
	console.log(Date.now() - d1);
	return res;
};
