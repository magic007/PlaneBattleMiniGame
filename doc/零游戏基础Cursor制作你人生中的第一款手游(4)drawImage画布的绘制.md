# 零游戏基础Cursor制作你人生中的第一款手游(4)drawImage画布的绘制



在上一篇教程中，我们探讨了如何创建游戏关卡，同时也意识到初始的游戏提示——黑屏上的文字，看起来非常简陋，与商业游戏应有的品质相差甚远。因此，我们决定将这一提示升级为一个更加符合游戏风格的弹窗提示。现在让我们来看看改进后的效果以及实现的具体步骤。

### 改进效果展示

- **原始提示界面**：

![Xnip2024-11-08_14-50-55.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/1806400294.jpg)

**改进后界面**：

![Xnip2024-11-11_17-54-57.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/2782301238.jpg)

本来以为很简单，后面也是跟AI交互了很多次，才知道要从系统弹框，改为这种背景弹框，并不是那么容易

首先看我怎么跟AI交互的

## 实现步骤

### 交互一,去掉wx.showModal：

>  之前的wx.showModal 不需要了，显示自定义的 健康游戏忠告

这里让他用素材

![Common.png](https://www.cctvcloud.cn/usr/uploads/2024/11/333434210.png)



```
要将之前的 wx.showModal 替换为自定义的健康游戏忠告框，你可以在 GameInfo 类中使用 drawHealthAdvice 方法来绘制这个框，并在游戏开始时显示它。以下是如何实现这一功能的步骤：
1. 移除 wx.showModal
首先，确保在 Main 类的 showHealthAdvice 方法中移除 wx.showModal 的调用，改为直接设置 showHealthAdviceFlag 为 true，以便在 render 方法中绘制忠告框。
2. 更新 Main 类
以下是更新后的 Main 类示例：
3. 更新 GameInfo 类
确保 GameInfo 类中的 drawHealthAdvice 方法能够正确绘制健康游戏忠告，并在 render 方法中调用它。
4. 触摸事件处理
在 GameInfo 类的 touchEventHandler 方法中，处理用户点击以开始游戏：
5. 整体逻辑
绘制忠告框：在 GameInfo 类中添加 drawHealthAdvice 方法，绘制一个半透明的框和文本。
控制显示状态：使用 showHealthAdviceFlag 控制是否显示忠告框。
在游戏开始时隐藏忠告：在用户确认后，设置 showHealthAdviceFlag 为 false。
通过这些步骤，你应该能够在游戏开始时绘制健康游戏忠告的框，并在用户确认后开始游戏。如果还有其他问题或需求，请随时告知！
```

这里同意使用他的代码，

### 交互二，修复还没点击开始，飞机就一直落下来

>进入游戏的时候，飞机先不要下来，等用户点击了“健康游戏，快乐生活” 再开始

```
这里又说了一堆，我使用了他的代码
```

然后刷新游戏黑屏了，应该是他没执行游戏开始按钮，这里我不说复杂指令

### 交互三，修复黑屏：

> 目前进入游戏黑屏，什么都没显示

```
问题可能出在游戏循环和初始化的时序上。在 Main 类中，我们需要确保游戏循环在构造函数中就开始运行，只是在健康忠告显示期间不更新玩家状态。以下是修复建议：
主要修改点：
在构造函数中添加了 init() 方法的调用，确保游戏循环立即开始。
将游戏循环逻辑从 startGame 移到了构造函数中。
在 update 和 render 方法中添加了条件判断，只有在健康忠告确认后才更新和渲染玩家、子弹和敌机。
移除了重复的游戏循环代码。
这样修改后，游戏应该能够正常显示背景和健康忠告提示，但玩家飞机和敌机会在用户确认健康忠告后才开始活动。
```

### 交互四：还没开始就完成第一关提示

应该是遇到逻辑bug，我继续提示他目前问题

> 目前有bug，进入游戏他就提示我关卡一已经完成，其实我还没开始

```
这个问题是因为在游戏初始化时就开始检查关卡完成状态了。我们需要修改 checkLevelCompletion 方法，确保只有在健康忠告确认后才开始检查关卡完成状态。
主要修改点：
在 update 方法中，将 checkLevelCompletion 的调用移到了健康忠告确认后的逻辑块中。
在 checkLevelCompletion 方法中添加了对 showHealthAdviceFlag 的检查，确保只有在健康忠告确认后才检查关卡完成状态。
这样修改后，游戏应该只会在玩家确认健康忠告并开始游戏后才会检查关卡完成状态。
```

### 交互五：点击开始画面卡住，飞机不下来

![WechatIMG5897.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/2203866556.jpg)

> 目前尽量提示对了，但点击提示，他游戏画面暂停了，也没有敌机出来

```
问题出在 Main 类中的游戏初始化和开始逻辑。当点击健康忠告时，我们需要正确地开始游戏循环并生成敌机。以下是修复后的代码：
主要修改点：
在 start 方法中确保游戏循环继续运行。
在 enemyGenerate 方法中先清空现有敌机数组。
确保在点击健康忠告后正确调用 startLevel 方法。
移除了 cancelAnimationFrame 的调用，避免游戏循环被意外停止。
这些修改应该能解决游戏画面暂停和敌机不出现的问题。游戏现在应该能在点击健康忠告后正常开始，并显示敌机。
```

## 交互六：之前点击文字开始事件不对

> 目前点击了开始游戏，没有反应反而是点击文字，开始了游戏

```
这是因为点击区域的判断有问题。在 touchEventHandler 方法中，我们需要修改健康忠告按钮的点击区域判断，使其与游戏结束时的重启按钮区域判断保持一致。以下是修复后的代码：
```

然后就达到了，最终上面效果，虽然有些错误，这里调整下坐标，最终效果

![Xnip2024-11-11_17-54-57.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/2782301238.jpg)

我们看下核心代码：

```

  // 弹窗绘制
  drawHealthAdvice(ctx) {
    this.drawHealthAdviceBackground(ctx);
    this.drawHealthAdviceText(ctx);
    this.drawHealthAdviceButton(ctx);
  }

  drawHealthAdviceBackground(ctx) {
    ctx.drawImage(
      atlas, // 图像源
      270, // 源图像的x坐标
      120, // 源图像的y坐标
      119, // 源图像的宽度
      108, // 源图像的高度
      SCREEN_WIDTH / 2 - 150, // 目标图像的x坐标
      SCREEN_HEIGHT / 2 - 100, // 目标图像的y坐标
      300, // 目标图像的宽度
      300 // 目标图像的高度
    );
  }

  drawHealthAdviceText(ctx) {
    this.setFont(ctx);

    // 绘制标题
    ctx.fillText(
      '健康游戏忠告',
      SCREEN_WIDTH / 2 - 60,
      SCREEN_HEIGHT / 2 - 100 + 50
    );

    // 绘制忠告内容
    ctx.fillText(
      '健康游戏，快乐生活。',
      SCREEN_WIDTH / 2 - 80,
      SCREEN_HEIGHT / 2 - 100 + 90+8
    );
    ctx.fillText(
      '合理安排时间，享受游戏乐趣', // 文本内容
      SCREEN_WIDTH / 2 - 160+24, // x坐标，调整以居中
      SCREEN_HEIGHT / 2 - 100 + 120+8 // y坐标，调整以居中
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
```

通过以上步骤和代码，我们成功地将原始的黑屏提示升级为一个具有游戏风格的提示窗口，提升了用户的首次体验感受。希望这些信息对你有所帮助，如果你有任何疑问或者需要进一步的帮助，请随时提问！