const CONFIG = {
  startDate: "2026-05-12T20:38:00",
  relationshipDate: "2026-07-23",
  youtubeId: "tyYwOEKKcZc",
  restartAt: 62,

  memories: [
    {
      img: "1.jpg",
      date: "12 · 05 · 26",
      a: "ตอนแรกก็ไม่ได้คิดหรอก",
      b: "ว่าเราจะได้คุยกัน"
    },
    {
      img: "2.jpg",
      date: "28 · 05 · 26",
      a: "จากคนที่ตอนแรก แค่มีเรื่องให้คุยกัน",
      b: "กลายเป็นคนที่อยากหาเรื่องมาคุยด้วยทุกวัน"
    },
    {
      img: "3.jpg",
      date: "18 · 06 · 26",
      a: "จากที่ไม่ได้คิดอะไร",
      b: "ก็เริ่มรู้สึกดี เวลาที่มีพี่โต๋อยู่ในแต่ละวัน"
    },
    {
      img: "4.jpg",
      date: "12 · 07 · 26",
      a: "รู้ตัวอีกที...",
      b: "หนูก็มีความทรงจำ ที่มีพี่อยู่เต็มไปหมดแล้ว"
    }
  ]
};


/* =========================================================
   BASIC
========================================================= */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let muted = false;
let captures = 0;
let idx = 0;
let rejects = 0;

const bgMusic = $("#bgMusic");

let fadeTimer = null;
let relationshipClockRAF = null;

if (bgMusic) {
  bgMusic.volume = .52;
}


/* =========================================================
   SCENE
========================================================= */

function show(id) {

  $$(".scene").forEach(scene => {

    scene.classList.toggle(
      "active",
      scene.id === id
    );

  });

}


/* =========================================================
   SOUND EFFECT
========================================================= */

function sfx(id, volume = .45) {

  if (muted) return;

  const audio = $(id);

  if (!audio) return;

  audio.currentTime = 0;
  audio.volume = volume;

  audio.play().catch(() => {});

}


/* =========================================================
   CAMERA FLASH
========================================================= */

function flash() {

  const f = $("#flash");

  if (!f) return;

  f.classList.remove("go");

  void f.offsetWidth;

  f.classList.add("go");

  sfx("#shutterSfx");

}


/* =========================================================
   SOUND BUTTON
========================================================= */

function syncSound() {

  const icon = $("#soundIcon");
  const label = $("#soundBtn small");

  if (icon) {
    icon.textContent = muted ? "×" : "♪";
  }

  if (label) {
    label.textContent =
      muted
        ? "SOUND OFF"
        : "SOUND ON";
  }

  if (bgMusic) {
    bgMusic.muted = muted;
  }

}


if ($("#soundBtn")) {

  $("#soundBtn").onclick = () => {

    muted = !muted;

    syncSound();

  };

}


/* =========================================================
   MUSIC
========================================================= */

function playMusic(sec = null, fade = true) {

  if (!bgMusic) return;

  clearInterval(fadeTimer);

  if (sec !== null) {

    try {
      bgMusic.currentTime = sec;
    } catch (e) {}

  }

  bgMusic.muted = muted;

  const soundBtn = $("#soundBtn");

  if (soundBtn) {
    soundBtn.classList.remove("hidden");
  }


  if (fade) {
    bgMusic.volume = 0;
  } else {
    bgMusic.volume = .52;
  }


  const playPromise = bgMusic.play();

  if (playPromise) {

    playPromise.catch(err => {
      console.log(
        "Music play blocked:",
        err
      );
    });

  }


  if (fade) {

    fadeTimer = setInterval(() => {

      bgMusic.volume =
        Math.min(
          .52,
          bgMusic.volume + .025
        );

      if (bgMusic.volume >= .52) {
        clearInterval(fadeTimer);
      }

    }, 70);

  }

  syncSound();

}


/* Fade เพลงแบบนุ่ม */

