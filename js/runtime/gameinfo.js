import Emitter from '../libs/tinyemitter';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

const atlas = wx.createImage();
atlas.src = 'images/Common.png';

export default class GameInfo extends Emitter {
  constructor(levelManager) {
    super();

    this.levelManager = levelManager;
    this.levelButtons = [];

    this.btnArea = {
      startX: SCREEN_WIDTH / 2 - 40,
      startY: SCREEN_HEIGHT / 2 - 100 + 180,
      endX: SCREEN_WIDTH / 2 + 50,
      endY: SCREEN_HEIGHT / 2 - 100 + 255,
    };

    this.levelTextArea = {
      startX: 10,
      startY: 40,
      endX: 150,
      endY: 70
    };

    this.scoreSaved = false;
    this.showHealthAdviceFlag = true;
    this.showLevelSelectFlag = false;

    this.levelBtnSize = {
      width: 120,
      height: 40,
      gap: 20
    };

    this.countdown = 0;
    this.showCountdown = false;

    wx.onTouchStart(this.touchEventHandler.bind(this));
  }

  setFont(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
  }

  render(ctx) {
    this.renderGameScore(ctx, GameGlobal.databus.score);
    this.renderCurrentLevel(ctx, GameGlobal.databus.currentLevel);

    if (this.showHealthAdviceFlag) {
      this.drawHealthAdvice(ctx);
    }

    if (GameGlobal.databus.isGameOver) {
      this.renderGameOver(ctx, GameGlobal.databus.score);

      if (!this.scoreSaved) {
        this.saveScoreToBmob(GameGlobal.databus.score);
        this.scoreSaved = true;
      }
    } else {
      this.scoreSaved = false;
    }

    if (this.showLevelSelectFlag) {
      this.drawLevelSelect(ctx);
    }

    if (this.showCountdown && this.countdown > 0) {
      this.drawCountdown(ctx);
    }
  }

  renderGameScore(ctx, score) {
    this.setFont(ctx);
    ctx.fillText(`得分:${score}`, 10, 30);
  }

  renderCurrentLevel(ctx, level) {
    this.setFont(ctx);
    ctx.fillStyle = '#007AFF';
    ctx.fillText(`当前关卡: ${level}`, 10, 60);
  }

