// ==================== 高级音乐播放器 Pro - 核心脚本 ====================
// 作者：Music Player Pro Team
// 版本：v2.0
// 功能：播放控制、列表渲染、进度条、音量控制、持久化存储

// ==================== 核心变量 ====================
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let playMode = 'loop'; // 'loop'(列表循环), 'single'(单曲循环), 'random'(随机播放)
let isMuted = false;
let previousVolume = 0.7;

// ==================== DOM 元素获取 ====================
const coverWrapper = document.getElementById('coverWrapper');
const coverImage = document.getElementById('coverImage');
const songInfo = document.getElementById('songInfo');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modeBtn = document.getElementById('modeBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const playlistItems = document.getElementById('playlistItems');
const playlistSidebar = document.getElementById('playlistSidebar');
const playlistToggle = document.getElementById('playlistToggle');
const playlistClose = document.getElementById('playlistClose');

// ==================== LocalStorage 键名常量 ====================
const STORAGE_KEYS = {
    CURRENT_SONG: 'musicPlayer_currentSong',
    PROGRESS: 'musicPlayer_progress',
    VOLUME: 'musicPlayer_volume',
    MODE: 'musicPlayer_mode'
};

// ==================== 初始化函数 ====================
function init() {
    console.log('🎵 音乐播放器初始化中...');
    
    // 检查歌曲数据是否存在
    if (typeof songs === 'undefined' || songs.length === 0) {
        console.error('❌ 错误：未找到歌曲数据！请确保 data.js 已正确加载。');
        songTitle.textContent = '加载失败';
        songArtist.textContent = '请检查 data.js 文件';
        return;
    }

    // 应用全局配置
    if (typeof playerConfig !== 'undefined') {
        audio.volume = playerConfig.defaultVolume || 0.7;
        volumeSlider.value = audio.volume * 100;
        playMode = playerConfig.defaultMode || 'loop';
        console.log('⚙️ 配置加载成功：', playerConfig);
    }

    // 加载本地保存的设置
    loadSettings();

    // 渲染播放列表（核心功能1）
    renderPlaylist();

    // 加载第一首歌曲
    loadSong(currentSongIndex);

    // 绑定所有事件监听器
    bindEvents();

    // 定期保存播放进度
    setInterval(saveProgress, playerConfig?.progressSaveInterval || 2000);

    console.log('✅ 播放器初始化完成！共加载', songs.length, '首歌曲');
}

// ==================== 设置持久化（LocalStorage）====================
function loadSettings() {
    // 恢复上次播放的歌曲索引
    const savedSongIndex = localStorage.getItem(STORAGE_KEYS.CURRENT_SONG);
    if (savedSongIndex !== null && parseInt(savedSongIndex) < songs.length) {
        currentSongIndex = parseInt(savedSongIndex);
    }

    // 恢复播放进度
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (savedProgress !== null) {
        audio.currentTime = parseFloat(savedProgress);
    }

    // 恢复音量设置
    const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
    if (savedVolume !== null) {
        audio.volume = parseFloat(savedVolume);
        volumeSlider.value = audio.volume * 100;
    }

    // 恢复播放模式
    const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
    if (savedMode) {
        playMode = savedMode;
        updateModeButton();
    }
}

function saveProgress() {
    if (!isNaN(audio.currentTime) && audio.currentTime > 0) {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, audio.currentTime);
    }
}

function saveCurrentSong() {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SONG, currentSongIndex);
}

function saveVolume() {
    localStorage.setItem(STORAGE_KEYS.VOLUME, audio.volume);
}

function saveMode() {
    localStorage.setItem(STORAGE_KEYS.MODE, playMode);
}

// ==================== 播放列表渲染（核心功能1）====================
function renderPlaylist() {
    playlistItems.innerHTML = songs.map((song, index) => `
        <div class="playlist-item" data-index="${index}">
            <img src="${song.cover}" alt="${song.title}" class="playlist-item-cover" loading="lazy">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${escapeHtml(song.title)}</div>
                <div class="playlist-item-artist">${escapeHtml(song.artist)}</div>
            </div>
            <div class="playlist-item-playing">
                <div class="playing-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `).join('');

    updatePlaylistActive();
}

// 更新播放列表的激活状态
function updatePlaylistActive() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });

    // 滚动到当前播放项
    const activeItem = document.querySelector('.playlist-item.active');
    if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// HTML 转义防止 XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== 加载歌曲 ====================
function loadSong(index, autoplay = false) {
    if (index < 0 || index >= songs.length) {
        console.error('❌ 无效的歌曲索引:', index);
        return;
    }

    const song = songs[index];
    console.log('🎵 加载歌曲:', song.title, '-', song.artist);

    // 淡出动画
    coverImage.classList.add('fade-out');
    songInfo.classList.add('fade-out');

    setTimeout(() => {
        // 更新歌曲信息
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        coverImage.src = song.cover;
        coverImage.alt = `${song.title} - 专辑封面`;
        audio.src = song.audio;

        // 淡入动画
        coverImage.classList.remove('fade-out');
        songInfo.classList.remove('fade-out');

        // 保存当前歌曲
        saveCurrentSong();

        // 更新播放列表高亮
        updatePlaylistActive();

        // 自动播放
        if (autoplay) {
            audio.play().then(() => {
                isPlaying = true;
                updatePlayButton();
                coverWrapper.classList.add('playing');
            }).catch(err => {
                console.error('❌ 播放失败:', err);
            });
        }
    }, 250); // 等待淡出动画完成
}