function fadeMusic(ms = 1500) {

  if (!bgMusic) return;

  clearInterval(fadeTimer);

  const start =
    bgMusic.volume;

  const steps =
    Math.max(
      1,
      Math.round(ms / 50)
    );

  let n = 0;


  fadeTimer = setInterval(() => {

    n++;

    bgMusic.volume =
      Math.max(
        0,
        start * (1 - n / steps)
      );

    if (n >= steps) {

      clearInterval(fadeTimer);

      bgMusic.pause();

      bgMusic.volume = .52;

    }

  }, 50);

}


/* ตัดเพลงทันที */

function cutMusic() {

  if (!bgMusic) return;

  clearInterval(fadeTimer);

  bgMusic.pause();

  bgMusic.volume = .52;

}


/* =========================================================
   BAD NEWS SOUND
========================================================= */

function playBadNewsSfx() {

  const sound =
    $("#badNewsSfx");

  if (!sound || muted) return;

  sound.currentTime = 0;

  sound.volume = .7;

  sound.play().catch(() => {});

}


/* =========================================================
   SHOOT POLAROID
========================================================= */

if ($("#shootBtn")) {

  $("#shootBtn").onclick = () => {

    flash();

    sfx("#ejectSfx", .28);


    const card =
      document.createElement("div");

    card.className =
      "captured-card";


    card.style.setProperty(
      "--x",
      (captures * 9 - 10) + "px"
    );

    card.style.setProperty(
      "--y",
      (captures * 4) + "px"
    );

    card.style.setProperty(
      "--r",
      (-7 + captures * 4.5) + "deg"
    );

    card.style.zIndex =
      captures + 1;


    card.innerHTML =
      '<div class="blank"></div>';


    $("#shotStack")
      .appendChild(card);


    requestAnimationFrame(() => {

      card.classList.add("arrive");

    });


    captures++;


    $("#cameraCount").textContent =
      captures + " / 4";


    if (captures < 4) {

      $("#shootBtn").textContent =
        "ถ่ายรูปที่ " +
        (captures + 1);

    }

    else {

      $("#shootBtn").textContent =
        "ถ่ายครบแล้ว";

      $("#shootBtn").disabled =
        true;


      setTimeout(() => {

        buildPaperStack();

        show("review");

      }, 1700);

    }

  };

}


/* =========================================================
   PAPER STACK
========================================================= */

function buildPaperStack() {

  const stack =
    $("#paperStack");

  if (!stack) return;


  stack.innerHTML = "";


  const transforms = [

    [-14, 7, -7],

    [12, -3, 5],

    [-5, -5, -2],

    [5, 4, 2]

  ];


  for (let i = 0; i < 4; i++) {

    const sheet =
      document.createElement("div");


    sheet.className =
      "stack-sheet";


    sheet.style.setProperty(
      "--x",
      transforms[i][0] + "px"
    );

    sheet.style.setProperty(
      "--y",
      transforms[i][1] + "px"
    );

    sheet.style.setProperty(
      "--r",
      transforms[i][2] + "deg"
    );


    sheet.style.animationDelay =
      (i * .22) + "s";


    sheet.style.zIndex =
      i + 1;


    sheet.innerHTML =
      '<div class="blank"></div>';


    stack.appendChild(sheet);

  }

}


/* =========================================================
   OPEN FIRST MEMORY
========================================================= */

if ($("#openMemoryBtn")) {

  $("#openMemoryBtn").onclick = () => {

    idx = 0;

    /* เพลงเริ่มตอนเปิดรูปแรก */

    playMusic(0, true);

    show("memory");

    renderMemory();

  };

}


/* =========================================================
   MEMORY
========================================================= */

