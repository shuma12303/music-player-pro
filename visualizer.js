/**
 * 音频可视化模块 - visualizer.js
 * 功能：使用 Web Audio API 和 Canvas 实现实时频谱动画
 */

class AudioVisualizer {
    constructor(options = {}) {
        this.audio = options.audio;
        this.canvas = options.canvas || document.getElementById('visualizerCanvas');
        this.container = options.container || this.canvas?.parentElement;
        
        // 配置项
        this.barCount = options.barCount || 64; // 频谱柱数量
        this.barColor = options.barColor || 'rgba(255, 255, 255, 0.8)';
        this.barGap = options.barGap || 2;
        this.smoothing = options.smoothing || 0.8; // 平滑度 0-1
        this.minHeight = options.minHeight || 2;
        
        // 状态
        this.isInitialized = false;
        this.isPlaying = false;
        this.animationId = null;
        
        // Web Audio API 节点
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        
        this.init();
    }

    /**
     * 初始化可视化器
     */
    init() {
        if (!this.canvas || !this.audio) {
            console.warn('Canvas 或 Audio 元素未找到');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 监听音频播放状态
        this.audio.addEventListener('play', () => this.start());
        this.audio.addEventListener('pause', () => this.stop());
        this.audio.addEventListener('ended', () => this.stop());
    }

    /**
     * 调整 Canvas 大小以适应容器
     */
    resizeCanvas() {
        if (!this.canvas || !this.container) return;

        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
        // 缩放上下文以适配高分辨率屏幕
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    /**
     * 初始化 Web Audio API
     */
    initAudioContext() {
        if (this.isInitialized) return;

        try {
            // 创建音频上下文
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 创建分析器节点
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256; // FFT 大小，影响频谱精度
            this.analyser.smoothingTimeConstant = this.smoothing;
            
            // 创建音频源节点
            this.source = this.audioContext.createMediaElementSource(this.audio);
            
            // 连接节点：audio -> analyser -> destination
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // 创建数据数组
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            this.isInitialized = true;
            console.log('Audio Visualizer 初始化成功');
        } catch (error) {
            console.error('Audio Context 初始化失败:', error);
        }
    }

    /**
     * 开始可视化
     */
    start() {
        if (!this.isInitialized) {
            this.initAudioContext();
        }

        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        this.render();
    }

    /**
     * 停止可视化
     */
    stop() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        // 清空画布，显示静态效果
        this.renderIdle();
    }

    /**
     * 渲染频谱动画（主循环）
     */
    render() {
        if (!this.isPlaying || !this.analyser) return;

        this.animationId = requestAnimationFrame(() => this.render());

        // 获取频域数据
        this.analyser.getByteFrequencyData(this.dataArray);

        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制频谱柱
        this.drawBars();
    }

    /**
     * 绘制频谱柱
     */
    drawBars() {
        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;
        
        const barWidth = (width - (this.barCount - 1) * this.barGap) / this.barCount;
        
        let x = 0;

        for (let i = 0; i < this.barCount; i++) {
            // 将频率数据映射到柱子数量
            const dataIndex = Math.floor(i * this.dataArray.length / this.barCount);
            const value = this.dataArray[dataIndex];
            
            // 计算柱子高度（0-255 映射到 0-height）
            const barHeight = Math.max(
                (value / 255) * height * 0.8,
                this.minHeight
            );

            // 渐变色（从底部到顶部）
            const gradient = this.ctx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');   // 底部：紫色
            gradient.addColorStop(0.5, 'rgba(118, 75, 162, 0.8)');  // 中间
            gradient.addColorStop(1, 'rgba(240, 147, 251, 0.9)');   // 顶部：粉色

            // 绘制柱子
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                x,
                height - barHeight,
                barWidth,
                barHeight
            );

            // 可选：添加发光效果
            if (value > 150) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = 'rgba(240, 147, 251, 0.6)';
            } else {
                this.ctx.shadowBlur = 0;
            }

            x += barWidth + this.barGap;
        }
    }

    /**
     * 绘制静态（暂停）状态
     */
    renderIdle() {
        if (!this.ctx) return;

        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = (width - (this.barCount - 1) * this.barGap) / this.barCount;
        let x = 0;

        // 绘制随机高度的静态柱子
        for (let i = 0; i < this.barCount; i++) {
            const barHeight = this.minHeight + Math.random() * 10;

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fillRect(
                x,
                height - barHeight,
                barWidth,
                barHeight
            );

            x += barWidth + this.barGap;
        }
    }

    /**
     * 切换可视化样式
     * @param {string} style - 'bars' | 'wave' | 'circle'
     */
    setStyle(style) {
        this.style = style;
        // 可扩展不同的可视化样式
    }

    /**
     * 设置颜色主题
     * @param {string} color - CSS 颜色值
     */
    setColor(color) {
        this.barColor = color;
    }

    /**
     * 销毁可视化器
     */
    destroy() {
        this.stop();
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// ==================== 使用示例 ====================
/*
// 在 HTML 中添加：
<div class="visualizer-container">
    <canvas id="visualizerCanvas"></canvas>
</div>

// 在 JavaScript 中：
const audio = document.querySelector('audio');
const visualizer = new AudioVisualizer({
    audio: audio,
    canvas: document.getElementById('visualizerCanvas'),
    barCount: 64,
    smoothing: 0.8
});

// 音频播放时会自动开始可视化
*/

// ==================== CSS 样式（需添加到 HTML 中） ====================
const visualizerStyles = `
<style>
/* 可视化器容器 */
.visualizer-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
}

#visualizerCanvas {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.6;
}

/* 或者作为背景使用 */
.visualizer-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
}

.visualizer-background canvas {
    width: 100%;
    height: 100%;
    opacity: 0.3;
    filter: blur(2px);
}

/* 确保其他内容在可视化器之上 */
.player-card {
    position: relative;
    z-index: 1;
}
</style>
`;

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioVisualizer;
}
