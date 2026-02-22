const gallery=document.getElementById("gallery");
const photos=JSON.parse(localStorage.getItem("gallery")||"[]");

photos.forEach(p=>{
const img=document.createElement("img");
img.src=p;
img.style.width="200px";
img.style.margin="10px";
gallery.appendChild(img);
});
