module.exports = {
	/**
	 * 获取当前的时间信息
	 * @param date
	 * @returns {string}
	 */
	getDateByDatetime(date) {
		let arr = data.split(' ');
		return arr[0];
	},

	/**
	 * 判断日期是否为今天
	 * @param date
	 * @returns {boolean}
	 */
	isToday(date) {
		let tmpDate = this.getDateByDatetime(date);
		let todayDate = this.date('yyyy-mm-dd');
		return todayDate === tmpDate;
	},

	/**
	 * 通过日期时间，获取: 小时:分钟
	 * e.g: getHourMinute('2019-01-01 08:06:00')，返回：08:06
	 * @param datetime
	 * @returns {string}
	 */
	getHourMinute(datetime) {
		let arr = datetime.split(' ');
		if (arr.length !== 2) {
			return '';
		}

		let tmp = arr[1].split(':');
		if (tmp.length < 2) {
			return '';
		}

		return tmp[0] + ':' + tmp[1];
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