// ==================== 播放控制 ====================
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        coverWrapper.classList.remove('playing');
    } else {
        audio.play().catch(err => {
            console.error('❌ 播放失败:', err);
            alert('播放失败，请检查音频链接是否有效');
        });
        coverWrapper.classList.add('playing');
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}

function updatePlayButton() {
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    playBtn.title = isPlaying ? '暂停' : '播放';
}

function playPrevious() {
    if (playMode === 'random') {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    loadSong(currentSongIndex, isPlaying);
}

function playNext() {
    if (playMode === 'random') {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex, isPlaying);
}

// ==================== 播放模式切换 ====================
function toggleMode() {
    const modes = ['loop', 'single', 'random'];
    const currentIndex = modes.indexOf(playMode);
    playMode = modes[(currentIndex + 1) % modes.length];
    updateModeButton();
    saveMode();
    
    // 提示用户
    const modeNames = {
        'loop': '列表循环',
        'single': '单曲循环',
        'random': '随机播放'
    };
    console.log('🔄 播放模式:', modeNames[playMode]);
}

function updateModeButton() {
    const modeIcons = {
        'loop': '🔁',
        'single': '🔂',
        'random': '🔀'
    };
    const modeTitles = {
        'loop': '列表循环',
        'single': '单曲循环',
        'random': '随机播放'
    };
    modeBtn.textContent = modeIcons[playMode];
    modeBtn.title = modeTitles[playMode];
    modeBtn.classList.toggle('active', playMode !== 'loop');
}

// ==================== 音量控制（核心功能3）====================
function toggleMute() {
    if (isMuted) {
        audio.volume = previousVolume;
        volumeSlider.value = audio.volume * 100;
        updateVolumeIcon();
    } else {
        previousVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeBtn.textContent = '🔇';
    }
    isMuted = !isMuted;
    saveVolume();
}

function updateVolume(value) {
    audio.volume = value / 100;
    updateVolumeIcon();
    
    if (audio.volume > 0) {
        isMuted = false;
    }
    
    saveVolume();
}

function updateVolumeIcon() {
    if (audio.volume === 0) {
        volumeBtn.textContent = '🔇';
        volumeBtn.title = '取消静音';
    } else if (audio.volume > 0.5) {
        volumeBtn.textContent = '🔊';
        volumeBtn.title = '静音';
    } else {
        volumeBtn.textContent = '🔉';
        volumeBtn.title = '静音';
    }
}

// ==================== 进度条控制（核心功能2）====================
function updateProgress() {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
}

// 点击进度条跳转
function seekTo(e) {
    if (isNaN(audio.duration) || audio.duration === 0) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = percent * audio.duration;
    
    console.log('⏩ 跳转到:', formatTime(audio.currentTime));
}

// 时间格式化
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==================== 事件绑定 ====================
function bindEvents() {
    // ===== 音频事件 =====
    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('ended', () => {
        if (playMode === 'single') {
            // 单曲循环
            audio.currentTime = 0;
            audio.play();
        } else if (playerConfig?.autoPlayNext !== false) {
            // 自动播放下一首
            playNext();
        } else {
            // 停止播放
            isPlaying = false;
            updatePlayButton();
            coverWrapper.classList.remove('playing');
        }
    });
    
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('error', (e) => {
        console.error('❌ 音频加载错误:', e);
        alert('音频加载失败，请检查链接是否有效');
    });

    // ===== 播放控制按钮 =====
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    modeBtn.addEventListener('click', toggleMode);
    
    // ===== 音量控制 =====
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', (e) => updateVolume(e.target.value));

    // ===== 进度条点击跳转（核心功能2）=====
    progressBar.addEventListener('click', seekTo);

    // ===== 播放列表点击切换（核心功能1）=====
    playlistItems.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-item');
        if (item) {
            const index = parseInt(item.dataset.index);
            if (index !== currentSongIndex) {
                currentSongIndex = index;
                loadSong(index, true); // 点击列表项自动播放
            } else {
                // 点击当前歌曲，切换播放状态
                togglePlay();
            }
        }
    });

    // ===== 移动端播放列表切换 =====
    if (playlistToggle) {
        playlistToggle.addEventListener('click', () => {
            playlistSidebar.classList.add('active');
        });
    }
    
    if (playlistClose) {
        playlistClose.addEventListener('click', () => {
            playlistSidebar.classList.remove('active');
        });
    }

    // 点击遮罩关闭（移动端）
    playlistSidebar.addEventListener('click', (e) => {
        if (e.target === playlistSidebar) {
            playlistSidebar.classList.remove('active');
        }
    });

    // ===== 键盘快捷键 =====
    document.addEventListener('keydown', (e) => {
        // 防止在输入框中触发
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.code) {
            case 'Space': // 空格：播放/暂停
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft': // 左箭头：上一首
                e.preventDefault();
                playPrevious();
                break;
            case 'ArrowRight': // 右箭头：下一首
                e.preventDefault();
                playNext();
                break;
            case 'ArrowUp': // 上箭头：增加音量
                e.preventDefault();
                audio.volume = Math.min(1, audio.volume + 0.1);
                volumeSlider.value = audio.volume * 100;
                updateVolumeIcon();
                saveVolume();
                break;
            case 'ArrowDown': // 下箭头：减少音量
                e.preventDefault();
                audio.volume = Math.max(0, audio.volume - 0.1);
                volumeSlider.value = audio.volume * 100;
                updateVolumeIcon();
                saveVolume();
                break;
            case 'KeyM': // M键：静音/取消静音
                e.preventDefault();
                toggleMute();
                break;
        }
    });

    console.log('✅ 事件监听器绑定完成');
}

// ==================== 启动应用 ====================
// 确保 DOM 加载完成后再初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