function renderMemory() {

  const memory =
    CONFIG.memories[idx];


  $("#memoryIndex").textContent =
    `MEMORY 0${idx + 1} / 04`;


  $("#photo").src =
    memory.img;


  $("#photoDate").textContent =
    memory.date;


  $("#line1").textContent =
    memory.a;


  $("#line2").textContent =
    memory.b;


  const polaroid =
    $("#polaroid");


  const develop =
    polaroid.querySelector(".develop");


  polaroid.classList.remove(
    "exit",
    "enter"
  );


  void polaroid.offsetWidth;


  polaroid.classList.add(
    "enter"
  );


  develop.style.animation =
    "none";


  void develop.offsetWidth;


  develop.style.animation =
    "developPhoto 2.7s ease forwards";


  $("#caption")
    .classList.remove("show");


  $("#nextBtn")
    .classList.remove("show");


  $("#nextBtn").textContent =
    idx === 3
      ? "เก็บความทรงจำนี้ไว้"
      : "ดูรูปต่อไป";


  setTimeout(() => {

    $("#caption")
      .classList.add("show");

  }, 2300);


  setTimeout(() => {

    $("#nextBtn")
      .classList.add("show");

  }, 4100);

}


/* =========================================================
   NEXT MEMORY
========================================================= */

if ($("#nextBtn")) {

  $("#nextBtn").onclick = () => {

    const polaroid =
      $("#polaroid");


    polaroid.classList.add(
      "exit"
    );


    $("#caption")
      .classList.remove("show");


    $("#nextBtn")
      .classList.remove("show");


    if (idx < 3) {

      setTimeout(() => {

        idx++;

        renderMemory();

      }, 900);

    }

    else {

      setTimeout(() => {

        buildTable();

        show("tableScene");

      }, 900);

    }

  };

}


/* =========================================================
   MEMORY TABLE
========================================================= */

function buildTable() {

  const table =
    $("#photoTable");


  if (!table) return;


  table.innerHTML = "";


  const positions = [

    [4, 7, -8],

    [58, 5, 7],

    [8, 55, 5],

    [60, 52, -5]

  ];


  CONFIG.memories.forEach(
    (memory, i) => {

      const card =
        document.createElement("div");


      card.className =
        "table-polaroid";


      card.style.left =
        positions[i][0] + "%";


      card.style.top =
        positions[i][1] + "%";


      card.style.transform =
        `rotate(${positions[i][2]}deg)`;


      card.style.animationDelay =
        (i * .35) + "s";


      card.innerHTML =
        `<img src="${memory.img}">`;


      table.appendChild(card);

    }
  );


  startRelationshipClock();

}


/* =========================================================
   LIVE RELATIONSHIP CLOCK
========================================================= */

function startRelationshipClock() {

  if (relationshipClockRAF) {

    cancelAnimationFrame(
      relationshipClockRAF
    );

  }


  const start =
    new Date(
      CONFIG.startDate
    ).getTime();


  function tick() {

    const diff =
      Math.max(
        0,
        Date.now() - start
      );


    const day =
      Math.floor(
        diff / 86400000
      );


    const hour =
      Math.floor(
        (diff % 86400000)
        / 3600000
      );


    const minute =
      Math.floor(
        (diff % 3600000)
        / 60000
      );


    const second =
      Math.floor(
        (diff % 60000)
        / 1000
      );


    const ms =
      Math.floor(
        diff % 1000
      );


    $("#days").textContent =
      day;


    $("#hours").textContent =
      String(hour)
        .padStart(2, "0");


    $("#minutes").textContent =
      String(minute)
        .padStart(2, "0");


    $("#seconds").textContent =
      String(second)
        .padStart(2, "0");


    $("#milliseconds").textContent =
      String(ms)
        .padStart(3, "0");


    relationshipClockRAF =
      requestAnimationFrame(tick);

  }


  tick();

}


/* =========================================================
   DAYS → BLACKOUT
========================================================= */

if ($("#daysNextBtn")) {

  $("#daysNextBtn").onclick = () => {

    const btn =
      $("#daysNextBtn");


    btn.disabled = true;


    /* เพลงตัดทันที */

    cutMusic();


    btn.classList.add(
      "leaving"
    );


    /* เงียบเล็กน้อย */

    setTimeout(() => {

      /* เสียงข่าวร้าย */

      playBadNewsSfx();


      setTimeout(() => {

        show("blackout");


        setTimeout(() => {

          btn.disabled =
            false;

          btn.classList.remove(
            "leaving"
          );

        }, 1000);

      }, 650);

    }, 180);

  };

}


/* =========================================================
   BLACKOUT → CONFESSION
========================================================= */

