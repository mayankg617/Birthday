/* =======================================================
   PROJECT NONI
   SCRIPT.JS — MASTER CINEMATIC CONTROLLER
   VERSION 1.0
======================================================= */

'use strict';

/* =======================================================
   CONFIGURATION — Single source of truth
======================================================= */

const CONFIG = {

    loader: {
        duration: 5000,          // ms
        steps: 50,               // counter steps
    },

    intro: {
        duration: 6000,
    },

    story: {
        charDelay: 75,           // ms per character
        lineDelay: 900,          // pause after each line
        blockDelay: 1800,        // pause between date blocks
    },

    childhood: {
        src: 'assets/childhood.jpg',
        caption: 'Every beautiful story...\nonce began with an innocent smile.',
        duration: 12000,
    },

    growth: {
        src: 'assets/growth.jpg',
        caption: 'Years changed...\nDreams grew bigger...\nBut kindness remained the same.',
        duration: 12000,
    },

    present: {
        src: 'assets/present.jpg',
        caption: 'Some people do not enter our lives to change them...\nThey simply make ordinary days feel extraordinary.',
        duration: 11000,
    },

    gift: {
        caption: 'Some surprises are wrapped in paper...\nSome are wrapped in emotions.',
    },

    celebration: {
        duration: 20000,
        birthdayMessage: '🌸 Happy Birthday, Dear Noni 🌸\n\nMay every day of your life\nfeel as beautiful as you make ours.',
        balloonCount: 18,
        fireworkCount: 8,
        petalCount: 18,
    },

    letter: {
        duration: 25000,

        paragraphs: [

            "Dear Noni,",

            "Some people walk into your life quietly, and before you know it, they have become your favourite part of every day.",

            "That's what happened with you.",

            "It started with a simple 'Hi.' And somewhere between those late-night talks and everyday little moments — it became something I genuinely treasure.",

            "On your birthday, I just want you to know — the world is a little warmer, a little kinder, and a whole lot more beautiful because you are in it.",

            "Happy Birthday Bacchua. 🌸"

        ]
    },

    story: {
        charDelay: 75,
        lineDelay: 850,
        blockDelay: 1600,
        lines: [
            { type: 'date', text: '21 May 2024' },
            { type: 'line', text: 'A simple "Hi."' },
            { type: 'line', text: 'A few conversations.' },
            { type: 'line', text: 'Nothing unusual.' },
            { type: 'line', text: 'Life quietly moved ahead.' },
            { type: 'pause' },
            { type: 'line', text: '...' },
            { type: 'pause' },
            { type: 'date', text: '14 May 2026' },
            { type: 'line', text: 'Another message.' },
            { type: 'line', text: 'This time,' },
            { type: 'line', text: 'the conversations lasted longer.' },
            { type: 'line', text: 'The silence grew shorter.' },
            { type: 'line', text: 'The smiles became frequent.' },
            { type: 'line', text: 'And slowly...' },
            { type: 'line', text: 'without either of us noticing...' },
            { type: 'line', text: 'talking every day' },
            { type: 'line', text: 'became a beautiful habit.' },
            { type: 'pause' },
            { type: 'line', text: 'Some habits aren\'t formed by time...' },
            { type: 'line', text: 'they\'re formed by the comfort' },
            { type: 'line', text: 'of the person on the other side.' },
        ],
    },

};

/* =======================================================
   DOM CACHE
======================================================= */

