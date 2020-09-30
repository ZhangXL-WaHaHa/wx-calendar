module.exports = {
	/**
	 * 返回一开始显示的时间
	 * @param {string} date 
	 * @returns {Object}
	 */
	formatNowDate(date) {
		// 切割传过来的数据
		let nowYear = parseFloat(date.split('-')[0])
		let nowMonth = parseFloat(date.split('-')[1])
		let nowDay = parseFloat(date.split('-')[2])

		// 判断输入的数据是否正确
		if (Number.isNaN(nowYear) || Number.isNaN(nowMonth) || Number.isNaN(nowDay)) {
			console.warn('请按照正确的格式输入时间')
			return {
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 1,
				day: new Date().getDate()
			}
		}
		
		// 判断输入的时间有没有错
		// 暂时不清楚年份范围
		if(nowYear < 1997 || nowYear > 10000 || nowMonth < 1 || nowMonth > 12 || nowDay < 1 || nowDay < this.getTotalDays({
			year: nowYear,
			month: nowMonth
		})) {
			console.warn('请输入可以计算的时间')
			return {
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 1,
				day: new Date().getDate()
			}
		}
		
		return {
			year: nowYear,
			month: nowMonth,
			day: nowDay
		}
	},

	/**
	 * 获取某年某月的总天数
	 * @param {Object} date
	 * @returns {Number} totalDays
	 */
	getTotalDays(date) {
		// 使用时间戳计算
		let value = new Date(date.year, date.month, 0).getDate()
		return value
	},

	/**
	 * 获取某月1号是星期几
	 * @param {Object} date
	 * @returns {Number}
	 */
	getFirstDayWeek(date) {
		return new Date(date.year, date.month - 1, 1).getDay()
	},

	/**
	 *
	 * @param format
	 * @returns {*}
	 */
	date(format) {
		let str = format;
		let Week = ['日', '一', '二', '三', '四', '五', '六'];
		let date = new Date();

		str = str.replace(/yyyy|YYYY/, date.getFullYear());

		str = str.replace(/MM/, date.getMonth() > 9 ? date.getMonth().toString() : '0' + date.getMonth());
		str = str.replace(/M/g, date.getMonth());

		str = str.replace(/w|W/g, Week[date.getDay()]);

		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
		str = str.replace(/d|D/g, date.getDate());

		str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
		str = str.replace(/h|H/g, date.getHours());
		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
		str = str.replace(/m/g, date.getMinutes());

		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
		str = str.replace(/s|S/g, date.getSeconds());

		return str;
	},

	/**
	 * 获取当前时间戳
	 * @returns {number}
	 */
	time() {
		return Date.parse(new Date()) / 1000;
	}

};
