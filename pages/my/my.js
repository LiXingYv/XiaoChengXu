import {Address} from "../../utils/address.js"
import {Order} from "../order/order-model.js"
import {My} from "my-model.js"

var address = new Address();
var order = new Order();
var my = new My();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageIndex:1,
        orderArr:[],
        isLoadedAll:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadData();
        this._getAddressInfo();
    },

    _getAddressInfo(){
        address.getAddress((addressInfo)=>{
            this._bindAddressInfo(addressInfo);
        })
    },

    _bindAddressInfo(addressInfo){
        this.setData({
            addressInfo:addressInfo
        })
    },

    _loadData(){
        my.getUserInfo((data) => {
            this.setData({
                userInfo:data
            })
        })

        this._getOrders();
    },

    _getOrders:function(callback){
        order.getOrders(this.data.pageIndex,(res)=>{
            var data = res.data.data;
            if(data){
                this.data.orderArr.push.apply(this.data.orderArr,data);
                this.setData({
                    orderArr:this.data.orderArr
                })
            }
            else{
                this.data.isLoadedAll = true; //已经全部加载完毕
                this.data.pageIndex = 1;
            }
            callback && callback();
        })
    },

    showOrderDetailInfo(event){
        var id = order.getDataSet(event,'id');
        wx.navigateTo({
            url: '../order/order?from=order&id='+id
        })
    },

    rePay(event){
        var id = order.getDataSet(event,'id'),
            index = order.getDataSet(event,'index');
        this._execPay(id,index);
    },

    _execPay(id,index){
        var that = this;
        order.execPay(id,(statusCode)=>{
            if(statusCode > 0){
                var flag = statusCode == 2;

                //更新订单显示状态
                if(flag){
                    that.data.orderArr[index].status = 2;
                    that.setData({
                        orderArr: that.data.orderArr
                    })
                }

                //跳转到成功页面
                wx.navigateTo({
                    url:'../pay-result/pay-result?id='+id+'&flag='+flag+'&from=my'
                })
            }else{
                that.showTips('支付失败','商品已下架或库存不足');
            }
        })
    },

    showTips(title,content){
        wx.showModal({
            title:title,
            content:content,
            showCancel:false,
            success:function(res){}
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var newOrderFlag = order.hasNewOrder();
        if(newOrderFlag){
            this.refresh();
        }
    },

    refresh(){
        var that = this;
        this.data.orderArr = [];//订单初始化
        this._getOrders(()=>{
            that.data.isLoadedAll = false;//是否加载完成
            that.data.pageIndex = 1;
            order.execSetStorageSync(false);//更新标志位
        })
    },

    editAddress(event) {
        var that = this;
        wx.chooseAddress({
            success: function (res) {
                console.log(res)
                var addressInfo = {
                    name: res.userName,
                    mobile: res.telNumber,
                    totalDetail: address.setAddressInfo(res)
                }
                that._bindAddressInfo(addressInfo)
                //保存地址
                address.submitAddress(res, (flag) => {
                    if (!flag) {
                        that.showTips('操作提示', '地址信息更新失败');
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.isLoadedAll) {
            this.data.pageIndex++;
            this._getOrders();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})