const DOM = {
    overlay: document.getElementById('global-overlay'),
    flash: document.getElementById('global-flash'),
    particles: document.getElementById('particles-container'),

    // Scenes
    sceneLoader: document.getElementById('scene-loader'),
    sceneIntro: document.getElementById('scene-intro'),
    sceneStory: document.getElementById('scene-story'),
    sceneChildhood: document.getElementById('scene-childhood'),
    sceneGrowth: document.getElementById('scene-growth'),
    scenePresent: document.getElementById('scene-present'),
    sceneGift: document.getElementById('scene-gift'),
    sceneCelebration: document.getElementById('scene-celebration'),
    sceneLetter: document.getElementById('scene-letter'),

    // Loader
    heartbeatIcon: document.getElementById('heartbeat-icon'),
    loadingTitle: document.getElementById('loading-title'),
    loadingCounter: document.getElementById('loading-counter'),

    // Story
    storyContainer: document.getElementById('story-container'),

    // Memory
    childhoodPhoto: document.getElementById('childhood-photo'),
    growthPhoto: document.getElementById('growth-photo'),
    presentPhoto: document.getElementById('present-photo'),

    // Gift
    giftBox: document.getElementById('gift-box'),
    giftCaption: document.getElementById('gift-caption'),

    // Celebration
    balloonContainer: document.getElementById('balloon-container'),
    fireworkContainer: document.getElementById('firework-container'),
    cakeContainer: document.getElementById('cake-container'),
    birthdayMessage: document.getElementById('birthday-message'),

    // Letter
    letterContainer: document.getElementById('letter-container'),
    signature: document.getElementById('signature'),

    // Audio

    bgMusic:
        document.getElementById('bg-music'),

    heartbeatAudio:
        document.getElementById('heartbeat-audio'),

    typewriterAudio:
        document.getElementById('typewriter-audio'),

    bellAudio:
        document.getElementById('bell-audio'),

    giftAudio:
        document.getElementById('gift-audio'),
};

/* =======================================================
   UTILITY
======================================================= */

const Util = {

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    fadeElement(el, targetOpacity, durationMs) {
        return new Promise(resolve => {
            el.style.transition = `opacity ${durationMs}ms ease`;
            el.style.opacity = String(targetOpacity);
            setTimeout(resolve, durationMs);
        });
    },

    setOpacity(el, value) {
        el.style.opacity = String(value);
    },

};

/* =======================================================
   SCENE MANAGER
======================================================= */

const SceneManager = {

    _current: null,

    show(scene) {
        scene.classList.add('active');
        this._current = scene;
    },

    hide(scene) {
        scene.classList.remove('active');
    },

    async transition(fromScene, toScene, overlapMs = 1500) {
        // Bring new scene in while old fades out
        this.show(toScene);
        await Util.wait(overlapMs);
        if (fromScene) this.hide(fromScene);
    },

    async fadeIn(scene, waitAfterMs = 0) {
        this.show(scene);
        if (waitAfterMs > 0) await Util.wait(waitAfterMs);
    },

    async fadeOut(scene, waitAfterMs = 600) {
        this.hide(scene);
        await Util.wait(waitAfterMs);
    },

};

/* =======================================================
   OPENING CONTROLLER
   Black screen → tap to begin
======================================================= */

const OpeningController = {

    _overlay: null,

    init() {
        // Build opening overlay
        const div = document.createElement('div');
        div.id = 'opening-screen';
        div.style.cssText = `
            position:fixed;inset:0;background:#111111;
            display:flex;flex-direction:column;
            justify-content:center;align-items:center;
            z-index:99999;cursor:pointer;
            font-family:'Playfair Display',serif;
            text-align:center;padding:40px;
            transition:opacity 1.8s ease;
        `;
        div.innerHTML = `
            <p style="
                font-size:clamp(2rem,4vw,3.4rem);
                font-weight:500;color:#ffffff;
                line-height:1.7;letter-spacing:.04em;
                text-shadow:0 6px 24px rgba(0,0,0,.35);
                margin-bottom:52px;
                animation:slowPulse 6s ease-in-out infinite;
            ">
                Every memory deserves<br>a quiet beginning...<br><br>✨
            </p>
            <p style="
                font-family:'Poppins',sans-serif;
                font-size:clamp(1rem,1.6vw,1.4rem);
                color:rgba(255,255,255,.55);
                letter-spacing:.18em;
                text-transform:uppercase;
            ">
                Tap anywhere to begin the memories
            </p>
        `;
        document.body.appendChild(div);
        this._overlay = div;
    },

    waitForTap() {
        return new Promise(resolve => {
            const handler = () => {
                this._overlay.removeEventListener('click', handler);
                this._overlay.removeEventListener('touchstart', handler);
                resolve();
            };
            this._overlay.addEventListener('click', handler, { once: true });
            this._overlay.addEventListener('touchstart', handler, { once: true });
        });
    },

    async dismiss() {
        this._overlay.style.opacity = '0';
        await Util.wait(1800);
        this._overlay.remove();
    },

};

