//#region node_modules/.nitro/vite/services/ssr/assets/sfx-D-XZLET1.js
var SfxManager = class {
	ctx = null;
	enabled = true;
	volume = .4;
	started = false;
	constructor() {
		if (typeof window !== "undefined") try {
			const en = localStorage.getItem("ip_sfx_enabled");
			const vol = localStorage.getItem("ip_sfx_volume");
			if (en !== null) this.enabled = en === "1";
			if (vol !== null) this.volume = Math.max(0, Math.min(1, parseFloat(vol)));
		} catch {}
	}
	setEnabled(v) {
		this.enabled = v;
		try {
			localStorage.setItem("ip_sfx_enabled", v ? "1" : "0");
		} catch {}
	}
	setVolume(v) {
		this.volume = Math.max(0, Math.min(1, v));
		try {
			localStorage.setItem("ip_sfx_volume", String(this.volume));
		} catch {}
	}
	getEnabled() {
		return this.enabled;
	}
	getVolume() {
		return this.volume;
	}
	/** Chamado no primeiro gesto do usuário para desbloquear o AudioContext. */
	unlock() {
		if (this.started || typeof window === "undefined") return;
		try {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (!AC) return;
			this.ctx = new AC();
			this.started = true;
		} catch {}
	}
	play(name) {
		if (!this.enabled || !this.ctx) return;
		const ctx = this.ctx;
		const now = ctx.currentTime;
		const gain = ctx.createGain();
		gain.gain.value = this.volume;
		gain.connect(ctx.destination);
		switch (name) {
			case "click":
			case "cardFlip": {
				const osc = ctx.createOscillator();
				osc.type = "square";
				osc.frequency.setValueAtTime(1200, now);
				osc.frequency.exponentialRampToValueAtTime(600, now + .08);
				gain.gain.setValueAtTime(this.volume * .35, now);
				gain.gain.exponentialRampToValueAtTime(.001, now + .12);
				osc.connect(gain);
				osc.start(now);
				osc.stop(now + .13);
				break;
			}
			case "cardDeal": {
				const buf = ctx.createBuffer(1, ctx.sampleRate * .08, ctx.sampleRate);
				const data = buf.getChannelData(0);
				for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
				const src = ctx.createBufferSource();
				src.buffer = buf;
				const filter = ctx.createBiquadFilter();
				filter.type = "highpass";
				filter.frequency.value = 800;
				src.connect(filter);
				filter.connect(gain);
				gain.gain.setValueAtTime(this.volume * .25, now);
				src.start(now);
				break;
			}
			case "chipDrop":
				for (let k = 0; k < 2; k++) {
					const osc = ctx.createOscillator();
					const g = ctx.createGain();
					osc.type = "triangle";
					osc.frequency.setValueAtTime(800 - k * 100, now + k * .04);
					osc.frequency.exponentialRampToValueAtTime(180, now + k * .04 + .1);
					g.gain.setValueAtTime(this.volume * .4, now + k * .04);
					g.gain.exponentialRampToValueAtTime(.001, now + k * .04 + .12);
					osc.connect(g);
					g.connect(ctx.destination);
					osc.start(now + k * .04);
					osc.stop(now + k * .04 + .13);
				}
				break;
			case "fold": {
				const osc = ctx.createOscillator();
				osc.type = "sawtooth";
				osc.frequency.setValueAtTime(300, now);
				osc.frequency.exponentialRampToValueAtTime(80, now + .25);
				gain.gain.setValueAtTime(this.volume * .3, now);
				gain.gain.exponentialRampToValueAtTime(.001, now + .3);
				osc.connect(gain);
				osc.start(now);
				osc.stop(now + .32);
				break;
			}
			case "allInWhoosh": {
				const buf = ctx.createBuffer(1, ctx.sampleRate * .6, ctx.sampleRate);
				const data = buf.getChannelData(0);
				for (let i = 0; i < data.length; i++) {
					const t = i / data.length;
					data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * .8;
				}
				const src = ctx.createBufferSource();
				src.buffer = buf;
				const filter = ctx.createBiquadFilter();
				filter.type = "bandpass";
				filter.frequency.setValueAtTime(400, now);
				filter.frequency.exponentialRampToValueAtTime(3e3, now + .5);
				filter.Q.value = 4;
				src.connect(filter);
				filter.connect(gain);
				gain.gain.setValueAtTime(this.volume * .55, now);
				src.start(now);
				break;
			}
			case "potWin":
				[
					523.25,
					659.25,
					783.99,
					1046.5
				].forEach((f, i) => {
					const osc = ctx.createOscillator();
					const g = ctx.createGain();
					osc.type = "triangle";
					osc.frequency.value = f;
					g.gain.setValueAtTime(0, now + i * .09);
					g.gain.linearRampToValueAtTime(this.volume * .35, now + i * .09 + .02);
					g.gain.exponentialRampToValueAtTime(.001, now + i * .09 + .35);
					osc.connect(g);
					g.connect(ctx.destination);
					osc.start(now + i * .09);
					osc.stop(now + i * .09 + .36);
				});
				break;
		}
	}
};
var sfx = new SfxManager();
//#endregion
export { sfx as t };
