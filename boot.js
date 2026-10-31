/* اجرا پیش از اولین رسم صفحه: جلوگیری از پرش نمایش و فلش تم */
(function(){
  var r=document.documentElement,t=null;
  r.classList.add("js");
  try{t=localStorage.getItem("pouone-theme")}catch(e){}
  r.setAttribute("data-theme",t==="dark"?"dark":"light");
})();
