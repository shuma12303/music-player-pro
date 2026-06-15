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
    標題: '花香',
    藝術家: '許紹洋',
    覆蓋物: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
    音訊: 'https://shuma-music.pages.dev/music/許紹洋 花香_320k.mp3'
  },
  {
    標題: '直到世界的尽头',
    藝術家: '灌篮高手 三井寿之歌',
    覆蓋物: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    音訊: 'https://shuma-music.pages.dev/music/灌籃高手 三井壽之歌 《直到世界的盡頭》.mp3'
  },
  {
    標題: 'My Love',
    藝術家: 'Westlife',
    覆蓋物: 'https://images.unsplash.com/photo-1493225545571-aeb161ffa5f?w=500&h=500&fit=crop',
    音訊: 'https://shuma-music.pages.dev/music/Westlife-My Love.mp3'
  },
  {
    標題: '千千阙歌',
    藝術家: '陈慧娴',
    覆蓋物: 'https://images.unsplash.com/photo-1514320249184-2e0a9bf2a9ae?w=500&h=500&fit=crop',
    音訊: 'https://shuma-music.pages.dev/music/陈慧娴 - 千千阙歌 【来日纵使千千阙歌】.mp3'
  },
  {
    標題: '梦醒时分',
    藝術家: '陈淑桦',
    覆蓋物: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=500&fit=crop',
    音訊: 'https://shuma-music.pages.dev/music/陳淑樺 Sarah Chen【夢醒時分 Dream to Awakening】官方完整版MV.mp3'
  },
  {
    標題: 'The Day You Went Away',
    藝術家: 'M2M',
    覆蓋物: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
    音訊: 'https://shuma-music.pages.dev/music/M2M-The Day You Went Away-《第一次亲密接触》电影主题曲.mp3'
  },
  {
    標題: 'Yesterday Once More',
    藝術家: 'Carpenters',
    覆蓋物: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=500&fit=crop',
    音訊: 'https://shuma-music.pages.dev/music/与你共随 (网剧《大龄剩男》主题曲)_32k.mp3'
  },
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
