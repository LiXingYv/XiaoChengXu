// pages/category/category.js
import {Category} from 'category-model.js';
var category = new Category();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentCategoryIndex:0,
        categoryTypeArr:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadData();
    },

    _loadData(){
        category.getCategoryType((categoryData)=>{
            this.setData({
                categoryTypeArr:categoryData
            })
            //一定在回调里再获取分类详情的方法调用
            category.getProductsByCategory(categoryData[0].id, (data) => {
                var dataObj = {
                    products:data,
                    topImgUrl:categoryData[0].img.url,
                    title:categoryData[0].name
                }

                this.setData({
                    categoryProducts:dataObj
                })
            });
        });
        
        
    },

    onCategoryItemTap(event) {
        var id = category.getDataSet(event, 'id');
        var index = category.getDataSet(event, 'index');
        this.setData({
            currentCategoryIndex: index
        });
        category.getProductsByCategory(
            id, (data) => {
            var dataObj = {
                products: data,
                topImgUrl: this.data.categoryTypeArr[index].img.url,
                title: this.data.categoryTypeArr[index].name
            }

            this.setData({
                categoryProducts: dataObj
            })
        });
    },

    onProductsItemTap(event){
        var id = category.getDataSet(event, 'id');
        wx.navigateTo({
            url: '../product/product?id=' + id
        });
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})