if ($("#meaningBtn")) {

  $("#meaningBtn").onclick = () => {

    flash();


    const badNews =
      $("#badNewsSfx");


    if (badNews) {

      badNews.pause();

      badNews.currentTime = 0;

    }


    show("confession");


    buildFloating();

    runConfession();

  };

}


/* =========================================================
   FLOATING MEMORIES
========================================================= */

function buildFloating() {

  const floating =
    $("#floatingPhotos");


  if (!floating) return;


  floating.innerHTML = "";


  const positions = [

    [4, 12, -7],

    [78, 10, 6],

    [8, 70, 5],

    [80, 68, -5]

  ];


  CONFIG.memories.forEach(
    (memory, i) => {

      const card =
        document.createElement("div");


      card.className =
        "float-pol";


      card.style.left =
        positions[i][0] + "%";


      card.style.top =
        positions[i][1] + "%";


      card.style.setProperty(
        "--r",
        positions[i][2] + "deg"
      );


      card.style.transform =
        `rotate(${positions[i][2]}deg)`;


      card.innerHTML =
        `<img src="${memory.img}">`;


      floating.appendChild(card);

    }
  );

}


/* =========================================================
   CONFESSION TEXT
========================================================= */

function runConfession() {

  const lines =
    $$(".conf-line");


  let i = 0;


  lines.forEach(line => {

    line.classList.remove(
      "current"
    );

  });


  $("#toProposal")
    .classList.remove("show");


  function next() {

    if (i > 0) {

      lines[i - 1]
        .classList.remove(
          "current"
        );

    }


    if (i < lines.length) {

      lines[i]
        .classList.add(
          "current"
        );


      i++;


      setTimeout(
        next,
        i === 4
          ? 3000
          : 2700
      );

    }

    else {

      $("#toProposal")
        .classList.add(
          "show"
        );

    }

  }


  setTimeout(next, 700);

}


/* =========================================================
   GO TO PROPOSAL
========================================================= */

if ($("#toProposal")) {

  $("#toProposal").onclick =
    () => {

      show("proposal");

    };

}


/* =========================================================
   NO BUTTON
========================================================= */

const noWords = [

  "เดี๋ยว กดผิดป่าว",

  "คิดใหม่ได้นะ",

  "ยังจะตามมากดอีก 555",

  "โห ใจแข็งจัง",

  "โอเค ๆ"

];


function dodge(e) {

  if (rejects >= 5) return;


  if (e) {
    e.preventDefault();
  }


  rejects++;


  const button =
    $("#noBtn");


  const choices =
    $("#choices");


  button.textContent =
    noWords[rejects - 1];


  button.style.position =
    "absolute";


  button.style.transform =
    `translate(
      ${(Math.random() - .5)
        * Math.min(
          280,
          choices.clientWidth * .65
        )}px,
      ${(Math.random() - .5)
        * 90}px
    )`;


  if (rejects === 5) {

    setTimeout(() => {

      button.classList.add(
        "hidden"
      );


      $("#notReady")
        .classList.remove(
          "hidden"
        );

    }, 400);

  }

}


if ($("#noBtn")) {

  $("#noBtn").addEventListener(
    "mouseenter",
    dodge
  );


  $("#noBtn").addEventListener(
    "touchstart",
    dodge,
    {
      passive: false
    }
  );


  $("#noBtn").onclick =
    dodge;

}


/* =========================================================
   NOT READY
========================================================= */

if ($("#notReady")) {

  $("#notReady").onclick = () => {

    fadeMusic(850);

    show("wait");

  };

}


/* =========================================================
   YES — WE ARE OFFICIALLY TOGETHER
========================================================= */

if ($("#yesBtn")) {

  $("#yesBtn").onclick = () => {

    flash();

    sfx("#ejectSfx", .28);


    /*
      Angel Baby กลับมา
      ตอนตอบตกลง
      เริ่มที่ 01:02
    */

    playMusic(
      CONFIG.restartAt,
      true
    );


    show("success");


    $("#sinceText").textContent =
      "SINCE " +
      pretty(
        CONFIG.relationshipDate
      );


    /*
      สร้างเอฟเฟกต์ไว้บน BODY
      ไม่ได้อยู่ใน .success
      จึงไม่โดน scene/filter กลืน
    */

    requestAnimationFrame(() => {

      createLoveRain();


      setTimeout(() => {

        createLoveBurst();

      }, 300);

    });

  };

}


