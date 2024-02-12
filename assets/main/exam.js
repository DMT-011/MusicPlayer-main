/* 
* Render song playlist.
* Add song in playlist to dashboard ( name, cdThumb).
* Cd resize when scroll.
* Play / pause song .
* Cd rotate .
* Next , prev song. seek.
* Random, repeat song
* Play song when click song item in playlist.
*/

// random k bi trung lai oke 
// 

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const nameSong = $('.header .name-song-playing');
const audio = $('#audio');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.play-list');
const progress = $('#progress');
const progressBar = $('.progress-bar');
const currentTimeSong = $('#timer .current-time');
const durationSong = $('#timer .duration-time');
const volume = $('.volume-slider input[type="range"]');
const volumeVal = $('.volume-block .value');
const volumeBtn = $('.volume-btn');
const volumeBlock = $('.volume-block');
const closeBtnVl = $('.volume-block .close-btn');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isHover: false,
    listSongPlayed: [],
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
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function() {
      const htmls = this.songs.map((song, index) => {
        return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}');" >
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
    handleEvents: function() {
        _this = this;

        // Handle cd rotate 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)',}
        ], {
            duration: 14000, // 14 seconds
            iterations: Infinity,
        });
        cdThumbAnimate.pause();
    

        // Handle resize cd when scroll
        const cdWidth = cd.clientWidth;
        
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth > 0 ? (newCdWidth / cdWidth) : 0; 
        }

        // Handle when click play (play song)
        playBtn.onclick = function() {

            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Handle when audio play 
        audio.onplay = function() {
            player.classList.add('playing');
            _this.isPlaying = true;
            cdThumbAnimate.play();
        }

        // Handle when audio pause
        audio.onpause = function() {
            player.classList.remove('playing');
            _this.isPlaying = false;
            cdThumbAnimate.pause();
        }

        // Handle when click next btn (next song)
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Handle when prev next btn (prev song)
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Hanlde update progress && timer
        audio.ontimeupdate = function() {
            if (audio.duration) {
                // update progress
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                
                progress.value = progressPercent;
                progressBar.style.width = progressPercent + '%';

                // Update time
                const currentMin = Math.floor(audio.currentTime / 60);
                let currentSec = Math.floor(audio.currentTime % 60);

                if (currentSec < 10) {
                    currentSec = `0${currentSec}`;
                }
                
                currentTimeSong.textContent = `${currentMin}:${currentSec}`;
            }

            
           
        }

        // Hadle update time song 
        audio.onloadeddata = function() {
            if (audio.duration) {
                const totalMin = Math.floor(audio.duration / 60);
                let totalSec = Math.floor(audio.duration % 60);

                if (totalSec < 10) {
                    totalSec = `0${totalSec}`;
                }
                
                durationSong.textContent = `${totalMin}:${totalSec}`;

                volumeVal.textContent = volume.value;

            }
        }

        // Handle when seek song 
        progress.oninput = function() {
            const seekTime = (progress.value * audio.duration) / 100 ;

            audio.currentTime = seekTime;
        }
        

        // Handle when click random btn (radom song)
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);
        }

        // Handle when click repeat btn (repeat song)
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
        }
        
        // Handle next / repeat when song ended.
        audio.onended = function() {
            if (_this.isRepeat) {
                this.play();
            } else {
                nextBtn.click();
            }
        }

        // Handle playing song when click song item in playlist
        playList.onclick = function(e) {
           const songNode = e.target.closest('.song:not(.song.active)');
           const option = e.target.closest('.option');

            // When click song item
            if (songNode && !option) {
               _this.currentIndex = Number(songNode.dataset.index);
               _this.loadCurrentSong();
               _this.render();
               audio.play();
            } 
            // When click option
            else if(option) {
                // console.log(option);
            }
        }

        // Handle increase or decrease volume song
        volume.oninput = function() {
            const value = volume.value / 100;

            volumeVal.textContent = volume.value;
            audio.volume = value;
        }

        // Handle when click volume btn
        volumeBtn.onclick = function() {
            volumeBlock.classList.toggle('active');
        }
       
        // Handle hidden block volume when click close btn
        closeBtnVl.onclick = function() {
            volumeBlock.classList.remove('active');
        }

    },
    scrollToActiveSong: function() {
        const option1 = {
            behavior: 'smooth',
            block: 'end'
        };

        $('.song.active').scrollIntoView(option1);
       
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
    randomSong: function() {
        let newCurrentIndex;
       
        do {
            // random index 
            newCurrentIndex = Math.floor(Math.random() * this.songs.length);
            
            if (this.listSongPlayed.length === this.songs.length) {
                this.listSongPlayed = [];
            }

        } while (newCurrentIndex === this.currentIndex || this.listSongPlayed.includes(newCurrentIndex));

        this.listSongPlayed.push(newCurrentIndex);
        this.currentIndex = newCurrentIndex;
        this.loadCurrentSong();
       

    },
    start: function() {

        // Define property in object
        this.defineProperties();
        
        // Handle events listener dom
        this.handleEvents();
        
        // Load current song 
        this.loadCurrentSong();

        // Render song to playlist
        this.render();
    }
};


app.start();
