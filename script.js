console.log("Its okay")
let currentPlayingElement
let currentSong = new Audio();
let play = document.querySelector('#play')
let currDuration;
let songs;
async function getSongs() {
    let b = await fetch("http://127.0.0.1:3000/songs/")
    let response = await b.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let songs = []
    for (const a of as) {
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href)
        }
    }
    // console.log(songs)
    return songs
}
function formatTime(seconds) {
    // Ensure the input is a number
    const totalSeconds = parseInt(seconds, 10);

    // Calculate minutes and remaining seconds
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    // Pad with leading zeros if needed
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}
function opac() {
    if (currentPlayingElement.previousElementSibling == null) {
        document.querySelector("#prev").style.opacity = "0.5"
    }
    else {
        document.querySelector("#prev").style.opacity = "1"
    }
    if (currentPlayingElement.nextElementSibling == null) {
        document.querySelector("#next").style.opacity = "0.5"
    }
    else {
        document.querySelector("#next").style.opacity = "1"
    }
}
function prev() {
    if (currentPlayingElement.previousElementSibling != null) {
        currentPlayingElement = currentPlayingElement.previousElementSibling
        playMusic(currentPlayingElement.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML)
    }
}
function next() {
    if (currentPlayingElement.nextElementSibling != null) {
        currentPlayingElement = currentPlayingElement.nextElementSibling
        playMusic(currentPlayingElement.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML)
    }
}
function setVolume(){
    currentSong.volume = document.querySelector(".square").style.height.slice(0 , -2)/100;
}
function playMusic(music) {
    if (currentSong.src == `http://127.0.0.1:3000/songs/${music.replaceAll(" ", "%20")}.mp3`) {
        playPause()
    }
    else {
        currentSong.src = `./songs/${music}.mp3`
        console.log(currentSong.src)
        setVolume()
        currentSong.play()
        console.log(music.concat(".mp3").toUpperCase())
        play.src = './pause.svg';
        document.querySelector(".songinfo").innerHTML = `<img class="invert" src='./musicNav.svg'><p>${music.concat(".mp3").toUpperCase()}</p>`
        document.querySelectorAll('.songCard img[src$="play.svg"], .songCard img[src$="pause.svg"]').forEach(img => {
            img.src = './play.svg';
        });
        if (currentPlayingElement) {
            currentPlayingElement.getElementsByTagName("img")[1].src = './pause.svg';
            opac()
        }
    }
}
function playPause() {
    if (currentSong.paused) {
        currentSong.play()
        play.src = './pause.svg'
        if (currentPlayingElement) {
            currentPlayingElement.getElementsByTagName("img")[1].src = './pause.svg';
        }
    }
    else {
        currentSong.pause()
        play.src = './play.svg'
        if (currentPlayingElement) {
            currentPlayingElement.getElementsByTagName("img")[1].src = './play.svg';
        }
    }
}
async function main() {
    //Getting list of all songs
    songs = await getSongs()
    console.log(songs)
    let songsUl = document.querySelector(".songs").getElementsByTagName("ul")[0]
    for (const song of songs) {
        let audio = new Audio(song)
        let newLi = document.createElement("li")
        let newimg = document.createElement("img")
        let newDiv = document.createElement("div")
        let src = './play.svg'
        newDiv.innerHTML = `<div><p>${audio.src.split('/songs/')[1].split('.mp3')[0].replaceAll('%20', ' ')}</p><p style="font-size: 9px;">S.R.Reddy</p></div><div class="flex items-center" style="gap: 10px; font-size: 14px;"><p>Play Now</p><img class="invert" src='${src}'></div>`
        newDiv.classList.add('flex', 'justify-between', 'items-center', 'songCardDiv')
        newimg.src = './music.svg'
        newimg.classList.add('invert')
        newimg.setAttribute('style', 'width: 40px;')
        newLi.classList.add('songCard')
        newLi.append(newimg)
        newLi.append(newDiv)
        songsUl.appendChild(newLi)
    }
    let songListUi = Array.from(document.querySelector(".songs").getElementsByTagName("li"))
    currentSong.src = `./songs/${songListUi[0].getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML}.mp3`
    currentPlayingElement = songListUi[0]
    opac()
    songListUi.forEach(e => {
        e.addEventListener("click", element => {
            let songName = e.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML
            console.log(songName, e)
            currentPlayingElement = e;
            playMusic(songName)
        })
    })
    document.querySelector(".songinfo").innerHTML = `<img class="invert" src='./musicNav.svg'><p>${currentSong.src.split('/songs/')[1].toUpperCase()}</p>`
    const IcurrentTime = formatTime(currentSong.currentTime);
    const Iduration = isNaN(currentSong.duration) ? "00:00" : formatTime(currentSong.duration);
    document.querySelector(".songtimeCurrent").innerHTML = `${IcurrentTime}`;
    document.querySelector(".songtimeDuration").innerHTML = `${Iduration}`;
    play.addEventListener("click", e => {
        playPause()

    })
    currentSong.addEventListener("timeupdate", () => {
        const currentTime = formatTime(currentSong.currentTime);
        const duration = isNaN(currentSong.duration) ? "00:00" : formatTime(currentSong.duration);
        document.querySelector(".songtimeCurrent").innerHTML = currentTime;
        document.querySelector(".songtimeDuration").innerHTML = duration;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        document.querySelector(".circle1").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
    document.querySelector('.seekbar').addEventListener("click", e => {
        let offsetPercent = e.offsetX / e.target.getBoundingClientRect().width * 100
        document.querySelector(".circle").style.left = offsetPercent + "%"
        document.querySelector(".circle1").style.left = offsetPercent + "%"
        currentSong.currentTime = currentSong.duration * (offsetPercent / 100)
        console.log(e)
        console.log(e)
    })
    document.querySelector('.seekbar1').addEventListener("click", e => {
        let offsetPercent = e.offsetX / e.target.getBoundingClientRect().width * 100
        document.querySelector(".circle1").style.left = offsetPercent + "%"
        document.querySelector(".circle").style.left = offsetPercent + "%"
        currentSong.currentTime = currentSong.duration * (offsetPercent / 100)
        console.log(e)
    })
    document.querySelector(".list").addEventListener("click", e => {
        document.querySelector(".leftd").style.transform = "translateX(0%)";
        document.querySelector(".list").style.visibility = "hidden";
        document.querySelector(".close").style.visibility = "visible";
        console.log(e)
    })
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".leftd").style.transform = "translateX(-110%)";
        document.querySelector(".list").style.visibility = "visible";
        document.querySelector(".close").style.visibility = "hidden";
        console.log(e)
    })
    document.querySelector("#prev").addEventListener("click", e => {
        prev()
    })
    document.querySelector("#next").addEventListener("click", e => {
        next()
    })
    document.addEventListener("keydown", e => {
        switch (e.code) {
            case "Space":
            case "KeyP":
                playPause()
                break
            case "ArrowLeft":
                prev()
                break
            case "ArrowRight":
                next()
        }
    })
    document.querySelector(".volumeBar").addEventListener("click", e => {
        const volumeBar = e.currentTarget; 
        const rect = volumeBar.getBoundingClientRect();
        const clickPosition = e.clientY - rect.top;
        const offsetPercent = (clickPosition / rect.height) * 100;
        document.querySelector(".square").style.height = (100 - offsetPercent) + "%";
        setVolume()
    })
}
main()