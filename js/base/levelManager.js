export default class LevelManager {
    constructor() {
        this.currentLevel = 0; // 当前关卡
        this.levels = [
            { enemies: 5, enemyType: 'easy', interval: 30, background: 'images/bg1.jpg' },
            { enemies: 7, enemyType: 'easy', interval: 28, background: 'images/bg2.jpg' },
            { enemies: 9, enemyType: 'medium', interval: 26, background: 'images/bg3.jpg' },
            { enemies: 11, enemyType: 'medium', interval: 24, background: 'images/bg4.jpg' },
            { enemies: 13, enemyType: 'hard', interval: 22, background: 'images/bg5.jpg' },
            { enemies: 15, enemyType: 'hard', interval: 20, background: 'images/bg6.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg7.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg8.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg9.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg10.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg11.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg12.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg13.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg14.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg15.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg16.jpg' },
            { enemies: 17, enemyType: 'hard', interval: 18, background: 'images/bg17.jpg' },
            // 可以继续添加更多关卡
        ];
    }

    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel >= this.levels.length) {
            this.currentLevel = this.levels.length - 1; // 防止超出范围
        }
    }

    reset() {
        this.currentLevel =0; // 重置到第一个关卡
        GameGlobal.databus.currentLevel = 1
    }
} 