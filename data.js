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
    title: 'Yesterday Once More',
    artist: 'Carpenters',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/Carpenters-Yesterday%20Once%20More.mp3'
  },
  {
    title: 'The Day You Went Away',
    artist: 'M2M',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/M2M-The%20Day%20You%20Went%20A...mp3' 
  },
  {
    title: 'My Love',
    artist: 'Westlife',
    cover: 'https://images.unsplash.com/photo-1493225545571-aeb161ffa5f?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/Westlife-My%20Love.mp3'
  },
  {
    title: '直到世界的尽头',
    artist: '灌篮高手 三井寿之歌',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/zhi%20dao%20shijie%20de%20jin%20tou.mp3'
  },
  {
    title: '花香',
    artist: '許紹洋',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/hua%20xiang.mp3'
  },
  {
    title: '梦醒时分',
    artist: '陈淑桦',
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/meng%20xing%20shi%20fen.mp3'
  },
  {
    title: '千千阙歌',
    artist: '陈慧娴',
    cover: 'https://images.unsplash.com/photo-1514320249184-2e0a9bf2a9ae?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/qian%20qian%20jin%20ge.mp3'
  },
  {
    title: '与你共随',
    artist: '大岭剩男 主题曲',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
    mp3: 'https://ibviccjfncoaxnatvxz.supabase.co/storage/v1/object/public/music/yu%20ni%20gong%20sui.mp3'
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