/* =========================================================
   HEART RAIN
========================================================= */

function createLoveRain() {

  /*
    ลบฝนชุดเก่าก่อน
    กันกรณีเปิดหน้า success ซ้ำ
  */

  document
    .querySelector(
      ".love-rain-global"
    )
    ?.remove();


  const rain =
    document.createElement("div");


  rain.className =
    "love-rain-global";


  /*
    สำคัญ:
    ใส่ลง BODY โดยตรง
  */

  document.body
    .appendChild(rain);


  const symbols = [

    "♡",
    "♡",
    "♡",
    "♥",
    "✦",
    "✧"

  ];


  for (
    let i = 0;
    i < 50;
    i++
  ) {

    const heart =
      document.createElement(
        "span"
      );


    heart.className =
      "rain-heart-global";


    heart.textContent =
      symbols[
        Math.floor(
          Math.random()
          * symbols.length
        )
      ];


    heart.style.left =
      Math.random() * 100
      + "vw";


    heart.style.fontSize =
      (
        14
        + Math.random() * 22
      )
      + "px";


    heart.style.animationDuration =
      (
        4
        + Math.random() * 5
      )
      + "s";


    /*
      animation delay ติดลบ
      = เปิดหน้ามาปุ๊บ
      มีหัวใจอยู่กลางจอเลย
    */

    heart.style.animationDelay =
      (
        -Math.random() * 8
      )
      + "s";


    heart.style.setProperty(
      "--drift",
      (
        -100
        + Math.random() * 200
      )
      + "px"
    );


    heart.style.setProperty(
      "--heart-opacity",
      (
        .35
        + Math.random() * .5
      )
    );


    rain.appendChild(heart);

  }

}


/* =========================================================
   HEART / STAR BURST
========================================================= */

function createLoveBurst() {

  document
    .querySelector(
      ".love-burst-global"
    )
    ?.remove();


  const burst =
    document.createElement("div");


  burst.className =
    "love-burst-global";


  document.body
    .appendChild(burst);


  const symbols = [

    "♡",
    "♥",
    "✦",
    "✧",
    "♡",
    "♥",
    "♡"

  ];


  const colors = [

    "#9e5f62",
    "#b96f73",
    "#cf8889",
    "#8f6863",
    "#d8a09b",
    "#e2b2aa"

  ];


  const total = 46;


  for (
    let i = 0;
    i < total;
    i++
  ) {

    const item =
      document.createElement(
        "span"
      );


    item.className =
      "burst-item-global";


    item.textContent =
      symbols[
        Math.floor(
          Math.random()
          * symbols.length
        )
      ];


    const angle =
      (
        Math.PI * 2 / total
      ) * i
      +
      Math.random() * .15;


    const distance =
      170
      + Math.random() * 350;


    const x =
      Math.cos(angle)
      * distance;


    const y =
      Math.sin(angle)
      * distance;


    item.style.setProperty(
      "--x",
      x + "px"
    );


    item.style.setProperty(
      "--y",
      y + "px"
    );


    item.style.setProperty(
      "--rotate",
      (
        -180
        + Math.random() * 360
      )
      + "deg"
    );


    item.style.fontSize =
      (
        18
        + Math.random() * 28
      )
      + "px";


    item.style.color =
      colors[
        Math.floor(
          Math.random()
          * colors.length
        )
      ];


    item.style.animationDelay =
      (
        Math.random() * .12
      )
      + "s";


    burst.appendChild(item);

  }


  /*
    Burst จบแล้วลบทิ้ง
    แต่ฝนหัวใจยังตกต่อ
  */

  setTimeout(() => {

    burst.remove();

  }, 2800);

}


/* =========================================================
   REMOVE LOVE EFFECTS
========================================================= */

