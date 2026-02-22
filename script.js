const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countdownText = document.getElementById("countdown");

let photos = [];

// REQUEST CAMERA
navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
.then(stream => {
  video.srcObject = stream;
})
.catch(()=>{
  alert("Please allow camera access to use the photobooth.");
});

async function startBooth(){
  photos = [];
  for(let i=0; i<3; i++){
    await countdown(3);
    capture();
    await sleep(500);
  }
  drawLayout();
}

// Countdown timer
function countdown(sec){
  return new Promise(resolve=>{
    let s = sec;
    countdownText.innerText = s;
    let timer = setInterval(()=>{
      s--;
      countdownText.innerText = s>0 ? s : "📸";
      if(s<0){
        clearInterval(timer);
        countdownText.innerText = "";
        resolve();
      }
    },1000);
  });
}

// Capture photo (not mirrored)
function capture(){
  const temp = document.createElement("canvas");
  temp.width = 300;
  temp.height = 400;
  const tempCtx = temp.getContext("2d");

  // Draw video as-is (no mirroring)
  tempCtx.drawImage(video, 0, 0, 300, 400);

  photos.push(temp);
}

// Draw layout and caption
function drawLayout(){
  const layout = document.getElementById("layout").value;
  const caption = document.getElementById("caption").value;

  if(layout==="strip"){
    canvas.width=320; canvas.height=980;
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    let y=20;
    photos.forEach(p=>{
      ctx.drawImage(p,10,y,300,400);
      y+=420;
    });
  }

  if(layout==="grid"){
    canvas.width=640; canvas.height=640;
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(photos[0],10,10,300,300);
    ctx.drawImage(photos[1],330,10,300,300);
    ctx.drawImage(photos[2],170,330,300,300);
  }

  if(layout==="polaroid"){
    canvas.width=340; canvas.height=520;
    ctx.fillStyle="white";
    ctx.fillRect(0,0,340,520);
    ctx.drawImage(photos[0],20,20,300,360);
  }

  ctx.fillStyle="black";
  ctx.font="24px Arial";
  ctx.textAlign="center";
  ctx.fillText(caption, canvas.width/2, canvas.height-20);
}

// Download photo
function download(){
  const link = document.createElement("a");
  link.download = "photobooth.png";
  link.href = canvas.toDataURL();
  link.click();
}

// Save photo to gallery
function saveGallery(){
  const data = canvas.toDataURL();
  let gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
  gallery.push(data);
  localStorage.setItem("gallery", JSON.stringify(gallery));
  alert("Saved to gallery!");
}

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }
