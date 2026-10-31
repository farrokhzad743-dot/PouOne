(function(){
  "use strict";
  var d=document,root=d.documentElement,cfg=window.POUONE_CONFIG||{},P=window.POUONE_PRODUCTS||{};
  root.classList.add("js");
  var $=function(s,c){return(c||d).querySelector(s)};

  /* فونت گوگل بدون مسدود کردن نمایش صفحه */
  var gf=d.getElementById("gfont");
  if(gf){if(gf.sheet)gf.media="all";else gf.addEventListener("load",function(){gf.media="all"})}

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
  var metaDesc=$('meta[name="description"]'),baseDesc=metaDesc?metaDesc.content:"";
  var shareT=d.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]'),shareD=d.querySelectorAll('meta[property="og:description"],meta[name="twitter:description"]');
  var baseShareT=shareT.length?shareT[0].content:"",baseShareD=shareD.length?shareD[0].content:"";
  function setShare(t,desc){shareT.forEach(function(m){m.content=t});shareD.forEach(function(m){m.content=desc})}
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
      d.title=P[id].name+" | PouOne";if(metaDesc)metaDesc.content=P[id].description;setShare(d.title,P[id].description);
      pv.classList.remove("enter");void pv.offsetWidth;pv.classList.add("enter");
      scrollTo({top:0,behavior:"instant"});
      wasProduct=true;
    }else{
      pv.hidden=true;home.hidden=false;d.title=baseTitle;if(metaDesc)metaDesc.content=baseDesc;setShare(baseShareT,baseShareD);
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

  /* ---- انیمیشن‌های بیشتر (فقط transform و opacity؛ سبک) ---- */
  var calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine=matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* تیتر: ظاهر شدن کلمه‌به‌کلمه */
  var h1=$(".hero h1");
  if(h1){
    if(!calm){
      var words=h1.textContent.trim().split(/\s+/);h1.textContent="";
      words.forEach(function(w,i){
        var o=el("span","w"+(i>=words.length-2?" hl":"")),sp=el("span","",w);
        sp.style.setProperty("--i",i);o.appendChild(sp);h1.appendChild(o);
        if(i<words.length-1)h1.appendChild(d.createTextNode(" "));
      });
    }
    h1.classList.add("split");
  }

  /* نوار پیشرفت اسکرول */
  var bar=$("#progress"),tick=false;
  function prog(){tick=false;var h=root.scrollHeight-innerHeight;bar.style.setProperty("transform","scaleX("+(h>0?Math.min(scrollY/h,1):0).toFixed(4)+")")}
  addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(prog)}},{passive:true});
  prog();

  /* ویژه موس (ویندوز/دسکتاپ): پارالکس هیرو، شیب و نور کارت‌ها، دکمه‌های مغناطیسی */
  if(fine&&!calm){
    var vis=$(".hero__visual"),raf=0,nx=0,ny=0;
    addEventListener("pointermove",function(e){
      nx=e.clientX/innerWidth-.5;ny=e.clientY/innerHeight-.5;
      if(raf)return;
      raf=requestAnimationFrame(function(){raf=0;if(vis&&!home.hidden&&scrollY<innerHeight){vis.style.setProperty("--px",(nx*2).toFixed(3));vis.style.setProperty("--py",(ny*2).toFixed(3))}});
    },{passive:true});
    d.querySelectorAll(".card").forEach(function(c){
      c.addEventListener("pointermove",function(e){
        var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        c.style.setProperty("--mx",(x*100).toFixed(1)+"%");c.style.setProperty("--my",(y*100).toFixed(1)+"%");
        c.style.setProperty("--rx",((.5-y)*7).toFixed(2)+"deg");c.style.setProperty("--ry",((x-.5)*7).toFixed(2)+"deg");
      });
      c.addEventListener("pointerleave",function(){c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
    });
    d.querySelectorAll(".btn--primary,.btn--tg").forEach(function(b){
      b.addEventListener("pointermove",function(e){
        var r=b.getBoundingClientRect();
        b.style.setProperty("--tx",(((e.clientX-r.left)/r.width-.5)*10).toFixed(1)+"px");
        b.style.setProperty("--ty",(((e.clientY-r.top)/r.height-.5)*8).toFixed(1)+"px");
      });
      b.addEventListener("pointerleave",function(){b.style.setProperty("--tx","0px");b.style.setProperty("--ty","0px")});
    });
  }

  $("#year").textContent=new Date().getFullYear();
})();
