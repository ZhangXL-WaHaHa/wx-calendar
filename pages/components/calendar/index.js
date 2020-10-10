// pages/components/calendar/index.js
import dateUtil from "dateUtil.js"
const DAY_TYPE = ['last', 'cur', 'next'] //类型，分为上月，本月和下个月
const DATE_TYPE = ['between', 'select', 'unSelect']

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 日历类型
		// 默认是单选类型，提供选择范围和多选类型
		calendarType: {
			type: String,
			value: 'single'
		},
		// 选择的日期类型
		selectDate: {
			type: Array || String || Object,
			value: null
		},
		
		// 是否显示日历标题
		showTitle: {
			type: Boolean,
			value: true
		},
		// 日历标题
		title: {
			type: String,
			value: '日历标题'
		},
		// 日历副标题
		showSubTitle: {
			type: Boolean,
			value: true
		},

		// 控制一开始显示的时间（数据格式：2020-09-28）
		beginTime: {
			type: String,
			value: ''
		},

		// 日历是否固定显示六行
		fixRow: {
			type: Boolean,
			value: false
		},

		//	选中的背景颜色
		selectBackground: {
			type: String,
			value: "lightgreen"
		},

		//	日期是否显示相关的数据
		dateText: {
			type: Array,
			value: [{
				value: '2020-08-09',
				text: '售'
			}]
		},

		// 是否显示月份水印
		showMark: {
			type: Boolean,
			value: true
		},

		// 是否显示底部按钮
		showButton: {
			type: Boolean,
			value: false
		},

		// 是否是选择时间范围
		selectDataRange: {
			type: Boolean,
			value: false
		},
		// 设置选择的时间范围大小,-1表示不设置大小
		dataRangeSize: {
			type: Number,
			value: -1
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		weekList: ['日', '一', '二', '三', '四', '五', '六'], //一周

		// 每个日期添加颜色状态
		// 表示范围之间，选中，未选中, 已过期四种状态
		calendarInfo: {
			last: {
				year: -1,
				month: -1,
				list: [],
				swiperHeight: 999
			},
			cur: {
				year: -1,
				month: -1,
				day: -1,
				select: -1, //选中的时间,位置
				swiperHeight: 999, //滚动框的高度
			},
			next: {
				year: -1,
				month: -1,
				list: [],
				swiperHeight: 999
			}
		}, //日历信息
		subTitle: {
			year: '',
			month: ''
		}, //日历副标题

		selectRange: {
			begin: '',
			end: ''
		}, //选择的时间范围
		selectDateList: [], //多选选中的范围

		selectDate: '', //单选选中的时间
		showCalendarIndex: 1, //当前显示的日历信息
	},

	// 监听一开始显示的月份
	observers: {
		"beginTime": function(time) {
			this.data.calendarInfo.cur = {
				...dateUtil.formatNowDate(time),
				list: []
			}
		}
	},

	// 一开始加载时获取当前的时间
	attached() {
		this.formatMonthData(this.data.calendarInfo.cur)

		// 计算上个月和下个月的数据
		this.getLastMonth()
		this.getNextMonth()

		// 计算完成，重新渲染
		this.setData({
			['calendarInfo.cur']: this.data.calendarInfo.cur,
		})
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 获取本月的天数和1号是星期几
		formatMonthData(date) {
			// 根据不同的日历模式格式化日期数据
			// 需要判断是否有设置预选日期
			switch (this.properties.calendarType) {
				case 'multiple':
					this.formatMultipleDate(date)
					break;
				case 'range':
					this.formatRangeDate(date)
					break;
				default:
						this.formatDate(date)
			}
		},

		// 格式化多选的日期
		formatMultipleDate(date) {
			// 获取当前月份的天数
			let value = dateUtil.getTotalDays(date)

			// 判断当前是否有预选的日期
			if (this.data.selectDateList.length === 0) {
				for (let i = 1; i <= value; i++) {
					date.list.push({
						value: i,
						type: 'cur',
						color: 'unSelect'
					})
				}
			} else {
				// 判断预选的日期是否与当前的日期一致
				this.data.selectDateList.forEach((item, index) => {
					for (let i = 1; i <= value; i++) {
						if (item === date.year + '-' + date.month + '-' + i) {
							date.list.push({
								value: i,
								type: 'cur',
								color: 'select'
							})
						} else {
							date.list.push({
								value: i,
								type: 'cur',
								color: 'unSelect'
							})
						}
					}
				})
			}

			// 获取当前月份1号星期几
			date.firstDayWeek = dateUtil.getFirstDayWeek(date)
			// 计算残余天数
			this.calculateResidualDays(date)
		},

		// 格式化选择范围日期
		formatRangeDate(date) {
			// 获取当前月份的天数
			let value = dateUtil.getTotalDays(date)

			// 格式化开始的日期和结束日期时间戳
			let beginTimeStamp = new Date(this.data.selectRange.begin.replace(/-/g, '/')).getTime()
			let endTimeStamp = new Date(this.data.selectRange.end.replace(/-/g, '/')).getTime()

			// 判断是否有选择日期
			if (this.data.selectRange.begin === '' && this.data.selectRange.end === '' || beginTimeStamp > endTimeStamp) {
				for (let i = 1; i <= value; i++) {
					date.list.push({
						value: i,
						type: 'cur',
						color: 'unSelect'
					})
				}
			} else {
				// 判断日期是否在选择范围之内
				for (let i = 1; i <= value; i++) {
					let timeStamp = new Date(date.year + '/' + date.month + '/' + i).getTime()
					let colorValue = 'unSelect'
					if (timeStamp === beginTimeStamp || timeStamp === endTimeStamp) {
						colorValue = 'select'
					} else if (timeStamp > beginTimeStamp && timeStamp < endTimeStamp) {
						colorValue = 'between'
					}
					date.list.push({
						value: i,
						type: 'cur',
						color: colorValue
					})
				}
			}

			// 获取当前月份1号星期几
			date.firstDayWeek = dateUtil.getFirstDayWeek(date)
			// 计算残余天数
			this.calculateResidualDays(date)
		},

		// 格式化单选日期
		formatDate(date) {
			// 获取当前月份的天数
			let value = dateUtil.getTotalDays(date)

			// 判断是否有预选的日期
			for (let i = 1; i <= value; i++) {
				let colorValue = (date.year + '-' + date.month + '-' + i) === this.data.selectDate ? 'select' : 'unSelect'
				date.list.push({
					value: i,
					type: 'cur',
					color: colorValue
				})
			}

			// 获取当前月份1号星期几
			date.firstDayWeek = dateUtil.getFirstDayWeek(date)
			// 计算残余天数
			this.calculateResidualDays(date)
		},

		// 根据当前的天数，计算上月残余天数和下月残余天数
		calculateResidualDays(date) {
			// 计算上月残余天数,需要知道1号是星期几(个数)且上月最后一天是几号(起始数值)
			let last_value = dateUtil.getTotalDays({
				year: date.year,
				month: date.month - 1
			})
			for (let i = 0; i < date.firstDayWeek; i++) {
				date.list.unshift({
					value: last_value - i,
					type: 'last'
				})
			}

			// 计算下月残余天数,需要知道本月显示多少行
			let total = Math.floor(date.list.length / 7)
			if (date.list.length % 7 > 0) {
				++total
			}
			if (this.properties.fixRow) {
				// 设置了每月固定显示6行
				total = 6
			}
			let next_value = total * 7 - date.list.length

			// 设置滚动框的高度
			date.swiperHeight = total * 107
			for (let i = 1; i <= next_value; i++) {
				date.list.push({
					value: i,
					type: 'next'
				})
			}

			//	判断是否有天，如果有，设置一开始选中的号数
			if (date.day) {
				date.select = date.firstDayWeek + date.day - 1
			}

			//	格式化显示的提示信息
			this.formatShowTip(date)
		},

		// 获取上个月的日期数据
		getLastMonth() {
			let changeKey = DAY_TYPE[this.data.showCalendarIndex - 1 >= 0 ? this.data.showCalendarIndex - 1 : 2]
			let date = this.data.calendarInfo[DAY_TYPE[this.data.showCalendarIndex]]
			let changeDate = this.data.calendarInfo[changeKey]

			// 使用滑动切换,不能够使用last表示上个月，传递参数，要改变的日期信息
			if (date.month === 1) {
				changeDate = {
					year: date.year - 1,
					month: 12,
					list: []
				}
			} else {
				changeDate = {
					year: date.year,
					month: date.month - 1,
					list: []
				}
			}

			// 计算上个月的详细情况
			this.formatMonthData(changeDate)
			this.setData({
				subTitle: {
					year: date.year,
					month: date.month
				},
				[`calendarInfo.${changeKey}`]: changeDate
			})
		},

		// 计算下个月的日期数据
		getNextMonth() {
			let changeKey = DAY_TYPE[(this.data.showCalendarIndex + 1) % 3]
			let date = this.data.calendarInfo[DAY_TYPE[this.data.showCalendarIndex]]
			let changeDate = this.data.calendarInfo[changeKey]

			if (date.month === 12) {
				// 格式化下个月信息
				changeDate = {
					year: date.year + 1,
					month: 1,
					list: []
				}
			} else {
				changeDate = {
					year: date.year,
					month: date.month + 1,
					list: []
				}
			}

			// 计算下个月的详细情况
			this.formatMonthData(changeDate)
			this.setData({
				subTitle: {
					year: date.year,
					month: date.month
				},
				[`calendarInfo.${changeKey}`]: changeDate
			})
		},

		//	点击选中某个时间节点
		selectDate(e) {
			// 判断当前的模式是否是选择范围
			if (this.properties.calendarType === 'range') {
				// 判断是选择开始还是结束
				
			}
			// 判断当前模式是否是多选
			if (this.properties.calendarType === 'multiple') {

				return;
			}

			if (e.currentTarget.dataset.type === 'last') {
				this.showLastMonth()
			} else if (e.currentTarget.dataset.type === 'next') {
				this.showNextMonth()
			} else {
				//	设置选中的时间节点
				this.setData({
					[`calendarInfo.${e.currentTarget.dataset.key}.select`]: e.currentTarget.dataset.index
				})
			}
		},

		//	格式化显示的文字
		formatShowTip(date) {
			// 循环遍历找出对应的要显示的文字日期
			this.properties.dateText.forEach((item, index) => {
				date.list.forEach((arr, temp) => {
					let value = date.year + '-' + date.month + '-' + arr.value
					if (item.value === value && arr.type === 'cur') {
						arr.text = item.text
						// 文字显示的方向
						arr.textDirection = item.direction
					}
				})
			})
		},

		// 点击显示下一月
		showNextMonth() {
			// 显示下一个月的数据,需要改变的数据是下下个月
			this.setData({
				showCalendarIndex: (++this.data.showCalendarIndex) % 3
			})

			// 获取下一个月的数据，会改变下个月的数据
			this.getNextMonth()
		},

		// 点击显示上一月
		showLastMonth() {
			// 切换上个月，需要改变的数据是上上个月
			this.setData({
				showCalendarIndex: (--this.data.showCalendarIndex) < 0 ? 2 : this.data.showCalendarIndex,
			})

			// 获取上一个月的数据
			this.getLastMonth()
		},

	}
})
