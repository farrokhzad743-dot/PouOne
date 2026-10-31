(function(){
  "use strict";
  var d=document,root=d.documentElement,cfg=window.POUONE_CONFIG||{},P=window.POUONE_PRODUCTS||{};
  root.classList.add("js");
  var $=function(s,c){return(c||d).querySelector(s)};

  /* حالت تیره/روشن (پیش‌فرض: روشن) */
  var KEY="pouone-theme",saved=null;
  try{saved=localStorage.getItem(KEY)}catch(e){}
  function setTheme(t){
    root.setAttribute("data-theme",t);
    var m=$('meta[name="theme-color"]');if(m)m.content=t==="dark"?"#060b18":"#e8eefa";
  }
  setTheme(saved==="dark"?"dark":"light");
  $("#theme").addEventListener("click",function(){
    var t=root.getAttribute("data-theme")==="dark"?"light":"dark";
    setTheme(t);try{localStorage.setItem(KEY,t)}catch(e){}
  });

  /* نمایش با اسکرول */
  var els=d.querySelectorAll(".reveal");
  els.forEach(function(el,i){el.style.setProperty("--d",(i%4)*.08+"s")});
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
  }else els.forEach(function(el){el.classList.add("in")});

  /* صفحه محصول (مسیر جدید: #نام-محصول) */
  var home=$("#home"),pv=$("#pv"),baseTitle=d.title,wasProduct=false,cameFromHome=false,booted=false,savedY=null;
  function safe(u){return typeof u==="string"&&(/^https:\/\//i.test(u)||/^[\w\-.]+$/.test(u))}
  function el(tag,cls,txt){var n=d.createElement(tag);if(cls)n.className=cls;if(txt)n.textContent=txt;return n}

  function fill(id){
    var p=P[id],card=$('.card[data-p="'+id+'"]');
    pv.setAttribute("data-p",id);
    $("#pv-logo").src=id+".webp";
    $("#pv-title").textContent=p.name;
    $("#pv-tag").textContent=card?$(".card__desc",card).textContent:"";
    $("#pv-desc").textContent=p.description;
    var ul=$("#pv-uses");ul.textContent="";
    p.uses.forEach(function(t){ul.appendChild(el("li","",t))});
    var box=$("#pv-actions");box.textContent="";
    var dl=(cfg.downloads||{})[id]||{};
    [["android","نسخه اندروید"],["windows","نسخه ویندوز"]].forEach(function(o){
      var a=el("a","btn btn--c"),u=dl[o[0]];
      if(safe(u)){a.href=u;a.textContent="دانلود "+o[1];a.setAttribute("download","")}
      else{a.textContent="به‌زودی: "+o[1];a.setAttribute("aria-disabled","true")}
      box.appendChild(a);
    });
    var more=$("#pv-more");more.textContent="";
    Object.keys(P).forEach(function(k){
      if(k===id)return;
      var a=el("a","glass");a.href="#"+k;a.setAttribute("data-p",k);
      a.addEventListener("click",function(e){e.preventDefault();location.replace("#"+k)});
      var im=el("img");im.src=k+".webp";im.width=28;im.height=28;im.alt="";
      var s=el("span","",P[k].name);s.lang="en";s.dir="ltr";
      a.appendChild(im);a.appendChild(s);more.appendChild(a);
    });
  }

  function route(){
    var id=decodeURIComponent(location.hash.slice(1));
    if(Object.prototype.hasOwnProperty.call(P,id)){
      if(!wasProduct){cameFromHome=booted;savedY=scrollY}
      home.hidden=true;pv.hidden=false;fill(id);
      d.title=P[id].name+" | PouOne";
      pv.classList.remove("enter");void pv.offsetWidth;pv.classList.add("enter");
      scrollTo({top:0,behavior:"instant"});
      wasProduct=true;
    }else{
      pv.hidden=true;home.hidden=false;d.title=baseTitle;
      var t=id&&d.getElementById(id);
      if(wasProduct&&cameFromHome&&savedY!==null)scrollTo({top:savedY,behavior:"instant"});
      else scrollTo(t?{top:t.getBoundingClientRect().top+scrollY-96,behavior:wasProduct?"instant":"smooth"}:{top:0,behavior:wasProduct?"instant":"smooth"});
      wasProduct=false;cameFromHome=false;
    }
  }
  addEventListener("hashchange",route);
  route();booted=true;

  /* «بازگشت»: اگر از صفحه اصلی آمده‌ایم، یک قدم عقب می‌رویم تا تاریخچه دوبل نشود */
  $(".pv__back").addEventListener("click",function(e){
    if(cameFromHome){e.preventDefault();history.back()}
  });

  $("#year").textContent=new Date().getFullYear();
})();