  saveScoreToBmob(score) {
    const GameScores = wx.Bmob.Query("GameScores");
    const currentUser = wx.Bmob.User.current();

    if (currentUser) {
      const userId = currentUser.objectId;

      GameScores.set("score", score);
      GameScores.set("userId", userId);

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

  drawHealthAdvice(ctx) {
    this.drawHealthAdviceBackground(ctx);
    this.drawHealthAdviceText(ctx);
    this.drawHealthAdviceButton(ctx);
  }

  drawHealthAdviceBackground(ctx) {
    ctx.drawImage(
      atlas,
      270,
      120,
      119,
      108,
      SCREEN_WIDTH / 2 - 150,
      SCREEN_HEIGHT / 2 - 100,
      300,
      300
    );
  }

  drawHealthAdviceText(ctx) {
    this.setFont(ctx);

    ctx.fillText(
      '健康游戏忠告',
      SCREEN_WIDTH / 2 - 60,
      SCREEN_HEIGHT / 2 - 100 + 50
    );

    ctx.fillText(
      '健康游戏，快乐生活。',
      SCREEN_WIDTH / 2 - 80,
      SCREEN_HEIGHT / 2 - 100 + 90+8
    );
    ctx.fillText(
      '合理安排时间，享受游戏乐趣',
      SCREEN_WIDTH / 2 - 160+24,
      SCREEN_HEIGHT / 2 - 100 + 120+8
    );
    ctx.fillText(
      '避免沉迷。',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 150+8
    );
  }

  drawHealthAdviceButton(ctx) {
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
      '开始游戏',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 205
    );
  }

  drawLevelSelect(ctx) {
    // 绘制半透明黑色背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const bgImage = wx.createImage();
    bgImage.src = 'images/ka.jpeg';
    ctx.drawImage(bgImage, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    const buttonsPerRow = 2;
    const buttonWidth = this.levelBtnSize.width;
    const buttonHeight = this.levelBtnSize.height;
    const gap = this.levelBtnSize.gap;
    
    const totalWidth = (buttonWidth * buttonsPerRow) + (gap * (buttonsPerRow - 1));
    const startX = (SCREEN_WIDTH - totalWidth) / 2;
    const startY = 100;

    this.levelButtons = [];

    // 绘制关卡按钮
    this.levelManager.levels.forEach((level, index) => {
        const row = Math.floor(index / buttonsPerRow);
        const col = index % buttonsPerRow;
        
        const x = startX + (col * (buttonWidth + gap));
        const y = startY + (row * (buttonHeight + gap));

        this.levelButtons.push({
            index: index,
            startX: x,
            startY: y,
            endX: x + buttonWidth,
            endY: y + buttonHeight
        });

        // 添加阴影效果
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // 使用白色半透明的按钮背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // 白色半透明
        ctx.fillRect(x, y, buttonWidth, buttonHeight);

        // 添加按钮边框，增加立体感
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, buttonWidth, buttonHeight);

        // 重置阴影效果，避免影响文字
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 绘制文字时添加文字阴影
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#FFFFFF';
        this.setFont(ctx);
        ctx.fillText(`第 ${index + 1} 关`, x + 20, y + 25);

        // 再次重置阴影效果
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    });

    // 添加退出按钮
    const exitButtonWidth = 100;
    const exitButtonHeight = 40;
    const exitButtonX = (SCREEN_WIDTH - exitButtonWidth) / 2;
    const exitButtonY = SCREEN_HEIGHT - exitButtonHeight - 20;

    this.exitButton = {
        startX: exitButtonX,
        startY: exitButtonY,
        endX: exitButtonX + exitButtonWidth,
        endY: exitButtonY + exitButtonHeight
    };

    // 添加退出按钮的阴影效果
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // 绘制半透明的退出按钮
    ctx.fillStyle = 'rgba(255, 59, 48, 0.7)';
    ctx.fillRect(exitButtonX, exitButtonY, exitButtonWidth, exitButtonHeight);

    // 添加退出按钮边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeRect(exitButtonX, exitButtonY, exitButtonWidth, exitButtonHeight);

    // 重置阴影效果
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // 绘制退出按钮文本（带阴影）
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('退出', exitButtonX + 30, exitButtonY + 25);

    // 最后重置所有效果
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
  }

  drawCountdown(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(this.countdown), SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    ctx.textAlign = 'left'; // 重置文本对齐方式
    this.setFont(ctx); // 重置字体
  }

  touchEventHandler(event) {
    const { clientX, clientY } = event.touches[0];

    // 检查是否点击了关卡文本
    if (!this.showLevelSelectFlag && 
        clientX >= this.levelTextArea.startX &&
        clientX <= this.levelTextArea.endX &&
        clientY >= this.levelTextArea.startY &&
        clientY <= this.levelTextArea.endY) {
        this.showLevelSelectFlag = true;
        GameGlobal.main.pauseGame();
        return;
    }

    if (this.showLevelSelectFlag) {
        // 检查是否点击了退出按钮
        if (this.exitButton &&
            clientX >= this.exitButton.startX &&
            clientX <= this.exitButton.endX &&
            clientY >= this.exitButton.startY &&
            clientY <= this.exitButton.endY) {
            this.showLevelSelectFlag = false;
            this.showCountdown = true;
            this.countdown = 3;
            
            // 开始倒计时
            const countdownInterval = setInterval(() => {
              this.countdown -= 1/60; // 假设60帧每秒
              if (this.countdown <= 0) {
                clearInterval(countdownInterval);
                this.showCountdown = false;
                GameGlobal.main.resumeGame();
              }
            }, 1000/60);
            
            return;
        }

        // 检查是否点击了关卡按钮
        const clickedButton = this.levelButtons.find(btn => 
            clientX >= btn.startX &&
            clientX <= btn.endX &&
            clientY >= btn.startY &&
            clientY <= btn.endY
        );

        if (clickedButton) {
            this.emit('selectLevel', clickedButton.index);
            this.showLevelSelectFlag = false;
        }
    }

    if (this.showHealthAdviceFlag) {
      if (
        clientX >= this.btnArea.startX &&
        clientX <= this.btnArea.endX &&
        clientY >= this.btnArea.startY &&
        clientY <= this.btnArea.endY
      ) {
        this.showHealthAdviceFlag = false;
        this.emit('restart');
      }
    }

    if (GameGlobal.databus.isGameOver) {
      if (
        clientX >= this.btnArea.startX &&
        clientX <= this.btnArea.endX &&
        clientY >= this.btnArea.startY &&
        clientY <= this.btnArea.endY
      ) {
        this.emit('restart');
      }
    }
  }
}
