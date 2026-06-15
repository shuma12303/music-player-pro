/**
 * 歌词同步模块 - lyrics.js
 * 功能：解析 LRC 格式歌词，实时同步显示和滚动
 */

class LyricsManager {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('lyricsContainer');
        this.audio = options.audio;
        this.lyrics = [];
        this.currentLineIndex = -1;
        this.offset = options.offset || 0; // 时间偏移（毫秒）
        
        this.init();
    }

    /**
     * 初始化歌词容器
     */
    init() {
        if (!this.container) {
            console.warn('歌词容器未找到，请在 HTML 中添加 <div id="lyricsContainer"></div>');
            return;
        }

        // 监听音频播放进度
        if (this.audio) {
            this.audio.addEventListener('timeupdate', () => this.updateLyrics());
        }
    }

    /**
     * 解析 LRC 格式歌词字符串
     * @param {string} lrcString - LRC 格式的歌词文本
     * @returns {Array} 解析后的歌词数组 [{time: 秒数, text: 歌词文本}]
     * 
     * LRC 格式示例：
     * [00:12.00]第一行歌词
     * [00:17.20]第二行歌词
     * [ar:歌手名]
     * [ti:歌曲名]
     */
    parseLRC(lrcString) {
        if (!lrcString) return [];

        const lines = lrcString.split('\n');
        const lyrics = [];
        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            // 跳过元数据标签（如 [ar:] [ti:] 等）
            if (line.match(/^\[[a-z]+:/i)) return;

            // 提取所有时间标签
            const times = [];
            let match;
            while ((match = timeRegex.exec(line)) !== null) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const milliseconds = parseInt(match[3].padEnd(3, '0'));
                const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
                times.push(totalSeconds);
            }

            // 提取歌词文本（去掉时间标签）
            const text = line.replace(timeRegex, '').trim();

            // 同一句歌词可能有多个时间点（重复部分）
            times.forEach(time => {
                lyrics.push({
                    time: time + this.offset / 1000,
                    text: text || '♪'  // 空行显示音符
                });
            });
        });

        // 按时间排序
        lyrics.sort((a, b) => a.time - b.time);

        return lyrics;
    }

    /**
     * 加载歌词
     * @param {string} lrcString - LRC 格式字符串
     */
    loadLyrics(lrcString) {
        this.lyrics = this.parseLRC(lrcString);
        this.currentLineIndex = -1;
        this.renderLyrics();
    }

    /**
     * 渲染歌词到容器
     */
    renderLyrics() {
        if (!this.container) return;

        if (this.lyrics.length === 0) {
            this.container.innerHTML = '<div class="lyrics-empty">暂无歌词</div>';
            return;
        }

        const html = this.lyrics.map((line, index) => `
            <div class="lyrics-line" data-index="${index}" data-time="${line.time}">
                ${this.escapeHtml(line.text)}
            </div>
        `).join('');

        this.container.innerHTML = html;
    }

    /**
     * 更新歌词高亮和滚动
     */
    updateLyrics() {
        if (!this.audio || this.lyrics.length === 0) return;

        const currentTime = this.audio.currentTime;

        // 查找当前应该高亮的歌词行
        let newIndex = -1;
        for (let i = this.lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= this.lyrics[i].time) {
                newIndex = i;
                break;
            }
        }

        // 如果索引改变，更新高亮和滚动
        if (newIndex !== this.currentLineIndex) {
            this.currentLineIndex = newIndex;
            this.highlightLine(newIndex);
            this.scrollToLine(newIndex);
        }
    }

    /**
     * 高亮指定行
     * @param {number} index - 歌词行索引
     */
    highlightLine(index) {
        if (!this.container) return;

        // 移除所有高亮
        this.container.querySelectorAll('.lyrics-line').forEach(line => {
            line.classList.remove('active', 'passed');
        });

        if (index < 0) return;

        // 添加当前高亮
        const lines = this.container.querySelectorAll('.lyrics-line');
        if (lines[index]) {
            lines[index].classList.add('active');
        }

        // 标记已经唱过的歌词
        for (let i = 0; i < index; i++) {
            if (lines[i]) {
                lines[i].classList.add('passed');
            }
        }
    }

    /**
     * 平滑滚动到指定行，使其居中
     * @param {number} index - 歌词行索引
     */
    scrollToLine(index) {
        if (!this.container || index < 0) return;

        const lines = this.container.querySelectorAll('.lyrics-line');
        const targetLine = lines[index];

        if (!targetLine) return;

        const containerHeight = this.container.clientHeight;
        const lineHeight = targetLine.clientHeight;
        const lineOffsetTop = targetLine.offsetTop;

        // 计算滚动位置，使歌词居中
        const scrollTop = lineOffsetTop - containerHeight / 2 + lineHeight / 2;

        // 平滑滚动
        this.container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }

    /**
     * 手动跳转到指定时间的歌词
     * @param {number} time - 时间（秒）
     */
    seekToTime(time) {
        if (!this.audio) return;
        this.audio.currentTime = time;
    }

    /**
     * 点击歌词行跳转播放
     */
    enableClickSeek() {
        if (!this.container) return;

        this.container.addEventListener('click', (e) => {
            const line = e.target.closest('.lyrics-line');
            if (line) {
                const time = parseFloat(line.dataset.time);
                if (!isNaN(time)) {
                    this.seekToTime(time);
                }
            }
        });
    }

    /**
     * 清空歌词
     */
    clear() {
        this.lyrics = [];
        this.currentLineIndex = -1;
        if (this.container) {
            this.container.innerHTML = '<div class="lyrics-empty">暂无歌词</div>';
        }
    }

    /**
     * 设置时间偏移
     * @param {number} offset - 偏移量（毫秒）
     */
    setOffset(offset) {
        this.offset = offset;
        if (this.lyrics.length > 0) {
            // 重新计算所有歌词的时间
            this.lyrics.forEach(line => {
                line.time += offset / 1000;
            });
        }
    }

    /**
     * HTML 转义防止 XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ==================== CSS 样式（需添加到 HTML 中） ====================
const lyricsStyles = `
<style>
/* 歌词容器 */
#lyricsContainer {
    height: 300px;
    overflow-y: auto;
    padding: 40px 20px;
    text-align: center;
    position: relative;
    scroll-behavior: smooth;
    -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 20%,
        black 80%,
        transparent 100%
    );
    mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 20%,
        black 80%,
        transparent 100%
    );
}

#lyricsContainer::-webkit-scrollbar {
    width: 4px;
}

#lyricsContainer::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

#lyricsContainer::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
}

/* 歌词行 */
.lyrics-line {
    padding: 12px 0;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
    line-height: 1.6;
}

.lyrics-line:hover {
    color: rgba(255, 255, 255, 0.6);
    transform: scale(1.05);
}

/* 当前播放行 */
.lyrics-line.active {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
}

/* 已播放行 */
.lyrics-line.passed {
    color: rgba(255, 255, 255, 0.3);
}

/* 空状态 */
.lyrics-empty {
    padding: 60px 20px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
}
</style>
`;

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LyricsManager;
}
