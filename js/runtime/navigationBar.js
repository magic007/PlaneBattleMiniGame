import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import Emitter from '../libs/tinyemitter';

export default class NavigationBar extends Emitter {
    constructor() {
        super();

        // 当前关卡文本区域
        this.levelTextArea = {
            startX: 10,
            startY: 40,
            endX: 150,
            endY: 70
        };

        // 设置按钮区域
        this.settingBtnArea = {
            startX: 10,
            startY: 80,
            endX: 150,
            endY: 110
        };
    }

    setFont(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
    }

    render(ctx) {
        this.renderGameScore(ctx, GameGlobal.databus.score);
        this.renderCurrentLevel(ctx, GameGlobal.databus.currentLevel);
        this.renderSettingButton(ctx);
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

    renderSettingButton(ctx) {
        ctx.fillStyle = '#007AFF';
        ctx.fillText('设置', 10, 90);
    }

    // 检查是否点击了关卡文本
    checkLevelTextClick(x, y) {
        return (
            x >= this.levelTextArea.startX &&
            x <= this.levelTextArea.endX &&
            y >= this.levelTextArea.startY &&
            y <= this.levelTextArea.endY
        );
    }

    // 检查是否点击了设置按钮
    checkSettingClick(x, y) {
        return (
            x >= this.settingBtnArea.startX &&
            x <= this.settingBtnArea.endX &&
            y >= this.settingBtnArea.startY &&
            y <= this.settingBtnArea.endY
        );
    }
} 