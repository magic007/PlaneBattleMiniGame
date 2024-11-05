import './render'; // 初始化Canvas
import Player from './player/index'; // 导入玩家类
import Enemy from './npc/enemy'; // 导入敌机类
import BackGround from './runtime/background'; // 导入背景类
import GameInfo from './runtime/gameinfo'; // 导入游戏UI类
import Music from './runtime/music'; // 导入音乐类
import DataBus from './databus'; // 导入数据类，用于管理游戏状态和数据
import Bmob from './libs/Bmob-1.7.1.min.js'; // 引入 Bmob SDK
import LevelManager from './base/levelManager'; // 导入关卡管理类

const ENEMY_GENERATE_INTERVAL = 30;
const ctx = canvas.getContext('2d'); // 获取canvas的2D绘图上下文;

GameGlobal.databus = new DataBus(); // 全局数据管理，用于管理游戏状态和数据
GameGlobal.musicManager = new Music(); // 全局音乐管理实例

/**
 * 游戏主函数
 */
export default class Main {
  aniId = 0; // 用于存储动画帧的ID
  bg = new BackGround(); // 创建背景
  player = new Player(); // 创建玩家
  gameInfo = new GameInfo(); // 创建游戏UI显示
  levelManager = new LevelManager(); // 初始化关卡管理
  isLevelCompleteModalVisible = false; // 添加标志，表示弹框是否可见

  constructor() {


    // 当开始游戏被点击时，重新开始游戏
    this.gameInfo.on('restart', this.start.bind(this));

    // 显示健游戏忠告
    this.showHealthAdvice();


    // 开始游戏
    this.start();
  }

  showHealthAdvice() {
    wx.showModal({
      title: '健康游戏忠告',
      content: '健康游戏，快乐生活。合理安排时间，享受游戏乐趣，避免沉迷。',
      showCancel: false, // 不显示取消按钮
      success: (res) => {
        if (res.confirm) {
          console.log('用户确认了忠告');
          // 这里可以继续游戏的初始化逻辑
          this.start(); // 开始游戏
        }
      }
    });
  }

  startGame() {
    // 游戏开始的逻辑
    console.log('游戏开始');
    // 其他游戏初始化代码...
  }

  /**
   * 开始或重启游戏
   */
  start() {
    console.log('游戏开始'); // 添加调试信息
    // 初始化 Bmob
    Bmob.initialize("1d9e65648f55a699b52117afee8899ef", "28858dc4bbe7ba62f2a84cdfba915de6"); // 请根据实际情况替换

    // 一键登录
    Bmob.User.auth().then(res => {
      console.log(res);
      console.log('一键登陆成功');
    }).catch(err => {
      console.log(err);
    });

    GameGlobal.databus.reset(); // 重置数据
    this.player.init(); // 重置玩家状态
    this.levelManager.reset(); // 重置关卡管理器
    cancelAnimationFrame(this.aniId); // 清除上一局的动画
    this.aniId = requestAnimationFrame(this.loop.bind(this)); // 开始新的动画循环

    this.startLevel(); // 开始当前关卡
  }

  startLevel() {
    const level = this.levelManager.getCurrentLevel();
    console.log(`开始关卡 ${this.levelManager.currentLevel + 1}: 敌人数量 ${level.enemies}`);
    this.enemyGenerate(level); // 生成敌人
  }

  enemyGenerate(level) {
    // 根据关卡设置生成敌人
    for (let i = 0; i < level.enemies; i++) {
      const enemy = GameGlobal.databus.pool.getItemByClass(level.enemyType, Enemy); // 根据类型获取敌人
      enemy.init(); // 初始化敌人
      GameGlobal.databus.enemys.push(enemy); // 添加到敌人数组
    }
  }

  /**
   * 全局碰撞检测
   */
  collisionDetection() {
    // 检测子弹与敌机的碰撞
    GameGlobal.databus.bullets.forEach((bullet) => {
      for (let i = 0, il = GameGlobal.databus.enemys.length; i < il; i++) {
        const enemy = GameGlobal.databus.enemys[i];

        // 如果敌机存活并且发生了发生碰撞
        if (enemy.isCollideWith(bullet)) {
          enemy.destroy(); // 销毁敌机
          bullet.destroy(); // 销毁子弹
          GameGlobal.databus.score += 1; // 增加数
          break; // 退出循环
        }
      }
    });

    // 检测玩家与敌机的碰撞
    for (let i = 0, il = GameGlobal.databus.enemys.length; i < il; i++) {
      const enemy = GameGlobal.databus.enemys[i];

      // 如果玩家与敌机发生碰撞
      if (this.player.isCollideWith(enemy)) {
        this.player.destroy(); // 销毁玩家飞机
        GameGlobal.databus.gameOver(); // 游戏结束

        break; // 退出循环
      }
    }
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布

    this.bg.render(ctx); // 绘制背景
    this.player.render(ctx); // 绘制玩家飞机
    GameGlobal.databus.bullets.forEach((item) => item.render(ctx)); // 绘制所有子弹
    GameGlobal.databus.enemys.forEach((item) => item.render(ctx)); // 绘制所有敌机
    this.gameInfo.render(ctx); // 绘制游戏UI
    GameGlobal.databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx); // 渲染动画
      }
    }); // 绘制所有动画
  }

  // 游戏逻辑更新主函数
  update() {
    GameGlobal.databus.frame++; // 增加帧数

    if (GameGlobal.databus.isGameOver) {
      return;
    }

    this.bg.update(); // 更新背景
    this.player.update(); // 更新玩家
    // 更新所有子弹
    GameGlobal.databus.bullets.forEach((item) => item.update());
    // 更新所有敌机
    GameGlobal.databus.enemys.forEach((item) => item.update());

    this.collisionDetection(); // 检测碰撞
    this.checkLevelCompletion(); // 检查关卡完成
  }

  // 实现游戏帧循环
  loop() {
    this.update(); // 更新游戏逻辑
    this.render(); // 渲染游戏画面

    // 请求下一帧动画
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }

  checkLevelCompletion() {
    // 检查当前关卡的敌机数量是否为零
    if (GameGlobal.databus.enemys.length === 0 && !this.isLevelCompleteModalVisible) {
        console.log(`关卡 ${this.levelManager.currentLevel + 1} 完成!`);
        this.isLevelCompleteModalVisible = true; // 设置标志为 true，表示弹框正在显示
        
        // 提示玩家进入下一关
        wx.showModal({
            title: '关卡完成',
            content: `恭喜！你已完成关卡 ${this.levelManager.currentLevel + 1}，点击确认进入下一关！`,
            showCancel: false, // 不显示取消按钮
            success: (res) => {
                if (res.confirm) {
                    this.levelManager.nextLevel(); // 进入下一个关卡
                    this.startLevel(); // 开始新关卡
                }
                this.isLevelCompleteModalVisible = false; // 重置标志
            }
        });
    }
  }
}

