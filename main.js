var settingpopup = document.getElementById("settingpopup");
var body = document.getElementById("body");
var audioSrcList = document.getElementsByClassName("songsrc");
var audioList = [];
var songlistdiv = document.getElementById("songlist");
var selectOption = document.getElementById("select");
var isOnlyFav = false;
var isFavIcon = document.getElementById("fav");
var isPlayingSomething = false;
var searchInput = document.getElementById('search');
//

for(var i=0; i<audioSrcList.length; i++){
    const audio = {};
    audio.fav = false;
    audio.playing = false;
    var a = audioSrcList[i].src.split('/');
    var info = a[a.length - 1];
    info = decodeURI(info);
    info = info.split(' - ');
    info[1] = info[1].split('.mp3')[0];
    audio.title = info[0];
    audio.artist = info[1];
    audio.src = audioSrcList[i].src;

    audio.duration = audioSrcList[i].duration;

    var songdiv = loadSong(audio.title, audio.artist, audio.duration);
    songlistdiv.appendChild(songdiv);
    audio.songdiv = songdiv;
    audioList.push(audio);

    const songfav = audio.songdiv.getElementsByClassName('songfav')[0];
    songfav.addEventListener('click', ()=>{
        if(audio.fav == false){
            audio.fav = true;
            songfav.classList.add('songliked');
        }else{
            audio.fav = false;
            songfav.classList.remove('songliked');
        }
        reloadList();
    });

    const songDown = audio.songdiv.getElementsByClassName('songdownload')[0];
    songDown.addEventListener('click', ()=>{
        var a = document.createElement('a');
        a.setAttribute('href', audio.src);
        a.setAttribute('download', '');
        body.appendChild(a);
        a.click();
        body.removeChild(a);
    });

    const songPlay = audio.songdiv.getElementsByClassName('songplay')[0];
    const songAudio = audioSrcList[i];
    const navNow = {};
    navNow.div = audio.songdiv.getElementsByClassName('navNow')[0];
    audio.songPlayFunction = ()=>{
        if(audio.playing == true){
            audio.playing = false;
            songPlay.classList.remove('songpause');
            songAudio.pause();
            clearInterval(navNow.interval);
            isPlayingSomething = false;
        }else{
            if(isPlayingSomething == true){
                for(var j=0; j<audioList.length; j++){
                    if(audioList[j].playing == true){
                        audioList[j].songPlayFunction();
                    }
                }
            }

            audio.playing = true;
            isPlayingSomething = true;
            
            songPlay.classList.add('songpause');
            songAudio.play();
            navNow.interval = setInterval(()=>{
                navNow.div.style.width = (songAudio.currentTime / audio.duration * 100) + '%';
            }, 100);
        }
    }
    
    songPlay.addEventListener('click', audio.songPlayFunction);


}

//

function settingOpen(){
    settingpopup.style.visibility = 'visible';
}

function settingClose(){
    settingpopup.style.visibility = 'hidden';
}
//
function themeBasic(){
    body.classList = '';
}
function themeDark(){
    body.classList = 'dark';
}
function themeColorful(){
    body.classList = 'colorful';
}

function loadSong(title, artist, dur){
    var song = document.createElement('div');
    song.className = 'song';
    var playicon = document.createElement('div');
    playicon.className = 'songplay icon';
    var songinfo = document.createElement('div');
    songinfo.className = 'songinfo';
    var songfav = document.createElement('div');
    songfav.className = 'songfav icon';
    var songdown = document.createElement('div');
    songdown.className = 'songdownload icon';
    
    song.appendChild(playicon);
    song.appendChild(songinfo);
    song.appendChild(songfav);
    song.appendChild(songdown);

    var div1 = document.createElement('div');
    var p1 = document.createElement('div');
    var p2 = document.createElement('div');
    p1.innerHTML = title;
    p2.innerHTML = artist;
    //
    var div2 = document.createElement("div");
    var navBar = document.createElement('div');
    navBar.className = 'navBar';
    var navNow = document.createElement('div');
    navNow.className = 'navNow';
    var duration = document.createElement("div");
    var min = Math.floor(dur / 60);
    var sec = Math.floor(dur % 60);
    if(sec < 10){
        sec = '0' + sec;
    }
    duration.innerHTML = min + ":" + sec;

    div2.appendChild(navBar);
    div2.appendChild(duration);
    songinfo.appendChild(div1);
    songinfo.appendChild(div2);
    //
    

    div1.appendChild(p1);
    div1.appendChild(p2);
    navBar.appendChild(navNow);

    return song;
}

function reloadList(){
    songlistdiv.innerHTML = "";
    var printedList = audioList;
    if(isOnlyFav){
        printedList = printedList.filter((a)=>{
            return a.fav == true;
        });



    }
    var search = searchInput.value;
    if(search != ''){
        printedList = printedList.filter((a)=>{
            return a.title.toUpperCase().includes(search.toUpperCase());
        });
    }
    for(var i=0; i<printedList.length; i++){
        var songdiv = printedList[i].songdiv;
        songlistdiv.appendChild(songdiv);
    }

}



function sortByAZ(){
    audioList = audioList.sort((a, b)=>{
        if(a.title < b.title){
            return -1;
        }else{
            return 1;
        }
    })
    reloadList();
}

function sortByZA(){
    audioList = audioList.sort((a, b)=>{
        if(a.title > b.title){
            return -1;
        }else{
            return 1;
        }
    })
    reloadList();
}

function sortByDuration(){
    audioList = audioList.sort((a, b)=>{
        if(a.duration > b.duration){
            return -1;
        }else{
            return 1;
        }
    })
    reloadList();
}

function sortByDurationrev(){
    audioList = audioList.sort((a, b)=>{
        if(a.duration < b.duration){
            return -1;
        }else{
            return 1;
        }
    })
    reloadList();
}

function sortSelection(event){
    var selection = selectOption.value;
    if(selection == 'alpha'){
        sortByAZ();
    }else if(selection == 'alphaRev'){
        sortByZA();
    }else if(selection == 'duration'){
        sortByDuration();
    }else if(selection == 'durationRev'){
        sortByDurationrev();
    }
}

selectOption.addEventListener('change', sortSelection);




function onlyFav(){
    if(isOnlyFav == true){
        isOnlyFav = false;
        isFavIcon.classList.remove('songliked');
    }else{
        isOnlyFav = true;
        isFavIcon.classList.add('songliked');
    }
    reloadList();
}

isFavIcon.addEventListener('click', onlyFav);

searchInput.addEventListener('keyup', reloadList);