function removeLoveEffects() {

  document
    .querySelector(
      ".love-rain-global"
    )
    ?.remove();


  document
    .querySelector(
      ".love-burst-global"
    )
    ?.remove();

}


/* =========================================================
   DATE FORMAT
========================================================= */

function pretty(dateString) {

  const date =
    new Date(dateString);


  return (
    String(
      date.getDate()
    ).padStart(2, "0")
    +
    " · "
    +
    String(
      date.getMonth() + 1
    ).padStart(2, "0")
    +
    " · "
    +
    date.getFullYear()
  );

}


/* =========================================================
   STORY
========================================================= */

if ($("#storyBtn")) {

  $("#storyBtn").onclick =
    async () => {

      /*
        ออกจากหน้า success
        = หยุดฝนหัวใจ
      */

      removeLoveEffects();


      await drawStory();


      show("story");

    };

}


/* =========================================================
   STORY → BACK
========================================================= */

if ($("#backBtn")) {

  $("#backBtn").onclick = () => {

    show("success");


    /*
      กลับมาหน้า success
      ให้ฝนหัวใจกลับมาด้วย
    */

    createLoveRain();

  };

}


/* =========================================================
   DOWNLOAD STORY JPG
========================================================= */

if ($("#shareStory")) {

  $("#shareStory").onclick =
    () => {

      const canvas =
        $("#storyCanvas");


      canvas.toBlob(
        blob => {

          if (!blob) return;


          const url =
            URL.createObjectURL(
              blob
            );


          const link =
            document.createElement(
              "a"
            );


          link.href =
            url;


          link.download =
            "officially-us-story.jpg";


          document.body
            .appendChild(link);


          link.click();


          link.remove();


          setTimeout(() => {

            URL.revokeObjectURL(
              url
            );

          }, 1500);

        },

        "image/jpeg",

        .95
      );

    };

}


/* =========================================================
   IMAGE COVER
========================================================= */

function cover(
  ctx,
  img,
  x,
  y,
  w,
  h
) {

  const imageRatio =
    img.width / img.height;


  const boxRatio =
    w / h;


  let sx = 0;
  let sy = 0;

  let sw =
    img.width;

  let sh =
    img.height;


  if (imageRatio > boxRatio) {

    sw =
      img.height
      * boxRatio;


    sx =
      (
        img.width
        - sw
      ) / 2;

  }

  else {

    sh =
      img.width
      / boxRatio;


    sy =
      (
        img.height
        - sh
      ) / 2;

  }


  ctx.drawImage(
    img,

    sx,
    sy,
    sw,
    sh,

    x,
    y,
    w,
    h
  );

}


/* =========================================================
   LOAD IMAGE
========================================================= */

async function load(src) {

  const image =
    new Image();


  image.src = src;


  try {

    await image.decode();

  }

  catch (e) {}


  return image;

}


/* =========================================================
   DRAW STORY CARD
========================================================= */

