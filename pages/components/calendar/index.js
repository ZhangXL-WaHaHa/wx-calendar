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
		fiexRow: {
			type: Boolean,
			value: false
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
			day: -1
		},  //一开始显示的月份
		
		// 上一个月份的时间
		lastMonthInfo: {
			year: -1,
			month: -1,
			day: -1
		},
		
		// 下一个月份的时间
		nextMonthInfo: {
			year: -1,
			month: -1,
			day: -1
		}
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
		this.formatNowMonthData()
		this.calculateResidualDays()
		
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
		formatNowMonthData() {
			// 获取当前月份的天数
			let value = dateUtil.getTotalDays(this.data.beginShow)
			for(let i = 1; i <= value; i++) {
				this.data.beginShow.list.push({
					value: i,
					type: 'cur'
				})
			}
			
			// 获取当前月份1号星期几
			this.data.beginShow.firstDayWeek = dateUtil.getFirstDayWeek(this.data.beginShow)
		},
		
		// 根据当前的天数，计算上月残余天数和下月残余天数
		calculateResidualDays() {
			// 计算上月残余天数,需要知道1号是星期几(个数)且上月最后一天是几号(起始数值)
			let last_value = dateUtil.getTotalDays({
				year: this.data.beginShow.year,
				month: this.data.beginShow.month - 1
			})
			for(let i = 0; i < this.data.beginShow.firstDayWeek; i++) {
				this.data.beginShow.list.unshift({
					value: last_value - i,
					type: 'last'
				})
			}
			
			// 计算下月残余天数,需要知道本月显示多少行
			let total = Math.floor(this.data.beginShow.list.length / 7)
			if( this.data.beginShow.list.length % 7 > 0) {
				++ total
			}
			if(this.properties.fixRow) {
				// 设置了每月固定显示6行
				total = 6
			}
			let next_value = total * 7 - this.data.beginShow.list.length
			for(let i = 1; i <= next_value; i++) {
				this.data.beginShow.list.push({
					value: i,
					type: 'next'
				})
			}
		}
	}
})
