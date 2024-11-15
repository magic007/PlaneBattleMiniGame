export default class DataManager {
    constructor() {
        this.initialized = false;
    }

    // 初始化 Bmob
    init() {
        if (!this.initialized) {
            Bmob.initialize(
                "1d9e65648f55a699b52117afee8899ef",
                "28858dc4bbe7ba62f2a84cdfba915de6"
            );
            this.initialized = true;
        }
    }

    // 保存分数
    saveScore(score) {
        return new Promise((resolve, reject) => {
            const GameScores = wx.Bmob.Query("GameScores");
            const currentUser = wx.Bmob.User.current();

            if (currentUser) {
                const userId = currentUser.objectId;

                GameScores.set("score", score);
                GameScores.set("userId", userId);

                GameScores.save()
                    .then((res) => {
                        console.log('得分保存成功', res);
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('得分保存失败', err);
                        reject(err);
                    });
            } else {
                console.log('未登录用户，无法保存得分');
                reject(new Error('未登录用户'));
            }
        });
    }

    // 获取我的战绩
    getMyScores() {
        return new Promise((resolve, reject) => {
            const GameScores = wx.Bmob.Query("GameScores");
            const currentUser = wx.Bmob.User.current();

            if (currentUser) {
                GameScores.equalTo("userId", "==", currentUser.objectId);
                GameScores.order("-createdAt");
                GameScores.limit(3);  // 获取最近10条记录

                GameScores.find()
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else {
                reject(new Error('未登录用户'));
            }
        });
    }

    // 获取今日最高分
    getTodayTopScores() {
        return new Promise((resolve, reject) => {
            const GameScores = wx.Bmob.Query("GameScores");
            
            // 获取今天的开始时间
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            GameScores.equalTo("createdAt", ">=", today);
            GameScores.order("-score");
            GameScores.limit(3);  // 获取前10名

            GameScores.find()
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
} 