
class SoundManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playReward() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.ctx!.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx!.currentTime + 0.1); // C6
    
    gain.gain.setValueAtTime(0, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx!.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.3);
  }

  playLevelUp() {
    this.init();
    const now = this.ctx!.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  }
}

export const sounds = new SoundManager();