/* =======================================================
   LOADER ENGINE
======================================================= */

const LoaderEngine = {

    async play() {
        SceneManager.show(DOM.sceneLoader);
        DOM.heartbeatAudio.volume = 0.5;
        DOM.heartbeatAudio.play();

        // Show 0% immediately
        DOM.loadingCounter.textContent = '0%';

        // Give the loader scene time to become visible
        await Util.wait(900);

        const cfg = CONFIG.loader;
        const stepMs = cfg.duration / cfg.steps;

        await new Promise(resolve => {
            let count = 0;
            DOM.loadingCounter.textContent = '0%';
            const tick = setInterval(() => {
                count++;
                const pct = Math.min(Math.round((count / cfg.steps) * 100), 100);
                DOM.loadingCounter.textContent = pct + '%';
                if (count >= cfg.steps) {
                    clearInterval(tick);
                    resolve();
                }
            }, stepMs);
        });

        await Util.wait(600);
        DOM.heartbeatAudio.pause();
        DOM.heartbeatAudio.currentTime = 0;
    },

};

/* =======================================================
   INTRO ENGINE
======================================================= */

const IntroEngine = {

    async play() {
        await SceneManager.transition(DOM.sceneLoader, DOM.sceneIntro, 1200);
        await Util.wait(CONFIG.intro.duration);
    },

};

/* =======================================================
   STORY ENGINE
======================================================= */

const StoryEngine = {

    _typeText(el, text, charDelay) {
        return new Promise(resolve => {
            let i = 0;
            if (DOM.typewriterAudio.paused) {

                DOM.typewriterAudio.volume = 0.07;

                DOM.typewriterAudio.loop = true;

                DOM.typewriterAudio.play();
                DOM.typewriterAudio.playbackRate = 0.65;

            }
            el.textContent = '';
            const cursor = document.createElement('span');
            cursor.className = 'story-cursor';
            el.appendChild(cursor);

            const type = () => {
                if (i < text.length) {
                    cursor.insertAdjacentText('beforebegin', text[i]);
                    i++;
                    setTimeout(type, charDelay);
                } else {
                    cursor.remove();
                    resolve();
                }
            };
            type();
        });
    },

    async play() {
        await SceneManager.transition(DOM.sceneIntro, DOM.sceneStory, 1200);
        DOM.storyContainer.innerHTML = '';

        const cfg = CONFIG.story;
        const lines = cfg.lines;

        for (const item of lines) {

            if (item.type === 'pause') {
                await Util.wait(cfg.blockDelay);
                continue;
            }

            const el = document.createElement('div');

            if (item.type === 'date') {
                el.className = 'story-line story-date';
            } else {
                el.className = 'story-line';
            }

            DOM.storyContainer.appendChild(el);

            // Keep only the latest 3 visible lines
            const storyLines = DOM.storyContainer.children;

            if (storyLines.length >= 1) {

                Array.from(storyLines).forEach((line, index) => {

                    line.style.transition =
                        "opacity 1.2s ease, transform 1.2s ease";

                    if (index === storyLines.length - 1) {

                        // newest line

                        line.style.opacity = "1";

                        line.style.transform = "translateY(0px)";

                    }

                    else if (index === storyLines.length - 2) {

                        // previous line

                        line.style.opacity = "0.55";

                        line.style.transform = "translateY(-8px)";

                    }

                    else if (index === storyLines.length - 3) {

                        // oldest visible

                        line.style.opacity = "0.20";

                        line.style.transform = "translateY(-16px)";

                    }

                });

            }

            if (storyLines.length > 3) {

                const oldest = storyLines[0];

                setTimeout(() => {

                    if (oldest.parentNode) {

                        oldest.remove();

                    }

                }, 1200);

            }

            // Fade in the element
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';

            await Util.wait(80);

            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';

            await this._typeText(el, item.text, cfg.charDelay);
            await Util.wait(cfg.lineDelay);

            // Keep container scrolled to bottom
            // DOM.storyContainer.scrollTop = DOM.storyContainer.scrollHeight;
        }

        await Util.wait(1800);

        DOM.typewriterAudio.pause();

        DOM.typewriterAudio.currentTime = 0;
    },

};

