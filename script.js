console.log("Its okay")
let currentPlayingElement
let currentSong = new Audio();
let play = document.querySelector('#play')
let currDuration;
let songs;
let folders = [];
let folder = "Hi Nana";
let songsUl = document.querySelector(".songs").getElementsByTagName("ul")[0]
let load = false
let tid;
async function getSongs() {
    let b = await fetch(`http://127.0.0.1:3000/songs/${folder.replaceAll(" ", "%20")}/`)
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
async function getFolders(params) {
    let b = await fetch("http://127.0.0.1:3000/songs/")
    let response = await b.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let folders = [];
    for (const a of as) {
        if (a.href.includes("songs")) {
            folders.push(a.href)
        }
    }
    return folders
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
function setVolume() {
    currentSong.volume = (document.querySelector(".square").style.height.slice(0, -1) / 100).toFixed(2);
}
function setVolumeByKeys(key) {
    const vol = document.querySelector(".square").style.height.slice(0, -1) / 100;
    if (vol < 1 && key == "ArrowUp") {
        if (1 - vol >= 0.05) {
            currentSong.volume = (currentSong.volume + 0.05).toFixed(2)
            document.querySelector(".square").style.height = Math.round(vol * 100) + 5 + "%"
        }
        else {
            currentSong.volume = 1
            document.querySelector(".square").style.height = "100%"
        }
    }
    else if (vol > 0 && key == "ArrowDown") {
        if (vol >= 0.05) {
            currentSong.volume = (currentSong.volume - 0.05).toFixed(2)
            document.querySelector(".square").style.height = Math.round(vol * 100 - 5) + "%"
        }
        else {
            currentSong.volume = 0
            document.querySelector(".square").style.height = "0%"
        }
    }
    let img = currentSong.volume > 0 ? "./volumeHigh.svg" : "./volumeMute.svg";
    document.querySelector(".volume").getElementsByTagName("img")[0].src = img;
}
function playMusic(music) {
    if (currentSong.src == `http://127.0.0.1:3000/songs/${folder.replaceAll(" ", "%20")}/${music.replaceAll(" ", "%20")}.mp3`) {
        playPause()
    }
    else {
        currentSong.src = `songs/${folder}/${music}.mp3`
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
function components(){
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
    play.addEventListener("click", e => {
        setVolume()
        playPause()
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
                break
            case "ArrowDown":
            case "ArrowUp":
                setVolumeByKeys(e.code)
                if(tid)
                    clearTimeout(tid)
                document.querySelector(".volumeBar").classList.remove("invisibility")
                tid = setTimeout(e=>{
                     document.querySelector(".volumeBar").classList.add("invisibility")
                }, 3000)
                break
        }
    })
    document.querySelector(".volumeBar").addEventListener("click", e => {
        const volumeBar = e.currentTarget;
        const rect = volumeBar.getBoundingClientRect();
        const clickPosition = e.clientY - rect.top;
        const offsetPercent = (clickPosition / rect.height) * 100;
        document.querySelector(".square").style.height = Math.round(100 - offsetPercent) + "%";
        setVolume()

    })
    document.querySelector(".volume").addEventListener("click", e => {
        document.querySelector(".volumeBar").classList.toggle("invisibility")
    })
     currentSong.addEventListener("ended",()=>{
        if(currentSong.duration == currentSong.currentTime)
        {
            next()
        }
    })
}
async function loadSongs() {
    songs = await getSongs(folder)
    for (const song of songs) {
        let audio = new Audio(song)
        let newLi = document.createElement("li")
        let newimg = document.createElement("img")
        let newDiv = document.createElement("div")
        let src = './play.svg'
        newDiv.innerHTML = `<div><p>${audio.src.split(`/songs/${folder.replaceAll(" ", "%20")}/`)[1].split('.mp3')[0].replaceAll('%20', ' ')}</p><p style="font-size: 9px;">${folder}</p></div><div class="flex items-center" style="gap: 10px; font-size: 14px;"><p>Play Now</p><img class="invert" src='${src}'></div>`
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
    if(load == false)
    {
        currentSong.src = `./songs/${folder}/${songListUi[0].getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML}.mp3`;
        currentPlayingElement = songListUi[0]
        load = true
    }
    opac()
    songListUi.forEach(e => {
        e.addEventListener("click", element => {
            let songName = e.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerHTML
            console.log(songName, e)
            currentPlayingElement = e;
            playMusic(songName)
        })
    })
    document.querySelector(".songinfo").innerHTML = `<img class="invert" src='./musicNav.svg'><p>${currentSong.src.split(`/${folder.replaceAll(" ", "%20")}/`)[1].toUpperCase()}</p>`
    const IcurrentTime = formatTime(currentSong.currentTime);
    const Iduration = isNaN(currentSong.duration) ? "00:00" : formatTime(currentSong.duration);
    document.querySelector(".songtimeCurrent").innerHTML = `${IcurrentTime}`;
    document.querySelector(".songtimeDuration").innerHTML = `${Iduration}`;
}
async function main() {
    //Getting list of all
    await loadSongs()
    folders = await getFolders("songs")
    console.log(folders)
    let playlist = document.querySelector(".playlist")
    console.log(playlist)
    folders.forEach(async fol => {
        let newDiv = document.createElement("div")
        let folderName = fol.split("/songs/")[1].replaceAll("%20", " ").slice(0, -1)
        let b = await fetch(`http://127.0.0.1:3000/songs/${folderName.replaceAll(" ", "%20")}/info.json`)
        let metadata = await b.json()
        newDiv.innerHTML = `<div class="play-wrapper"> <div class="play-button"><img src="./play-icon.svg" alt="Play"> </div></div>  <img  class="invert" style="z-index: 0;" src="./musicNav.svg" alt=""><h2></h2><p>Hariharan</p>`
        newDiv.getElementsByTagName("h2")[0].innerHTML = metadata.title;
        newDiv.getElementsByTagName("p")[0].innerHTML = metadata.singer;
        newDiv.classList.add("card")
        newDiv.dataset.folder = metadata.title;
        console.log(newDiv.dataset.folder)
        newDiv.addEventListener("click", async element=>{
            folder = newDiv.dataset.folder
            songsUl.innerHTML = ""
            songs = await loadSongs()
        })
        playlist.appendChild(newDiv)
    });
    components()
}
main()
