// musicManager.ts
export class MusicManager {
  private audioElements: HTMLAudioElement[] = [];
  private currentTrackIndex = 0;
  private playing = false;
  private pauseTimeout: number | null = null;
  private boundAutoStart?: () => void;

  constructor() {
    this.loadMusic();
    // Try to start on first user interaction if autoplay is blocked
    this.boundAutoStart = () => {
      if (!this.playing) this.start();
    };
    document.addEventListener('pointerdown', this.boundAutoStart, { once: true });
    document.addEventListener('keydown', this.boundAutoStart, { once: true });
  }

  private loadMusic() {
    const musicFiles = [
      'music/1.mp3',
      'music/2.mp3',
      'music/3.mp3',
    ];

    this.audioElements = musicFiles.map((file, index) => {
      const audio = new Audio(file);
      audio.preload = 'auto';
      audio.volume = 0.35;
      audio.addEventListener('ended', () => this.onTrackEnded());
      audio.addEventListener('error', (e) => {
        console.warn(`Could not load music file: ${file}`, e);
        // Skip to next track on error
        if (this.playing) this.playNextTrack();
      });
      return audio;
    });
  }

  private onTrackEnded() {
    if (!this.playing) return;
    // Short gap 300–1200 ms (browser-friendly)
    const gap = 300 + Math.floor(Math.random() * 900);
    this.pauseTimeout = window.setTimeout(() => {
      this.playNextTrack();
    }, gap);
  }

  private playNextTrack() {
    if (!this.playing) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.audioElements.length;
    const currentAudio = this.audioElements[this.currentTrackIndex];
    currentAudio.currentTime = 0;
    currentAudio.play().catch((e) => {
      // If autoplay still blocked, wait for user gesture
      console.warn('Could not play next track:', e);
    });
  }

  public start() {
    if (this.playing) return;
    // Stop any playing audio just in case
    this.audioElements.forEach(a => { a.pause(); a.currentTime = 0; });

    this.playing = true;
    const firstTrack = this.audioElements[this.currentTrackIndex] || this.audioElements[0];
    if (!firstTrack) return;
    firstTrack.currentTime = 0;
    firstTrack.play().catch((e) => {
      // Autoplay blocked; will start on first interaction
      this.playing = false;
      console.warn('Autoplay prevented. Music will start on first user interaction.', e);
    });
  }

  public stop() {
    this.playing = false;
    this.audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    if (this.pauseTimeout) { clearTimeout(this.pauseTimeout); this.pauseTimeout = null; }
  }

  public toggle() {
    if (this.playing) this.stop(); else this.start();
  }

  public setVolume(volume: number) {
    const v = Math.max(0, Math.min(1, volume));
    this.audioElements.forEach(a => a.volume = v);
  }

  public isCurrentlyPlaying(): boolean {
    return this.playing;
  }
}
