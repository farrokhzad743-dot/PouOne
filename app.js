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
  function safe(u){
    var ok=typeof u==="string"&&(/^https:\/\//i.test(u)||/^[\w\-.]+$/.test(u));
    if(!ok&&u&&window.console)console.warn("PouOne: لینک دانلود باید با https:// شروع شود یا نام فایل کنار index.html باشد:",u);
    return ok;
  }
  function el(tag,cls,txt){var n=d.createElement(tag);if(cls)n.className=cls;if(txt)n.textContent=txt;return n}

  function copyText(t,b){
    function done(){b.textContent="کپی شد";setTimeout(function(){b.textContent="کپی"},1600)}
    function legacy(){
      var ta=d.createElement("textarea");ta.value=t;ta.style.position="fixed";ta.style.opacity="0";
      d.body.appendChild(ta);ta.select();try{d.execCommand("copy");done()}catch(e){}d.body.removeChild(ta);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,legacy);else legacy();
  }
  function buildVerify(dl){
    var vf=$("#pv-verify");vf.textContent="";
    var ver=typeof dl.version==="string"?dl.version.trim():"",hs=dl.sha256||{},rows=0;
    if(ver)vf.appendChild(el("p","verify__ver","نسخه‌ی "+ver));
    [["android","اندروید"],["windows","ویندوز"]].forEach(function(o){
      var v=hs[o[0]];
      if(typeof v==="string"&&/^[a-f0-9]{64}$/i.test(v.trim())){
        v=v.trim();rows++;
        var r=el("div","hash"),c=el("code","",v),b=el("button","","کپی");b.type="button";
        r.appendChild(el("b","",o[1]));r.appendChild(c);r.appendChild(b);vf.appendChild(r);
        b.addEventListener("click",function(){copyText(v,b)});
      }else if(v&&window.console)console.warn("PouOne: هش SHA-256 باید ۶۴ کاراکتر هگز باشد:",o[0]);
    });
    if(rows){
      var tip=el("p","verify__tip","هش فایل دانلودشده را با مقدار بالا مقایسه کنید. در ویندوز: ");
      tip.appendChild(el("code","","certutil -hashfile نام‌فایل SHA256"));vf.appendChild(tip);
    }
    vf.hidden=!(ver||rows);
  }
  function fill(id){
    var p=P[id],card=$('.card[data-p="'+id+'"]');
    pv.setAttribute("data-p",id);
    $("#pv-logo").src=id+".webp";
    $("#pv-title").textContent=p.name;
    $("#pv-tag").textContent=card?$(".card__desc",card).textContent:"";
    $("#pv-desc").textContent=p.description;
    var ul=$("#pv-uses");ul.textContent="";
    (p.uses||[]).forEach(function(t){ul.appendChild(el("li","",t))});
    ul.previousElementSibling.hidden=!(p.uses&&p.uses.length);
    var box=$("#pv-actions");box.textContent="";
    var dl=(cfg.downloads||{})[id]||{};
    [["android","نسخه اندروید"],["windows","نسخه ویندوز"]].forEach(function(o){
      var a=el("a","btn btn--c"),u=dl[o[0]];
      if(safe(u)){a.href=u;a.textContent="دانلود "+o[1];a.setAttribute("download","")}
      else{a.textContent="به‌زودی: "+o[1];a.setAttribute("aria-disabled","true")}
      box.appendChild(a);
    });
    buildVerify(dl);
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

  function readHash(){
    try{return decodeURIComponent(location.hash.slice(1))}catch(e){return ""}
  }
  function known(id){
    if(!id||id.length>40||!/^[\w-]+$/.test(id))return false;
    if(Object.prototype.hasOwnProperty.call(P,id))return true;
    /* اگر products.js لود نشده بود، از روی خود کارت یک صفحه‌ی ساده می‌سازیم */
    var c=$('.card[data-p="'+id+'"]');
    if(c){P[id]={name:$(".card__name",c).textContent,description:$(".card__desc",c).textContent,uses:[]};return true}
    return false;
  }
  var lastId="",legal=$("#legal");
  function restart(n){n.classList.remove("enter");void n.offsetWidth;n.classList.add("enter")}
  function enter(){if(!wasProduct){cameFromHome=booted;savedY=scrollY}}
  function route(){
    var id=readHash();
    if(id==="privacy"){
      enter();home.hidden=true;pv.hidden=true;legal.hidden=false;lastId="privacy";
      d.title="حریم خصوصی | PouOne";
      var pd="حریم خصوصی وب‌سایت PouOne: چه اطلاعاتی جمع نمی‌شود و از چه سرویس‌های بیرونی استفاده شده است.";
      if(metaDesc)metaDesc.content=pd;setShare(d.title,pd);
      restart(legal);scrollTo({top:0,behavior:"instant"});
      if(booted)$("#legal-title").focus({preventScroll:true});
      wasProduct=true;return;
    }
    legal.hidden=true;
    if(known(id)){
      enter();
      home.hidden=true;pv.hidden=false;fill(id);lastId=id;
      d.title=P[id].name+" | PouOne";if(metaDesc)metaDesc.content=P[id].description;setShare(d.title,P[id].description);
      restart(pv);
      scrollTo({top:0,behavior:"instant"});
      if(booted)$("#pv-title").focus({preventScroll:true});
      wasProduct=true;
    }else{
      pv.hidden=true;home.hidden=false;d.title=baseTitle;if(metaDesc)metaDesc.content=baseDesc;setShare(baseShareT,baseShareD);
      var t=id&&/^[\w-]+$/.test(id)&&d.getElementById(id);
      if(wasProduct&&cameFromHome&&savedY!==null)scrollTo({top:savedY,behavior:"instant"});
      else scrollTo(t?{top:t.getBoundingClientRect().top+scrollY-96,behavior:wasProduct?"instant":"smooth"}:{top:0,behavior:wasProduct?"instant":"smooth"});
      if(wasProduct&&lastId){var cd=lastId==="privacy"?$(".legal-link"):$('.card[data-p="'+lastId+'"]');if(cd)cd.focus({preventScroll:true})}
      wasProduct=false;cameFromHome=false;
    }
  }
  addEventListener("hashchange",route);
  route();booted=true;

  /* «بازگشت»: اگر از صفحه اصلی آمده‌ایم، یک قدم عقب می‌رویم تا تاریخچه دوبل نشود */
  var skip=$(".skip-link");
  if(skip)skip.addEventListener("click",function(e){if(!pv.hidden){e.preventDefault();$("#pv-title").focus()}else if(!legal.hidden){e.preventDefault();$("#legal-title").focus()}});
  d.querySelectorAll(".pv__back").forEach(function(a){a.addEventListener("click",function(e){
    if(cameFromHome){e.preventDefault();history.back()}
  })});

  /* ---- انیمیشن‌های بیشتر (فقط transform و opacity؛ سبک) ---- */
  var calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine=matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* نوار پیشرفت اسکرول (بدون خواندن layout در هر فریم) */
  var bar=$("#progress"),tick=false,maxY=1;
  function measure(){maxY=Math.max(root.scrollHeight-innerHeight,1)}
  function prog(){tick=false;bar.style.setProperty("transform","scaleX("+Math.min(scrollY/maxY,1).toFixed(4)+")")}
  addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(prog)}},{passive:true});
  addEventListener("resize",measure);addEventListener("load",measure);addEventListener("hashchange",function(){setTimeout(measure,60)});
  measure();prog();

  /* انیمیشن‌های بی‌نهایت فقط وقتی روی صفحه دیده می‌شوند */
  var heroVisible=true;
  if("IntersectionObserver" in window){
    var vis0=$(".hero__visual"),mq=$(".marquee");
    var po=new IntersectionObserver(function(es){es.forEach(function(e){
      var off=!e.isIntersecting;
      if(e.target===vis0){e.target.classList.toggle("off",off);heroVisible=!off}else e.target.classList.toggle("off",off);
    })});
    if(vis0)po.observe(vis0);if(mq)po.observe(mq);
  }

  /* ویژه موس (ویندوز/دسکتاپ): پارالکس نرم هیرو، شیب و نور کارت‌ها، دکمه‌های مغناطیسی */
  if(fine&&!calm){
    var vis=$(".hero__visual"),art=$(".hero__art"),chips=[].slice.call(d.querySelectorAll(".hero__visual .chip"));
    var ks=chips.map(function(c){return parseFloat(getComputedStyle(c).getPropertyValue("--k"))||0});
    var tx=0,ty=0,cx=0,cy=0,run=false;
    function loop(){
      cx+=(tx-cx)*.1;cy+=(ty-cy)*.1;
      for(var i=0;i<chips.length;i++)chips[i].style.translate=(cx*ks[i]).toFixed(2)+"px "+(cy*ks[i]).toFixed(2)+"px";
      art.style.translate=(cx*-8).toFixed(2)+"px "+(cy*-8).toFixed(2)+"px";
      if((Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)&&heroVisible)requestAnimationFrame(loop);else run=false;
    }
    if(vis)addEventListener("pointermove",function(e){
      if(!heroVisible)return;
      tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;
      if(!run){run=true;requestAnimationFrame(loop)}
    },{passive:true});

    d.querySelectorAll(".card").forEach(function(c){
      var r=null,px=0,py=0,q=0;
      c.addEventListener("pointerenter",function(){r=c.getBoundingClientRect()});
      c.addEventListener("pointermove",function(e){
        if(!r)r=c.getBoundingClientRect();px=e.clientX;py=e.clientY;
        if(q)return;
        q=requestAnimationFrame(function(){
          q=0;var x=(px-r.left)/r.width,y=(py-r.top)/r.height;
          c.style.setProperty("--mx",(x*100).toFixed(1)+"%");c.style.setProperty("--my",(y*100).toFixed(1)+"%");
          c.style.setProperty("--rx",((.5-y)*7).toFixed(2)+"deg");c.style.setProperty("--ry",((x-.5)*7).toFixed(2)+"deg");
        });
      },{passive:true});
      c.addEventListener("pointerleave",function(){r=null;c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
    });
    d.querySelectorAll(".btn--primary,.btn--tg").forEach(function(b){
      var r=null;
      b.addEventListener("pointerenter",function(){r=b.getBoundingClientRect()});
      b.addEventListener("pointermove",function(e){
        if(!r)return;
        b.style.setProperty("--tx",(((e.clientX-r.left)/r.width-.5)*10).toFixed(1)+"px");
        b.style.setProperty("--ty",(((e.clientY-r.top)/r.height-.5)*8).toFixed(1)+"px");
      },{passive:true});
      b.addEventListener("pointerleave",function(){r=null;b.style.setProperty("--tx","0px");b.style.setProperty("--ty","0px")});
    });
  }

  /* ایمیل: ساخته‌شدن در مرورگر تا ربات‌ها آدرس را از HTML برندارند */
  var ml=$(".btn--mail");
  if(ml&&ml.dataset.u){
    var addr=ml.dataset.u+"@"+ml.dataset.d;
    ml.href="mailto:"+addr;$(".tg-id",ml).textContent=addr;
  }

  $("#year").textContent=new Date().getFullYear();
})();
