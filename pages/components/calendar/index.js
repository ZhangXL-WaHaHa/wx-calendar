// pages/components/calendar/index.js
import dateUtil from "dateUtil.js"

const DAY_TYPE = ['last', 'cur', 'next']  //类型，分为上月，本月和下个月

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		showTitle: {
			type: Boolean,
			value: true
		},
		title: {
			type: String,
			value: '日历标题'
		},
		showSubTitle: {
			type: Boolean,
			value: true
		},
		subTitle: {
			type: String,
			value: '日历副标题'
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
			value: [
				{
					value: '2020-08-09',
					text: '售'
				}
			]
		}
		
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		weekList: ['日', '一', '二', '三', '四', '五', '六'],  //一周
		
		beginShow: {
			year: -1,
			month: -1,
			day: -1,
			select: -1,  //选中的时间,位置
		},  //一开始显示的月份
		
		// 上一个月份的时间
		lastMonthInfo: {
			year: -1,
			month: -1,
			list: []
		},
		
		// 下一个月份的时间
		nextMonthInfo: {
			year: -1,
			month: -1,
			list: []
		},
	},
	
	// 监听一开始显示的月份
	observers: {
		"beginTime": function (time) {
			this.setData({
				beginShow: {
					...dateUtil.formatNowDate(time),
					list: []
				}
			})
		}
	},
	
	// 一开始加载时获取当前的时间
	attached() {
		this.formatMonthData(this.data.beginShow)
		this.calculateResidualDays(this.data.beginShow)
		
		// 计算上个月和下个月的数据
		this.getLastMonth(this.data.beginShow)
		this.getNextMonth(this.data.beginShow)
		
		console.log('输出当前的日历详情', this.data.beginShow, this.data.lastMonthInfo, this.data.nextMonthInfo)
		
		// 计算完成，重新渲染
		this.setData({
			beginShow: this.data.beginShow
		}, () => {
			// 开始计算
			console.log('输出当前的计算结果', this.data.beginShow)
		})
	},

	// 渲染完成
	ready() {

	},
	
	/**
	 * 组件的方法列表
	 */
	methods: {
		// 获取本月的天数和1号是星期几
		formatMonthData(date) {
			// 获取当前月份的天数
			let value = dateUtil.getTotalDays(date)
			for(let i = 1; i <= value; i++) {
				date.list.push({
					value: i,
					type: 'cur'
				})
			}
			
			// 获取当前月份1号星期几
			date.firstDayWeek = dateUtil.getFirstDayWeek(date)
		},
		
		// 根据当前的天数，计算上月残余天数和下月残余天数
		calculateResidualDays(date) {
			// 计算上月残余天数,需要知道1号是星期几(个数)且上月最后一天是几号(起始数值)
			let last_value = dateUtil.getTotalDays({
				year: date.year,
				month: date.month - 1
			})
			for(let i = 0; i < date.firstDayWeek; i++) {
				date.list.unshift({
					value: last_value - i,
					type: 'last'
				})
			}
			
			// 计算下月残余天数,需要知道本月显示多少行
			let total = Math.floor(date.list.length / 7)
			if( date.list.length % 7 > 0) {
				++ total
			}
			if(this.properties.fixRow) {
				// 设置了每月固定显示6行
				total = 6
			}
			let next_value = total * 7 - date.list.length
			for(let i = 1; i <= next_value; i++) {
				date.list.push({
					value: i,
					type: 'next'
				})
			}

		//	判断是否有天，如果有，设置一开始选中的号数
			if(date.day) {
				date.select = date.firstDayWeek + date.day - 1
			}

		//	格式化显示的提示信息
			this.formatShowTip(date)
		},
		
		// 获取上个月的日期数据
		getLastMonth(date) {
			if(date.month === 1) {
				this.data.lastMonthInfo.year = date.year - 1
				this.data.lastMonthInfo.month = 12
			} else {
				this.data.lastMonthInfo.year = date.year
				this.data.lastMonthInfo.month = date.month - 1
			}
			
			// 计算上个月的详细情况
			this.formatMonthData(this.data.lastMonthInfo)
			this.calculateResidualDays(this.data.lastMonthInfo)
		},
		
		// 计算下个月的日期数据
		getNextMonth(date) {
			if(date.month === 12) {
				this.data.nextMonthInfo.year = date.year + 1
				this.data.nextMonthInfo.month = 1
			} else {
				this.data.nextMonthInfo.year = date.year
				this.data.nextMonthInfo.month = date.month + 1
			}
			
			// 计算下个月的详细情况
			this.formatMonthData(this.data.nextMonthInfo)
			this.calculateResidualDays(this.data.nextMonthInfo)
		},

	//	点击选中某个时间节点
		selectDate(e) {
		//	设置选中的时间节点
			this.setData({
				['beginShow.select']: e.currentTarget.dataset.index
			})
		},

	//	格式化显示的文字
		formatShowTip(date) {
			// 循环遍历找出对应的要显示的文字日期
			this.properties.dateText.forEach((item, index) => {
				date.list.forEach((arr, temp) => {
					let value = date.year + '-' + date.month + '-' + arr.value
					console.log(value, item.value)
					if(item.value === value) {
						arr.text =  item.text
					}
				})
			})
		}
		
	}
})
