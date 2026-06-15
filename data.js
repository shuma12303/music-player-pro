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
    title: 'My Love',
    artist: 'Westlife',
    cover: 'https://images.unsplash.com/photo-1493225545571-aeb161ffa5f?w=500&h=500&fit=crop',
    mp3: 'https://shuma-music.pages.dev/Westlife-My%20Love.mp3'
  },
  {
    title: '花香',
    artist: '許紹洋',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
    mp3: 'https://shuma-music.pages.dev/%E8%A8%B1%E7%B4%B9%E6%B4%8B%20%E8%8A%B1%E9%A6%99_320k.mp3'
  },
  {
    title: '直到世界的尽头',
    artist: '灌篮高手 三井寿之歌',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    mp3: 'https://shuma-music.pages.dev/%E7%81%8C%E7%B1%83%E9%AB%98%E6%89%8B%20%E4%B8%89%E4%BA%A5%E5%A3%BD%E4%B9%8B%E6%AD%8C%20%E3%80%8A%E7%9B%B4%E5%88%B0%E4%B8%96%E7%95%8C%E7%9A%84%E7%9B%A1%E9%A0%AD%E3%80%8B.mp3'
  },
  {
    title: '千千阙歌',
    artist: '陈慧娴',
    cover: 'https://images.unsplash.com/photo-1514320249184-2e0a9bf2a9ae?w=500&h=500&fit=crop',
    mp3: 'https://shuma-music.pages.dev/%E9%99%88%E6%85%A7%E5%A7%AF%20-%20%E5%8D%83%E5%8D%83%E9%98%90%E6%AD%8C%20%E3%80%90%E6%9D%A5%E6%97%A5%E7%BA%B5%E4%BD%BF%E5%8D%83%E5%8D%83%E9%98%90%E6%AD%8C%E3%80%91.mp3'
  },
  {
    title: '梦醒时分',
    artist: '陈淑桦',
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=500&fit=crop',
    mp3: 'https://shuma-music.pages.dev/%E9%99%CD%E6%B7%91%E6%A8%AA%20Sarah%20Chen%E3%80%90%E5%A4%A2%E9%86%92%E6%99%82%E5%88%86%20Dream%20to%20Awakening%E3%80%91%E5%AE%98%E6%96%B9%E5%AE%8C%E6%95%B4%E7%89%88MV.mp3'
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
