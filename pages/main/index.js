var QR = require("../../utils/qrcode.js");

Page({
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    placeholder: 'http://wxapp-union.com'//默认二维码生成文本
  },

  onLoad() {
    var size = this.setCanvasSize();//动态设置画布大小
    var initUrl = this.data.placeholder;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },

  setCanvasSize() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;
      size.w = width;
      size.h = height;
    } catch(e) {
      console.log("获取设备信息失败" + e);
    }

    return size;
  },

  createQrCode(url, canvasId, cavW, cavH) {
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);
  },

  canvasToTempImage() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail(res) {
        console.log(res);
      }
    });
  },

  previewImg (e) {
    var img = this.data.imagePath;
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },

  formSubmit(e) {
    var that = this;
    var url = e.detail.value.url;
    that.setData({
      maskHidden: false,
    });

    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });

    var st = setTimeout(() => {
      wx.hideToast()
      var size = that.setCanvasSize();
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 2000);
  }
})