/* =======================================================
   MEMORY ENGINE  (Childhood / Growth / Present)
======================================================= */

const MemoryEngine = {

    _setCaption(scene, text) {
        const captionEl = scene.querySelector('.caption');
        if (!captionEl) return;
        captionEl.innerHTML = text.replace(/\n/g, '<br>');
        captionEl.style.opacity = '0';
        captionEl.style.transform = 'translateY(20px)';
        captionEl.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
        // Trigger reflow then animate
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                captionEl.style.opacity = '1';
                captionEl.style.transform = 'translateY(0)';
            });
        });
    },

    async _playScene(fromScene, toScene, photo, cfg) {
        photo.src = cfg.src;
        photo.style.opacity = '0';
        photo.style.transform = 'scale(1)';
        photo.classList.remove('zoom-memory', 'memory-float');

        await SceneManager.transition(fromScene, toScene, 2200);
        await Util.wait(400);

        // Prepare caption first
        // this._setCaption(toScene, cfg.caption);

        // Prepare photo transition
        photo.style.transition =
            'opacity 2.5s ease, transform 12s linear';

        // Start photo immediately
        requestAnimationFrame(() => {

            photo.style.opacity = '1';

            photo.style.transform = 'scale(1.08)';

        });

        await Util.wait(800);

        // Show caption after photo starts appearing
        this._setCaption(toScene, cfg.caption);

        // Add float after initial appearance
        await Util.wait(2500);

        photo.classList.add('memory-float');

        await Util.wait(cfg.duration - 3400);
    },

    async playChildhood() {
        await this._playScene(
            DOM.sceneStory,
            DOM.sceneChildhood,
            DOM.childhoodPhoto,
            CONFIG.childhood
        );
    },

    async playGrowth() {
        await this._playScene(
            DOM.sceneChildhood,
            DOM.sceneGrowth,
            DOM.growthPhoto,
            CONFIG.growth
        );
    },

    async playPresent() {
        await this._playScene(
            DOM.sceneGrowth,
            DOM.scenePresent,
            DOM.presentPhoto,
            CONFIG.present
        );
    },

};

/* =======================================================
   GIFT ENGINE
======================================================= */

const GiftEngine = {

    play() {
        return new Promise(async resolve => {

            await SceneManager.transition(DOM.scenePresent, DOM.sceneGift, 1400);

            // Set caption
            DOM.giftCaption.innerHTML = CONFIG.gift.caption.replace(/\n/g, '<br>');
            DOM.giftCaption.style.opacity = '0';
            DOM.giftCaption.style.transition = 'opacity 1.5s ease';
            await Util.wait(600);
            DOM.giftCaption.style.opacity = '1';

            // Float animation
            DOM.giftBox.classList.add('animate-gift');

            // Wait for user click — pure event-driven
            DOM.giftBox.addEventListener('click', async () => {

                DOM.giftAudio.currentTime = 0;

                DOM.giftAudio.volume = 0.4;

                DOM.giftAudio.play();

                DOM.giftBox.classList.remove('animate-gift');
                DOM.giftBox.classList.add('animate-gift-open');

                await Util.wait(400);

                // White flash
                DOM.flash.style.transition = 'opacity 0.3s ease';
                DOM.flash.style.opacity = '1';
                await Util.wait(300);
                DOM.flash.style.transition = 'opacity 0.8s ease';
                DOM.flash.style.opacity = '0';

                resolve();

            }, { once: true });

        });
    },

};

/* =======================================================
   PARTICLE ENGINE  (ambient floating dots)
======================================================= */