async function drawStory() {

  const canvas =
    $("#storyCanvas");


  const ctx =
    canvas.getContext("2d");


  const W = 1080;
  const H = 1920;


  /*
    Background
  */

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );


  gradient.addColorStop(
    0,
    "#eee8df"
  );


  gradient.addColorStop(
    .55,
    "#d9cec5"
  );


  gradient.addColorStop(
    1,
    "#bfaea4"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    W,
    H
  );


  /*
    Load 4 photos
  */

  const images =
    await Promise.all(

      CONFIG.memories.map(
        memory =>
          load(memory.img)
      )

    );


  const cards = [

    {
      x: 78,
      y: 260,
      w: 430,
      h: 570,
      r: -.075
    },

    {
      x: 575,
      y: 210,
      w: 350,
      h: 470,
      r: .07
    },

    {
      x: 135,
      y: 865,
      w: 330,
      h: 445,
      r: .055
    },

    {
      x: 500,
      y: 730,
      w: 470,
      h: 620,
      r: -.045
    }

  ];


  /*
    Draw Polaroids
  */

  cards.forEach(
    (card, i) => {

      ctx.save();


      ctx.translate(

        card.x
        + card.w / 2,

        card.y
        + card.h / 2

      );


      ctx.rotate(
        card.r
      );


      ctx.shadowColor =
        "rgba(63,48,40,.18)";


      ctx.shadowBlur =
        28;


      ctx.shadowOffsetY =
        15;


      ctx.fillStyle =
        "#f8f3ec";


      ctx.fillRect(

        -card.w / 2,

        -card.h / 2,

        card.w,

        card.h

      );


      cover(

        ctx,

        images[i],

        -card.w / 2 + 18,

        -card.h / 2 + 18,

        card.w - 36,

        card.h - 92

      );


      ctx.restore();

    }
  );


  /*
    Header
  */

  ctx.textAlign =
    "center";


  ctx.fillStyle =
    "#6f5e55";


  ctx.font =
    "24px Arial";


  ctx.fillText(
    "OFFICIALLY,",
    W / 2,
    120
  );


  ctx.fillStyle =
    "#443a35";


  ctx.font =
    "italic 88px Georgia";


  ctx.fillText(
    "Us.",
    W / 2,
    205
  );


  /*
    Main text
  */

  ctx.fillStyle =
    "#594b45";


  ctx.font =
    "italic 76px Georgia";


  ctx.fillText(
    "Taken.",
    W / 2,
    1465
  );


  ctx.fillStyle =
    "#78665e";


  ctx.font =
    "30px Arial";


  ctx.fillText(
    "and very happy about it.",
    W / 2,
    1515
  );


  ctx.fillStyle =
    "#8f7770";


  ctx.font =
    "21px Arial";


  ctx.fillText(
    'from “what are we?” to “that’s my person.”',
    W / 2,
    1570
  );


  /*
    Since
  */

  ctx.fillStyle =
    "#65554e";


  ctx.font =
    "22px Arial";


  ctx.fillText(
    "SINCE "
    +
    pretty(
      CONFIG.relationshipDate
    ),

    W / 2,

    1635
  );


  /*
    Link area
  */

  ctx.fillStyle =
    "rgba(248,243,236,.52)";


  round(
    ctx,
    310,
    1690,
    460,
    100,
    50
  );


  ctx.fill();


  ctx.fillStyle =
    "#8a746b";


  ctx.font =
    '24px "Noto Sans Thai", Arial';


  ctx.fillText(
    "วางลิงก์อวดคนอื่น ๆ ตรงนี้ได้เลย",
    W / 2,
    1750
  );


  /*
    Credit
  */

  ctx.fillStyle =
    "#76645c";


  ctx.font =
    "18px Arial";


  ctx.fillText(
    "by ig : tikki_card",
    W / 2,
    1850
  );

}


/* =========================================================
   ROUNDED RECT
========================================================= */

function round(
  ctx,
  x,
  y,
  w,
  h,
  radius
) {

  ctx.beginPath();


  ctx.moveTo(
    x + radius,
    y
  );


  ctx.arcTo(
    x + w,
    y,
    x + w,
    y + h,
    radius
  );


  ctx.arcTo(
    x + w,
    y + h,
    x,
    y + h,
    radius
  );


  ctx.arcTo(
    x,
    y + h,
    x,
    y,
    radius
  );


  ctx.arcTo(
    x,
    y,
    x + w,
    y,
    radius
  );


  ctx.closePath();

}


/* =========================================================
   FINAL GOODBYE
========================================================= */

function closeAfterGoodbye() {

  /*
    เอาหัวใจออกก่อน
  */

  removeLoveEffects();


  /*
    เพลงค่อย ๆ เบาลง
  */

  fadeMusic(1200);


  /*
    หน้า Text สุดท้าย
  */

  show("finalGoodbye");


  /*
    อยู่ 5 วินาที
    แล้วพยายามปิดเว็บ
  */

  setTimeout(() => {

    try {

      window.close();

    }

    catch (e) {}

  }, 5000);

}


if ($("#closeProgramBtn")) {

  $("#closeProgramBtn").onclick =
    closeAfterGoodbye;

}


if ($("#waitCloseBtn")) {

  $("#waitCloseBtn").onclick =
    closeAfterGoodbye;

}