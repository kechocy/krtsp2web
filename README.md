
本项目是 [rtsp2web](https://github.com/Neveryu/rtsp2web) 去掉水印后的版本

**本项目依赖 [ffmpeg](https://ffmpeg.org/download.html#build-windows)** 

## 介绍

本项目是一个提供在 web 页面中可以直接播放 rtsp、rtmp 视频流解决方案的工具；简单、高效、快捷、安全。


使用 rtsp2web 后，前端代码中可以使用 jsmpeg.js 或者 flv.js 来进行视频流的直接播放。

## 启动
```
git clone https://github.com/kechocy/krtsp2web.git
cd krtsp2web
npm run dev
```

主要配置参见 `main.js`

```javascript
const RTSP2web = require('rtsp2web')

// 服务端长连接占据的端口号；你也可以不传，默认是：9999
let port = 9999
// 创建一个RTSP2web服务实例出来
new RTSP2web({
  port,
  audio: false
})
```

`rtsp2web` 默认自动转码音频并输出，你也可以根据配置设置，选择禁止音频输出。

> 如果允许音频输出，根据浏览器规则，需要用户点击页面任意地方。



更多参数说明：

| 参数      |      解释说明    |
| :-----------: | :-----------------: |
|     port      |  转码推流服务占用的端口号；（type：Number）<br/>可以不传；默认值：9999        |
|     path      |   FFmpeg 命令在你机器上的启动名称，(type: String) <br/> 不传即从系统环境变量中寻找；默认值：'ffmpeg'     |
|     audio     |  默认不传，有声音；默认值：true；即：输出音频。<br/>如果想禁止输出音频，可以配置 audio: false    |
|   freeTime    |   任一视频流空闲(未被使用)时间超过这个值，就会停止该视频流的转码，释放机器资源（type: Number；单位：秒） <br/> 一般情况下可不传；默认值：20           |
|   checkTime   |   检测视频空闲的时间间隔（type: Number；单位：秒） <br/> 一般情况下可不传；默认值：10 |
|       q       |  视频质量；取值范围：0-1000；数字越小，视频越清晰，带宽消耗越大<br/> 默认值：8  |
| transportType | 设置 RTSP 传输协议，默认值：无<br/>可选值：['tcp', 'udp', 'udp_multicast', 'http', 'https']<br/>ps: 这里默认值是无，也就是 rtsp2web 会自动选择一种传输协议；但是，并不能保证一定成功，这个时候，rtsp2web 日志会打印错误信息或者长时间的等待，这个时候就需要你手动来配置这个参数了，`'tcp'`、`'udp'` 是最常见的选择；详情可以参阅文档最后的【常见问题解决办法】 |
|   webplayer   |  设置前端播放器（视频流转码器），默认不传，默认值：'jsmpeg'<br/>可选值：['jsmpeg', 'flv']；如果设置为 `flv`，那么前端页面请使用 `flv.js` 播放器，详情请参考下面 `flv.js` 小节了解详细的使用方法   |
|      wss      |    配置 wss；配置格式如下：<br/> `wss: {key: 'keyPath', cert: 'certPath'}` <br/>如果你是 pfx 的证书，那么配置格式如下：<br/>`wss: {pfx: 'pfxPath', passphrase: 'passphrasePath'}`<br/>如果你想使用`wss`的话请配置这个选项，否则不要使用这个配置。  |
---


## 前端

如果你想在前端代码中使用 `jsmpeg.js` 来播放视频的话，你可以按如下操作（更多参考 `example\index.html`）：

在前端代码中引入 `jsmpeg.js`，并创建一个 `canvas` 标签节点，然后初始化并播放：

```html
<script src="./jsmpeg.min.js" charset="utf-8"></script>

<canvas id="canvas" style="width: 400px"></canvas>

<script>

    window.onload = () => {
      // 将rtsp视频流地址进行btoa处理一下
      new JSMpeg.Player('ws://localhost:9999/rtsp?url=' + btoa(rtsp), {
        canvas: document.getElementById('canvas')
      })
    //   // 将rtsp视频流地址进行btoa处理一下，还可以加一点参数
    //   new JSMpeg.Player(
    //     'ws://localhost:9999/rtsp?url=' +
    //       btoa(rtsp) + '&brightness=0.2&saturation=1.8',
    //     {
    //       canvas: document.getElementById('canvas')
    //     }
    //   )
    }
  </script>
```

如上所示，在调用 `new JSMpeg.Player()` 时，第一个参数是接口地址拼接上 `rtsp` 地址，我们还可以使用 `url` 传参的方式传递更多的高阶参数。

更多参数说明：

|    参数    |    解释说明   |
| :--------: | :-----------: |
|     -s     |  视频分辨率大小，不传即表示与源视频大小一致<br> 传值示例： 1920x1080、1280x720、640x360 <br> 降低分辨率会降低清晰度  |
|    -b:v    | 释义：码率，默认可以不设置，那就是使用源码率<br>传值示例：2000k、100k、1k<br>码率调小，这样其实也间接让文件变小了<br>码率调小，画质有可能会降低  |
|   scale    | 缩放；间接的，也能调整视频的分辨率；<br> 默认值： -1:-1；即与视频源大小保持一致；<br>功能与 -s 参数相似；但是可以只传一个宽度或者高度，另一个参数用 -1 表示<br>如： 1280:-1、-1:360，视频将会自适应显示<br>降低分辨率会降低清晰度 |
|   vcodec   | 释义：视频编解码方式；<br>请确保你了解该参数的意义，默认可以不传  |
|  contrast  |  释义：对比度，亮的地方更亮，暗的地方更暗。<br>取值范围[-100.0, 100.0]，默认值为 0。建议不调整，或者在[-2.0, 2.0]范围内进行小的调整   |
| brightness | 释义：亮度，如果觉得视频有点暗，可以进行小的调整。<br>取值范围： [-1.0, 1.0]，默认值为 0。  |
| saturation | 释义：饱和度，也就是说色彩更鲜艳，绿色更绿，蓝色更蓝...；<br>取值范围：[0, 3.0]，默认值为 1。   |
|   gamma    |   释义：关于显示器/视频的一个专业参数；<br>取值范围：0.1-10.0，默认值为 1。<br>这个参数很专业，建议不传，不修改。 |
---

<br/>

如果你想在前端代码中使用 `flv.js` 来播放视频的话，你可以按如下操作（更多参考 `example\index-flv.html`）：

1、在 `main.js` 中，增加配置项 `webplayer: 'flv'`

```js
// main.js
const RTSP2web = require('rtsp2web')
// 服务端长连接占据的端口号
let port = 9999
new RTSP2web({
  port,
  audio: false,
  webplayer: 'flv'
})
```

2、在前端代码中引入 `flv.js`，并创建一个 `video` 标签节点，然后初始化 `flv` 并播放

```html

<script src="./flv.min.js" charset="utf-8"></script>

<video
  id="flv-1"
  height="500"
  muted
  style="border: thin solid green"
  controls
  loop
></video>

<script>
  // console.log('flvjs 是否支持：', flvjs.isSupported())

  if (flvjs.isSupported()) {
    var videoElement = document.getElementById('flv-1')
    var flvPlayer = flvjs.createPlayer({
      isLive: true,
      type: 'flv',
      url: 'ws://localhost:8098/rtsp?url=' + btoa(rtsp),
      enableWorker: true,
      enableStashBuffer: false,
      stashInitialSize: 128 // 减少首桢显示等待时长
    })
    flvPlayer.attachMediaElement(videoElement)
    try {
      flvPlayer.load()
      flvPlayer.play()
      // flvPlayer.pause()
    } catch (err) {
      // not do something
    }
  }
</script>
```

## 常见问题

### 1.模式转换失败 / 进程退出，请检查 ffmpeg 参数... / 长时间等待画面... / 其它等等问题

如果出现了这之类的提示，大多数情况下，你可能需要尝试配置 `transportType` 为其他值试试，`'tcp'`, `'udp'`是最常见的选择。

> PS: 在正常的操作下遇到视频流无法播放，或者 `rtsp2web` 提示错误信息的情况下，优先选择使用这条解决办法来尝试解决问题。

### 2.ffmpeg 进程关闭了，code：3221225477

如果出现了 `3221225477`；这是 NodeJS 内核反馈的违反了访问规定的问题，一般这个问题只发生在 `windows` 平台上。据我所知，这似乎是与 Windows 访问冲突相关的错误。可以尝试的操作有：

- 1、执行 `npm cache verify`，然后再试试；
- 2、清除 `npm` 缓存：`npm cache clean --force`，再试试；
- 3、升级更新 `nodejs`，安装稳定版，再试试；
- 4、`rm -rf node_modules`，`delete package-lock.json`，重新安装，再试试；
- 5、切换合适的 `node` 版本可解决；切换当前 `node` 版本可解决这个问题。
- 6、也可以参考【办法一】来尝试解决这类问题；


## 打包

打包成 windows 平台可执行文件，主要配置详见 `package.json`

```
npm install -g pkg

npm run pkg
```

打包完成输出文件到 `dist\krtsp2web.exe`，请从命令行启动。

打包过程中可能出现的问题：


> Fetching base Node.js binaries to PKG_CACHE_PATH <br/>
> fetched-v18.5.0-win-x64  &emsp;   [ &emsp;&emsp; ] 0%> Not found in remote cache: <br/>
> {"tag":"v3.4","name":"node-v18.5.0-win-x64"} <br/>
> Building base binary from source: <br/>
> built-v18.5.0-win-x64 <br/>
> Fetching Node.js source archive from nodejs.org... <br/>
> Error! AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

自动下载文件失败，可以手动去[下载](https://github.com/vercel/pkg-fetch/releases)，并放入`C:\Users\{{ username }}\.pkg-cache\{{ tag }}\{{ fetched-name }}`，例如：`C:\Users\admin\.pkg-cache\v3.4\fetched-v18.5.0-win-x64`