const ParticleEngine = {

    _particles: [],
    _running: false,

    start() {
        if (this._running) return;
        this._running = true;
        for (let i = 0; i < 16; i++) {
            setTimeout(() => this._spawnParticle(), i * 400);
        }
    },

    _spawnParticle() {
        if (!this._running) return;
        const p = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const colors = ['rgba(231,84,128,.35)', 'rgba(212,175,55,.3)', 'rgba(255,255,255,.2)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 8;

        p.style.cssText = `
            position:absolute;
            width:${size}px;height:${size}px;
            background:${color};
            border-radius:50%;
            left:${left}%;
            bottom:-10px;
            pointer-events:none;
            animation:balloonRise ${duration}s linear forwards;
        `;
        DOM.particles.appendChild(p);
        p.addEventListener('animationend', () => {
            p.remove();
            if (this._running) this._spawnParticle();
        });
    },

    stop() {
        this._running = false;
        DOM.particles.innerHTML = '';
    },

};

/* =======================================================
   CELEBRATION ENGINE
======================================================= */

const CelebrationEngine = {

    async play() {
        await SceneManager.transition(DOM.sceneGift, DOM.sceneCelebration, 1200);

        DOM.cakeContainer.classList.remove('animate-cake');

        DOM.cakeContainer.style.opacity = '0';

        // Balloons
        this._launchBalloons();

        // Fireworks (staggered)
        this._launchFireworks();

        // Birthday message
        await Util.wait(1000);
        DOM.bellAudio.currentTime = 0;

        DOM.bellAudio.volume = 0.4;

        DOM.bellAudio.play();

        setTimeout(() => {

            DOM.bellAudio.currentTime = 0;

            DOM.bellAudio.play();

        }, 2500);
        DOM.birthdayMessage.innerHTML = CONFIG.celebration.birthdayMessage.replace(/\n/g, '<br>');
        DOM.birthdayMessage.style.opacity = '0';
        DOM.birthdayMessage.style.transition = 'opacity 2s ease';
        await Util.wait(200);
        DOM.birthdayMessage.style.opacity = '1';

        DOM.bellAudio.currentTime = 0;

        DOM.bellAudio.play();

        // Cake
        DOM.cakeContainer.classList.add('animate-cake');

        await Util.wait(CONFIG.celebration.duration);
    },

    _launchBalloons() {
        const colors = ['#E75480', '#D4AF37', '#FF9EB5', '#FFD700', '#FFB6C1', '#FDECEF'];
        const count = CONFIG.celebration.balloonCount;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const b = document.createElement('div');
                const color = colors[i % colors.length];
                const left = 5 + Math.random() * 90;
                const size = 36 + Math.random() * 24;
                const duration = 8 + Math.random() * 5;
                const delay = Math.random() * 3;

                b.style.cssText = `
                    position:absolute;
                    width:${size}px;height:${size * 1.25}px;
                    background:${color};
                    border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
                    left:${left}%;
                    bottom:-80px;
                    opacity:0;
                    pointer-events:none;
                    animation:balloonRise ${duration}s ${delay}s linear forwards;
                `;

                // Balloon string
                const str = document.createElement('div');
                str.style.cssText = `
                    position:absolute;
                    width:1px;height:${size * 0.7}px;
                    background:rgba(255,255,255,.3);
                    left:50%;top:100%;
                    transform:translateX(-50%);
                `;
                b.appendChild(str);

                DOM.balloonContainer.appendChild(b);
            }, i * 250);
        }
    },

    _launchFireworks() {
        const colors = ['#E75480', '#D4AF37', '#FF9EB5', '#FFFFFF', '#FFD700'];
        const count = CONFIG.celebration.fireworkCount;

        const fire = () => {
            const fw = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = 10 + Math.random() * 80;
            const y = 10 + Math.random() * 60;
            const size = 80 + Math.random() * 80;

            fw.style.cssText = `
                position:absolute;
                width:${size}px;height:${size}px;
                border-radius:50%;
                border:3px solid ${color};
                left:${x}%;top:${y}%;
                transform:translate(-50%,-50%) scale(.2);
                opacity:1;
                pointer-events:none;
                animation:fireworkBurst 1.5s ease-out forwards;
            `;
            DOM.fireworkContainer.appendChild(fw);
            fw.addEventListener('animationend', () => fw.remove());
        };

        // Rapid bursts at start
        for (let i = 0; i < count; i++) {
            setTimeout(fire, i * 250);
        }

        // Continued bursts
        const interval = setInterval(fire, 700);
        setTimeout(() => clearInterval(interval), CONFIG.celebration.duration - 2000);
    },

};

