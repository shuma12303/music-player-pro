/**
 * ========================================
 * 高级音乐播放器 Pro - 音频频谱可视化
 * ========================================
 * 功能：基于 Web Audio API 实现实时音频频谱动画
 * 作者：数码解码
 * ========================================
 */

class AudioVisualizer {
    constructor(audioElement, canvasSelector = '#visualizerCanvas') {
        this.audio = audioElement;
        this.canvas = document.querySelector(canvasSelector);
        
        if (!this.canvas) {
            console.warn('[数码解码 可视化系统] 未找到 Canvas 元素');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.isPlaying = false;
        this.animationId = null;

        // Web Audio API 组件
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;

        // 配置参数
        this.config = {
            fftSize: 256,           // FFT 采样大小
            smoothing: 0.8,         // 平滑度 (0-1)
            barCount: 64,           // 频谱柱数量
            barGap: 2,              // 柱间距
            minHeight: 2,           // 最小高度
            colors: {
                primary: 'rgba(102, 126, 234, 0.8)',    // 主色
                secondary: 'rgba(118, 75, 162, 0.6)',   // 辅色
                glow: 'rgba(255, 255, 255, 0.3)'        // 光晕
            }
        };

        this.init();
    }

    /**
     * 初始化 Web Audio API
     */
    init() {
        try {
            // 创建音频上下文
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.config.fftSize;
            this.analyser.smoothingTimeConstant = this.config.smoothing;

            // 创建音频源节点
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            // 创建数据数组
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            // 监听窗口大小变化
            window.addEventListener('resize', () => this.resizeCanvas());
            this.resizeCanvas();

            console.log('[数码解码 可视化系统] 音频分析器初始化成功');
        } catch (error) {
            console.error('[数码解码 可视化系统] 初始化失败:', error);
        }
    }

    /**
     * 调整 Canvas 尺寸
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }

    /**
     * 开始可视化
     */
    start() {
        if (!this.analyser || this.isPlaying) return;
        
        this.isPlaying = true;
        
        // 恢复音频上下文（某些浏览器需要）
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.draw();
        console.log('[数码解码 可视化系统] 已启动');
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
        this.clear();
        console.log('[数码解码 可视化系统] 已停止');
    }

    /**
     * 清空画布
     */
    clear() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 绘制频谱（核心渲染函数）
     */
    draw() {
        if (!this.isPlaying) return;

        this.animationId = requestAnimationFrame(() => this.draw());

        // 获取频率数据
        this.analyser.getByteFrequencyData(this.dataArray);

        // 清空画布
        this.clear();

        const width = this.canvas.width;
        const height = this.canvas.height;
        const barCount = this.config.barCount;
        const barWidth = (width / barCount) - this.config.barGap;

        // 绘制频谱柱
        for (let i = 0; i < barCount; i++) {
            // 从频率数据中采样
            const dataIndex = Math.floor(i * this.dataArray.length / barCount);
            const value = this.dataArray[dataIndex];
            
            // 计算柱高度（响应式缩放）
            const barHeight = Math.max(
                (value / 255) * height * 0.8,
                this.config.minHeight
            );

            const x = i * (barWidth + this.config.barGap);
            const y = height - barHeight;

            // 创建渐变色
            const gradient = this.ctx.createLinearGradient(x, y, x, height);
            gradient.addColorStop(0, this.config.colors.primary);
            gradient.addColorStop(0.5, this.config.colors.secondary);
            gradient.addColorStop(1, this.config.colors.primary);

            // 绘制柱体
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, barWidth, barHeight);

            // 添加顶部光晕效果
            if (value > 50) {
                this.ctx.fillStyle = this.config.colors.glow;
                this.ctx.fillRect(x, y - 2, barWidth, 2);
            }
        }

        // 绘制品牌水印
        this.drawWatermark();
    }

    /**
     * 绘制水印 "数码解码"
     */
    drawWatermark() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('数码解码', this.canvas.width - 10, this.canvas.height - 10);
        this.ctx.restore();
    }

    /**
     * 切换可视化模式（可扩展）
     * @param {string} mode - 'bars' | 'wave' | 'circle'
     */
    setMode(mode = 'bars') {
        this.mode = mode;
        console.log(`[数码解码 可视化系统] 切换到 ${mode} 模式`);
    }

    /**
     * 更新配置
     * @param {object} newConfig - 新的配置对象
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (newConfig.fftSize) {
            this.analyser.fftSize = newConfig.fftSize;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        }
    }
}

// 全局暴露
window.AudioVisualizer = AudioVisualizer;
