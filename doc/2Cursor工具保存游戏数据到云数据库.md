# 零游戏基础Cursor制作你人生中的第一款手游(2)Cursor工具保存游戏数据到云数据库

想发布一款游戏， 因为没有游戏编程经验，找个Demo直接提交给微信审核就可以上线，不想游戏上线有些复杂。



下载开发工具

下载地址：

https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

![main.0e6611d0.png](https://www.cctvcloud.cn/usr/uploads/2024/11/180592763.png)



本来计划把官方Demo 飞机大战直接提交微信审核，微信答复游戏太简单，无非通过审核。



因为小游戏名称已经取名飞机大战，也没机会改了，也只能根据官方的Demo扩展各种功能继续开发了，看能否上线，因为有Cursor ，编程方面不用太担心。 当然这里还有特别重要的一点是，每做一个新功能，用Git记录下来，这样AI改错了，也好回退，当出现一个稳定版本，我们就Git提交



既然已经决定加功能，做复杂，就先实现一个记录每个玩家的成绩吧

## Cursor介绍

**Cursor AI编辑器**是一款基于人工智能的文本编辑器，旨在通过智能化的功能提升用户的编辑效率。它具有以下特点：

1. **智能语法检查**：自动检测和修正语法错误，提高文档质量。
2. **内容生成**：根据用户输入的主题，生成相关内容，帮助用户快速完成写作任务。
3. **语言翻译**：支持多语言翻译，方便用户处理不同语言的文档。
4. **自动完成**：根据上下文预测并自动完成用户的输入，减少重复劳动。
5. 等等。。。



简单理解，Cursor 是一个万能的编程软件，市面上的主流语言没有他不会的，只需要口语化说明你的需求，他就能生成对应的代码。



### 下载Cursor 



进入官网，点击Download

- 根据你的操作系统（Windows、macOS、Linux）选择相应的版本。

![Xnip2024-11-07_16-23-31.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/2126848868.jpg)



###  安装 `Cursor`

#### Windows

1. **运行安装包**：
   - 双击下载的 `.exe` 文件，启动安装程序。
   - 按照安装向导的提示完成安装。
2. **启动 `Cursor`**：
   - 安装完成后，你可以在开始菜单或桌面上找到 `Cursor` 的快捷方式，点击启动。

#### macOS

1. **运行安装包**：
   - 双击下载的 `.dmg` 文件，将 `Cursor` 拖动到应用程序文件夹中。
2. **启动 `Cursor`**：
   - 打开 Launchpad，找到 `Cursor` 图标，点击启动。



我们先给游戏加用户登录注册，以及记录每局游戏成绩的功能。

直接Cursor打开代码,快捷键command+I打开composer

> 这是微信示例打飞机游戏，帮忙引入Bmob sdk，打开游戏执行auth登录函数



![Xnip2024-11-07_17-10-45.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/2981988240.jpg)

composer 可以理解为全局修改代码，他会阅读你整个项目代码，在合适的位置插入你的需求。

除了这个还有另外2个，一个我称之为块级修改，一个我称为文件级修改

项目级：**command+I**  ，直接提要求，自动给项目里面写代码（对新手最友好）

文件级：**command+L**， 修改某个文件里面的代码

块级别：**command+K**   ，修改某一块代码

虽然command+I 是最强大的，无视逻辑，无视文件，随便提问题，他基本都能写好代码， 但这里颗粒度越细，精度也就越高，所以我们等熟悉项目结构了，尽量用小颗粒级别。

具体每个的详细说明，后面如果出Cursor详细教程，再写给大家，给出各种示例区别，我们这次核心就是上线这个飞机大战游戏



这里可以看到他引入了一个sdk，然后初始化，然后执行一键登录

后端平台操作：注册Bmob创建一个应用，填写小程序id，秘钥



这里我们把sdk文件放到目录下，sdk下载

https://github.com/bmob/hydrogen-js-sdk/tree/master/dist

这里我们下载[Bmob-1.7.1.min.js](https://github.com/bmob/hydrogen-js-sdk/blob/master/dist/Bmob-1.7.1.min.js)



```
Bmob.initialize("xxx", "xxxx"); *// 请根据实际情况替换*
```

   

![Xnip2024-11-07_18-02-14.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/3001829252.jpg)



我们去控制台看下

![Xnip2024-11-07_18-03-39.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/1055987069.jpg)



可以看到，很简单就实现了用户openid写入到表中



第二步：我们实现把每次成绩写写入到表中

继续command+I：对AI说

> 我想把游戏成绩保存到Bmob，这个是保存语法

```
const query = Bmob.Query('tableName');
query.set("name","Bmob")
query.set("cover","后端云")
query.save().then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```



![Xnip2024-11-08_10-02-51.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/1224509975.jpg)



可以看到他不但写好了代码，还增加了中文注释。

我们运行看下表里效果

![Xnip2024-11-08_10-08-30.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/1608134055.jpg)

这样就实现了每个用户进来，他的用户信息保存在用户表，游戏成绩都保存到表里。

项目代码实时提交源码地址：https://github.com/magic007/PlaneBattleMiniGame


![Xnip2024-11-08_10-10-08.jpg](https://www.cctvcloud.cn/usr/uploads/2024/11/2885448294.jpg)

经过2天，微信的审核结果出来，说游戏内容太简单，让增加背景，关卡。 看来微信官方这个Demo还是还简单， 我们下一章节让AI 写关卡功能加背景切换。