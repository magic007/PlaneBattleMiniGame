// 创建游戏画布
GameGlobal.canvas = wx.createCanvas();


const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();

canvas.width = windowInfo.screenWidth;
canvas.height = windowInfo.screenHeight;

// 导出屏幕宽度
export const SCREEN_WIDTH = windowInfo.screenWidth;
// 导出屏幕高度
export const SCREEN_HEIGHT = windowInfo.screenHeight;