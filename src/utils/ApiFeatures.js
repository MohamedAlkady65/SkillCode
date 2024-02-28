const { escape, escapeId } = require("mysql2");

class ApiFeatures {
	constructor(options, replaceKeysObject) {
		this.options = options || {};
		this.replaceKeysObject = replaceKeysObject || {};
	}

	replaceKey(key) {
		const prefix = this.replaceKeysObject[key];
		if (prefix) {
			return `${prefix}.${key}`;
		}
		return key;
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

		const queryForCount = query;

		query += this.sortQuery || "";
		query += this.paginationQuery || "";

		return [query, queryForCount];
	}

	filter(filterFields) {
		if (filterFields.length == 0) return this;

		const { sort, search, page, limit, ...filterOptions } = this.options;

		const filterList = Object.keys(filterOptions).map((key) => {
			if (filterFields.includes(key)) {
				return `${this.replaceKey(key)} = ${escape(
					filterOptions[key]
				)}`;
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
			return `${this.replaceKey(el)} LIKE ${escape(
				`%${this.options.search}%`
			)}`;
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

		this.sortQuery = ` ORDER BY ${escapeId(this.replaceKey(sort))} `;

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
