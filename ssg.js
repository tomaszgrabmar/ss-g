(function(){
  let active=false;
  let selected="10:30-12:30";
  let delay=1000;

  function log(t){
    console.log("[AutoSlot]",t);
    document.getElementById("slotStatus").innerText=t;
  }

  function runCycle(){
    if(!active) return;
    const now=new Date();
    const today=now.toISOString().split("T")[0];
    const [h1,h2]=selected.split("-");
    const expectedStart=`${today} ${h1}`;
    const expectedEnd=`${today} ${h2}`;
    const rows=document.querySelectorAll("table.q-table tbody tr");
    let clicked=false;

    for(const row of rows){
      const tds=row.querySelectorAll("td");
      if(tds.length<5) continue;
      const s=tds[3].innerText.trim();
      const e=tds[4].innerText.trim();

      if(s===expectedStart && e===expectedEnd){
        const btn=row.querySelector("button");
        if(btn){
          btn.click();
          clicked=true;
          log("🎯 Złapano slot!");
          alert("🍂 Złapano slot!");
          active=false;
          return;
        }
      }
    }

    if(!clicked){
      log("🍁 Brak slotu – próba ponownie za "+delay/1000+"s");
      const refreshBtn=document.querySelector("i.fas.fa-sync")?.parentElement;
      if(refreshBtn){
        refreshBtn.click();
        setTimeout(()=>{
          document.querySelectorAll("div.text-h6").forEach(el=>{
            if(el.innerText.includes("Nastąpi za")) el.remove();
          });
          document.querySelectorAll('div[id^="q-portal--dialog--"]').forEach(m=>m.remove());
        },100);
        setTimeout(runCycle,delay);
      } else {
        log("⚠️ Nie znaleziono przycisku odświeżania.");
        setTimeout(runCycle,delay);
      }
    }
  }

  function createGUI(){
    if(document.getElementById("slotGUI")) return;
    const d=document.createElement("div");
    d.id="slotGUI";
    d.style=`
      position:fixed;
      top:10px;right:10px;
      background:linear-gradient(145deg, #fff4e0, #fbe5c0);
      z-index:9999;
      border:2px solid #d9a066;
      padding:12px;
      font-family:Arial,sans-serif;
      border-radius:10px;
      box-shadow:0 0 12px rgba(180,120,50,0.4);
      color:#4b2e15;
      width:220px;
    `;

    const delayOptions=Array.from({length:15},(_,i)=>{
      const ms=(i+1)*1000;
      return `<option value="${ms}" ${ms===1000?"selected":""}>${ms} ms</option>`;
    }).join("");

    d.innerHTML=`
      <b style="font-size:16px;color:#6b3e26;">🍯 AutoSlot</b><br><br>
      <div style="font-size:14px;">Przedział godzin:</div>
      <select id="slotTime" style="width:100%;padding:5px;margin:5px 0;border:1px solid #d9a066;border-radius:5px;background:#fff7eb;color:#4b2e15;">
        <option>00:30-02:30</option>
        <option>02:30-04:30</option>
        <option>04:30-06:30</option>
        <option>06:30-08:30</option>
        <option>08:30-10:30</option>
        <option selected>10:30-12:30</option>
        <option>12:30-14:30</option>
        <option>14:30-16:30</option>
        <option>16:30-18:30</option>
        <option>18:30-20:30</option>
        <option>20:30-22:30</option>
        <option>22:30-00:30</option>
      </select><br>

      <div style="font-size:14px;">Opóźnienie:</div>
      <select id="slotDelay" style="width:100%;padding:5px;margin:5px 0;border:1px solid #d9a066;border-radius:5px;background:#fff7eb;color:#4b2e15;">
        ${delayOptions}
      </select><br>

      <button id="slotStart" style="width:48%;padding:6px;background:#d98c4b;color:white;border:none;border-radius:6px;cursor:pointer;margin-right:4%;box-shadow:0 0 5px rgba(217,140,75,0.5);">Start 🍂</button>
      <button id="slotStop" style="width:48%;padding:6px;background:#8c5a44;color:white;border:none;border-radius:6px;cursor:pointer;box-shadow:0 0 5px rgba(140,90,68,0.5);">Stop 🍁</button>

      <div id="slotStatus" style="margin-top:8px;font-size:12px;color:#6b3e26;">🍯 Status: Gotowy</div>
    `;

    document.body.appendChild(d);

    document.getElementById("slotStart").onclick=()=>{
      selected=document.getElementById("slotTime").value;
      delay=parseInt(document.getElementById("slotDelay").value);
      active=true;
      log("🔄 Startuję cykl...");
      runCycle();
    };

    document.getElementById("slotStop").onclick=()=>{
      active=false;
      log("🛑 Klikacz zatrzymany.");
    };
  }

  createGUI();
})();
