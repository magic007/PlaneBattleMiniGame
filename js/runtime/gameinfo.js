import Emitter from '../libs/tinyemitter';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

const atlas = wx.createImage();
atlas.src = 'images/Common.png';

export default class GameInfo extends Emitter {
  constructor() {
    super();

    this.btnArea = {
      startX: SCREEN_WIDTH / 2 - 40,
      startY: SCREEN_HEIGHT / 2 - 100 + 180,
      endX: SCREEN_WIDTH / 2 + 50,
      endY: SCREEN_HEIGHT / 2 - 100 + 255,
    };

    this.scoreSaved = false; // 添加标志，跟踪得分是否已保存

    // 绑定触摸事件
    wx.onTouchStart(this.touchEventHandler.bind(this));
  }

  setFont(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
  }

  render(ctx) {
    this.renderGameScore(ctx, GameGlobal.databus.score); // 绘制当前分数
    this.renderCurrentLevel(ctx, GameGlobal.databus.currentLevel); // 绘制当前关卡

    // 游戏结束时停止帧循环并显示游戏结束画面
    if (GameGlobal.databus.isGameOver) {
      this.renderGameOver(ctx, GameGlobal.databus.score); // 绘制游戏结束画面

      // 仅在得分未保存时保存得分
      if (!this.scoreSaved) {
        this.saveScoreToBmob(GameGlobal.databus.score); // 在游戏结束时保存得分
        this.scoreSaved = true; // 设置标志，表示得分已保存
      }
    } else {
      this.scoreSaved = false; // 如果游戏未结束，重置标志
    }
  }

  renderGameScore(ctx, score) {
    this.setFont(ctx);
    ctx.fillText(`得分:${score}`, 10, 30);
  }

  renderCurrentLevel(ctx, level) {
    this.setFont(ctx);
    ctx.fillText(`当前关卡: ${level}`, 10, 60); // 在分数下方绘制当前关卡
  }

  saveScoreToBmob(score) {
    const GameScores = wx.Bmob.Query("GameScores"); // 使用 wx.Bmob.Query 创建查询对象
    const currentUser = wx.Bmob.User.current(); // 获取当前用户信息

    if (currentUser) {
      const userId = currentUser.objectId; // 获取用户的 objectId

      GameScores.set("score", score);
      GameScores.set("userId", userId); // 假设您在表中有一个 userId 字段

      GameScores.save().then((res) => {
        console.log('得分保存成功', res);
      }).catch((err) => {
        console.log('得分保存失败', err);
      });
    } else {
      console.log('未登录用户，无法保存得分');
    }
  }

  renderGameOver(ctx, score) {
    this.drawGameOverImage(ctx);
    this.drawGameOverText(ctx, score);
    this.drawRestartButton(ctx);
  }

  drawGameOverImage(ctx) {
    ctx.drawImage(
      atlas,
      0,
      0,
      119,
      108,
      SCREEN_WIDTH / 2 - 150,
      SCREEN_HEIGHT / 2 - 100,
      300,
      300
    );
  }

  drawGameOverText(ctx, score) {
    this.setFont(ctx);
    ctx.fillText(
      '游戏结束',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 50
    );
    ctx.fillText(
      `得分: ${score}`,
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 130
    );
  }

  drawRestartButton(ctx) {
    ctx.drawImage(
      atlas,
      120,
      6,
      39,
      24,
      SCREEN_WIDTH / 2 - 60,
      SCREEN_HEIGHT / 2 - 100 + 180,
      120,
      40
    );
    ctx.fillText(
      '重新开始',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 205
    );
  }

  touchEventHandler(event) {
    const { clientX, clientY } = event.touches[0]; // 获取触摸点的坐标

    // 当前只有游戏结束时展示了UI，所以只处理游戏结束时的状态
    if (GameGlobal.databus.isGameOver) {
      // 检查触摸是否在按钮区域内
      if (
        clientX >= this.btnArea.startX &&
        clientX <= this.btnArea.endX &&
        clientY >= this.btnArea.startY &&
        clientY <= this.btnArea.endY
      ) {
        // 调用重启游戏的回调函数
        this.emit('restart'); // 触发重启事件
      }
    }
  }
}
