export default class LevelManager {
    constructor() {
        this.currentLevel = 0; // 当前关卡
        this.levels = [
            { enemies: 5, enemyType: 'easy', interval: 30 },
            { enemies: 10, enemyType: 'medium', interval: 25 },
            { enemies: 15, enemyType: 'hard', interval: 20 },
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
        this.currentLevel = 0; // 重置到第一个关卡
    }
} 