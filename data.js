/**
 * 音乐播放列表数据文件
 * 
 * 如何添加新歌：
 * 在 songs 数组中添加新的对象，包含以下字段：
 * - title: 歌曲名称
 * - artist: 歌手/艺术家
 * - cover: 专辑封面图片URL
 * - audio: 音频文件URL
 * 
 * 支持的音频格式：MP3, OGG, WAV
 * 建议封面图片尺寸：500x500px 或更大
 */

const songs = [
    {
        title: "夏日回忆",
        artist: "李明",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "午夜星空",
        artist: "王静",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "城市漫步",
        artist: "张华",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "雨后彩虹",
        artist: "陈艺",
        cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "晨曦微光",
        artist: "刘洋",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        title: "梦境漂流",
        artist: "赵敏",
        cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    {
        title: "电子脉搏",
        artist: "周杰",
        cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
    },
    {
        title: "海风呢喃",
        artist: "孙莉",
        cover: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&h=500&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
];

/**
 * 播放器配置（可选）
 * 可以在这里添加全局配置项
 */
const playerConfig = {
    // 默认音量 (0-1)
    defaultVolume: 0.7,
    
    // 是否自动播放下一首
    autoPlayNext: true,
    
    // 默认播放模式: 'loop' | 'single' | 'random'
    defaultMode: 'loop',
    
    // 进度保存间隔（毫秒）
    progressSaveInterval: 2000
};
