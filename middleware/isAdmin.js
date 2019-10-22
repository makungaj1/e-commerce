module.exports = function(req, res, next) {
	// 401 Unauthorized
	// 403 Forbidden

	const { isAdmin } = req.employee;
	if (!isAdmin) return res.status(403).json('Access denied');

	next();
};
