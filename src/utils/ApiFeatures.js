const { escape, escapeId } = require("mysql2");

class ApiFeatures {
	constructor(options) {
		this.options = options || {};
	}

	query() {
		let query = " ";

		const filterList = [];

		if (this.filterQuery) {
			filterList.push(this.filterQuery);
		}

		if (this.searchQuery) {
			filterList.push(this.searchQuery);
		}

		if (filterList.length !== 0) {
			query += `AND ${filterList.join(" AND ")}`;
		}

		query += this.sortQuery || "";
		query += this.paginationQuery || "";

		console.log(query);

		return query;
	}

	filter(filterFields) {
		if (filterFields.length == 0) return this;

		const { sort, search, page, limit, ...filterOptions } = this.options;

		const filterList = Object.keys(filterOptions).map((key) => {
			if (filterFields.includes(key)) {
				return `${key} = ${escape(filterOptions[key])}`;
			}
		});

		if (filterList.length !== 0) {
			this.filterQuery = filterList.join(" AND ");
		}

		return this;
	}

	search(searchFields) {
		if (!this.options.search) return this;

		const searchQueryList = searchFields.map((el) => {
			return `${el} LIKE ${escape(`%${this.options.search}%`)}`;
		});

		if (searchQueryList.length !== 0) {
			this.searchQuery = `(${searchQueryList.join(" OR ")})`;
		}

		return this;
	}

	sort(sortFields) {
		if (sortFields.length == 0) return this;

		let sort = this.options.sort;
		if (!sortFields.includes(sort)) {
			sort = sortFields[0];
		}

		this.sortQuery = ` ORDER BY ${escapeId(sort)} `;

		return this;
	}

	pagination() {
		this.page = +this.options.page;
		if (!this.page) return this;

		this.limit = +this.options.limit || 100;

		this.paginationQuery = ` LIMIT ${escape(this.limit)} OFFSET ${escape(
			(this.page - 1) * this.limit
		)}`;

		return this;
	}
}

module.exports = ApiFeatures;