/* =======================================================
   LETTER ENGINE
======================================================= */

const LetterEngine = {

    async play() {
        await SceneManager.transition(DOM.sceneCelebration, DOM.sceneLetter, 1500);
        DOM.sceneLetter.scrollTop = 0;

        // Inject letter HTML
        DOM.letterContainer.innerHTML = '';

        DOM.typewriterAudio.volume = 0.07;

        DOM.typewriterAudio.playbackRate = 0.65;

        DOM.typewriterAudio.loop = true;

        DOM.typewriterAudio.currentTime = 0;

        DOM.typewriterAudio.play();

        for (const para of CONFIG.letter.paragraphs) {

            const p = document.createElement('p');

            p.className = 'journal-paragraph';

            DOM.letterContainer.appendChild(p);
            const paragraphs =
                DOM.letterContainer.querySelectorAll('.journal-paragraph');

            paragraphs.forEach((item, index) => {

                const age = paragraphs.length - 1 - index;

                if (age === 0) {

                    item.style.opacity = '1';

                }

                else if (age === 1) {

                    item.style.opacity = '.55';

                }

                else if (age === 2) {

                    item.style.opacity = '.25';

                }

                else {

                    item.style.opacity = '0';

                }

            });

            await StoryEngine._typeText(
                p,
                para,
                55
            );

            await Util.wait(1000);
        }

        DOM.typewriterAudio.pause();

        DOM.typewriterAudio.currentTime = 0;
        DOM.letterContainer.scrollTop = 0;
        // DOM.letterContainer.classList.add('animate-letter');

        await Util.wait(CONFIG.letter.duration);

        // Fade to black
        const blackout = document.createElement('div');
        blackout.style.cssText = `
            position:fixed;inset:0;background:#111111;
            opacity:0;z-index:99999;
            transition:opacity 3s ease;
            display:flex;justify-content:center;align-items:center;
            font-family:'Playfair Display',serif;
            font-size:clamp(1.8rem,3vw,2.8rem);
            color:rgba(255,255,255,0);
            letter-spacing:.06em;
        `;
        blackout.textContent = 'A New Journey Begins ❤️';
        document.body.appendChild(blackout);

        await Util.wait(100);
        blackout.style.opacity = '1';
        await Util.wait(2000);
        blackout.style.color = 'rgba(255,255,255,0.85)';
        await Util.wait(3000);
    },

};

/* =======================================================
   MOVIE CONTROLLER — Single master orchestrator
======================================================= */

const MovieController = {

    _started: false,

    async start() {
        if (this._started) return;
        this._started = true;

        // Start ambient particles
        ParticleEngine.start();

        // Scene 1: Loader
        await LoaderEngine.play();

        // Scene 2: Intro Quote
        await IntroEngine.play();

        // Scene 3: Story (awaited — Promise-based)
        await StoryEngine.play();
        DOM.bgMusic.volume = 0.35;

        DOM.bgMusic.loop = true;

        DOM.bgMusic.play();

        // Scene 4: Childhood
        await MemoryEngine.playChildhood();

        // Scene 5: Growth
        await MemoryEngine.playGrowth();

        // Scene 6: Present
        await MemoryEngine.playPresent();
        DOM.bgMusic.pause();

        DOM.bgMusic.currentTime = 0;

        // Scene 7: Gift (awaited — event-driven Promise)
        await GiftEngine.play();

        // Scene 8: Celebration
        await CelebrationEngine.play();

        // Scene 9: Letter + Fade to Black
        await LetterEngine.play();

        // The End
        ParticleEngine.stop();
    },

};

/* =======================================================
   INITIALIZATION
======================================================= */

(async function init() {

    // All scenes start hidden (CSS default opacity:0, visibility:hidden)
    // Show the opening screen first
    OpeningController.init();

    // Wait for user tap
    await OpeningController.waitForTap();

    // Dismiss opening
    await OpeningController.dismiss();

    // Begin the movie
    MovieController.start()

})();

/* =======================================================
   END OF SCRIPT
======================================================= */