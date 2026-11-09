/* PouOne — © 2026 Farrokhzad Parvareh. All rights reserved. */
/* اجرا پیش از اولین رسم صفحه: جلوگیری از پرش نمایش و فلش تم */
(function(){
  var r=document.documentElement,t=null;
  /* جلوگیری از clickjacking: اگر صفحه داخل iframe باز شد، پنهان می‌شود و تلاش می‌کند خودش را بیرون بیاورد */
  if(window.top!==window.self){
    r.style.display="none";
    try{window.top.location.href=window.self.location.href}catch(e){}
    return;
  }
  r.classList.add("js");
  try{t=localStorage.getItem("pouone-theme")}catch(e){}
  r.setAttribute("data-theme",t==="dark"?"dark":"light");
})();
