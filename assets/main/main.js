
/* 
1. Render song -> oke
2. Scroll top -> oke
3. Play / pause / seek -> oke
4. CD rotate -> oke
5. Next / prev -> oke
6. Random -> oke
7. Next / Repeat when ended song  -> oke
8. Active song -> oke
9. Scroll active song into view -> oke
10. Play song when click -> oke
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const audio = $('#audio');
const player = $('.player');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const progress = $('#progress');
const playList = $('.play-list');
const cdThumb = $('.cd .cd-thumb');
const randomBtn = $('.btn-random');
const playBtn = $('.btn-toggle-play');
const nameSong = $('.header .name-song-playing');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {   
            name: 'Red Line',
            singer: 'Anna Yvette',
            path: 'assets/songs/anna-yvette-red-line-synthwave-ncs-copyright-free-music.mp3',
            img: 'assets/imgs/song1.jpg'
        },
        {   
            name: 'Enslaved',
            singer: 'Barren Gates & M.I.M.E',
            path: 'assets/songs/barren-gates-m.i.m.e-enslaved-trap-ncs-copyright-free-music.mp3',
            img: 'assets/imgs/song2.jpg'
        },
        {   
            name: 'Egzod - Rise Up',
            singer: 'Veronica Bravo & M.I.M.E',
            path: 'assets/songs/egzod-rise-up-ft.veronica-bravo-m.i.m.e-trap-ncs-copyright-free-music.mp3',
            img: 'assets/imgs/song3.png'
        },
        {   
            name: 'Outlaw ',
            singer: 'feat. Miss Mary',
            path: 'assets/songs/it-s-different-outlaw-feat.miss-mary-dnb-ncs-copyright-free-music.mp3',
            img: 'assets/imgs/song4.png'
        },
        {   
            name: 'Lost Sky - Fearless',
            singer: 'feat. Chris Linton',
            path: 'assets/songs/lost-sky-fearless-pt.ii-feat.chris-linton-trap-ncs-copyright-free-music.mp3',
            img: 'assets/imgs/song5.png'
        },
        {   
            name: 'Unknown Brain - Superhero',
            singer: 'feat. Chris Linton',
            path: 'assets/songs/unknown-brain-superhero-feat.chris-linton-trap-ncs-copyright-free-music.mp3',
            img: 'assets/imgs/song6.png'
        },
        {   
            name: 'Warriyo - Mortals',
            singer: 'feat. Laura-Brehm',
            path: 'assets/songs/warriyo-mortals-feat.laura-brehm-future-trap-ncs-copyright-free-music.mp3',
            img: 'assets/imgs/song7.png'
        },
        {   
            name: 'Tamada - Remix',
            singer: 'Miyagi-x-Endshpil',
            path: 'assets/songs/miyagi-x-endshpil-tamada-japandee-remix.mp3',
            img: 'assets/imgs/song8.png'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.img}');"> 
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        });

       playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        _this = this;

        // Handle rotate cd thumb
        const cdThumbAnimate = cdThumb.animate([
           {transform: 'rotate(360deg)'}
        ], {
            duration: 16000, //16 seconds
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Handle resize Cd 
        const cdWidth = cd.clientWidth;

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = (newCdWidth / cdWidth) > 0 ? newCdWidth / cdWidth : 0;
        }

        // Handle when click play btn
        playBtn.onclick = function() {
           
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Handle when audio playing
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Handle when audio playing
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // When the current playback change
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        }

        // Hanlde update times song
        audio.onupdate = function() {
            console.log(123);
        }
       

        // Handle click next btn (next song)
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
         
        }

        // Handle click prev btn (prev song)
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Handle when click random btn (random song)
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);
        }

        // Handle when click repeat btn (repeat song)
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
        }

        // Handle  next / repeat when song ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        
        // Handle play song when click
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const option = e.target.closest('.option');

            // When click song 
            if (songNode && !option) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                audio.play();
            }
            // When click option
            else if (option) {
                console.log('option');
            }

        }
        
    },
    scrollToActiveSong: function() {
        const option = {
            behavior: 'smooth',
            block: 'end',
        }
        
        $('.song.active').scrollIntoView(option); 
       
    },
    loadCurrentSong: function() {
        nameSong.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;

        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        } 
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = (this.songs.length - 1);
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
       
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
       
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Define propertis app
        this.defineProperties();
        
        // Handle events listener
        this.handleEvents();

        // Load current song (first list) in dashboard
        this.loadCurrentSong(); 

        // Render song for playList
        this.render();
    
    }
}


app.start();




