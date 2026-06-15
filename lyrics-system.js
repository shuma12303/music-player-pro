/**
 * ========================================
 * 高级音乐播放器 Pro - 歌词同步系统
 * ========================================
 * 功能：解析 LRC 格式歌词，实现动态高亮与平滑滚动
 * 作者：数码解码
 * ========================================
 */

class LyricsSystem {
    constructor(audioElement, containerSelector = '#lyricsContainer') {
        this.audio = audioElement;
        this.container = document.querySelector(containerSelector);
        this.lyrics = [];
        this.currentLine = -1;
        this.isEnabled = false;

        if (!this.container) {
            console.warn('[数码解码 歌词系统] 未找到歌词容器，歌词功能已禁用');
        }
    }

    /**
     * 解析 LRC 格式歌词字符串
     * @param {string} lrcString - LRC 格式的歌词文本
     * @returns {Array} 解析后的歌词数组 [{time, text}]
     */
    parseLRC(lrcString) {
        if (!lrcString || typeof lrcString !== 'string') {
            return [];
        }

        const lines = lrcString.split('\n');
        const parsed = [];
        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            let match;
            const times = [];
            
            // 提取所有时间标签
            while ((match = timeRegex.exec(line)) !== null) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const milliseconds = parseInt(match[3].padEnd(3, '0'));
                const time = minutes * 60 + seconds + milliseconds / 1000;
                times.push(time);
            }

            // 提取歌词文本（去除时间标签）
            const text = line.replace(/\[.*?\]/g, '').trim();

            // 为每个时间点创建歌词对象（支持一句歌词多个时间点）
            times.forEach(time => {
                parsed.push({ time, text });
            });
        });

        // 按时间排序
        parsed.sort((a, b) => a.time - b.time);
        
        console.log(`[数码解码 歌词系统] 成功解析 ${parsed.length} 行歌词`);
        return parsed;
    }

    /**
     * 加载歌词（从 data.js 的歌曲对象）
     * @param {string} lrcString - LRC 格式歌词
     */
    loadLyrics(lrcString) {
        this.lyrics = this.parseLRC(lrcString);
        this.currentLine = -1;
        this.isEnabled = this.lyrics.length > 0;

        if (this.container) {
            this.renderLyrics();
        }
    }

    /**
     * 渲染歌词到 DOM
     */
    renderLyrics() {
        if (!this.container) return;

        if (this.lyrics.length === 0) {
            this.container.innerHTML = `
                <div class="lyrics-empty">
                    <span style="opacity: 0.5;">🎵 暂无歌词</span>
                    <div style="margin-top: 10px; font-size: 12px; opacity: 0.3;">
                        Powered by 数码解码
                    </div>
                </div>
            `;
            return;
        }

        const html = this.lyrics.map((line, index) => `
            <div class="lyric-line" data-index="${index}" data-time="${line.time}">
                ${this.escapeHtml(line.text || '♪')}
            </div>
        `).join('');

        this.container.innerHTML = html;
    }

    /**
     * 更新歌词高亮（在 timeupdate 事件中调用）
     */
    update() {
        if (!this.isEnabled || !this.container) return;

        const currentTime = this.audio.currentTime;
        let newLine = -1;

        // 查找当前应该高亮的歌词行
        for (let i = 0; i < this.lyrics.length; i++) {
            if (currentTime >= this.lyrics[i].time) {
                newLine = i;
            } else {
                break;
            }
        }

        // 如果行号变化，更新高亮
        if (newLine !== this.currentLine) {
            this.currentLine = newLine;
            this.highlightLine(newLine);
        }
    }

    /**
     * 高亮指定行并平滑滚动
     * @param {number} index - 歌词行索引
     */
    highlightLine(index) {
        if (!this.container) return;

        const lines = this.container.querySelectorAll('.lyric-line');
        
        // 移除所有高亮
        lines.forEach(line => line.classList.remove('active'));

        // 高亮当前行
        if (index >= 0 && index < lines.length) {
            const activeLine = lines[index];
            activeLine.classList.add('active');

            // 平滑滚动到中间位置
            const containerHeight = this.container.clientHeight;
            const lineTop = activeLine.offsetTop;
            const lineHeight = activeLine.clientHeight;
            const scrollTo = lineTop - (containerHeight / 2) + (lineHeight / 2);

            this.container.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
        }
    }

    /**
     * 清空歌词
     */
    clear() {
        this.lyrics = [];
        this.currentLine = -1;
        this.isEnabled = false;
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * HTML 转义（防 XSS）
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 手动跳转到指定歌词行（点击歌词时调用）
     * @param {number} index - 歌词行索引
     */
    seekToLine(index) {
        if (index >= 0 && index < this.lyrics.length) {
            this.audio.currentTime = this.lyrics[index].time;
        }
    }
}

// 全局暴露
window.LyricsSystem = LyricsSystem;
