(function(){
  let active=false;
  let selectedStarts=[];
  let delay=1000;
  let targetDay="today"; // "today" lub "tomorrow"

  function log(t){
    console.log("[GCT Halloween Clicker]",t);
    const el=document.getElementById("slotStatus");
    if(el) el.innerText=t;
  }

  function getTargetDate(){
    const now=new Date();
    if(targetDay==="tomorrow") now.setDate(now.getDate()+1);
    return now.toISOString().split("T")[0];
  }

  function runCycle(){
    if(!active) return;

    const dateStr=getTargetDate();
    const rows=document.querySelectorAll("table.q-table tbody tr");
    let clicked=false;

    for(const row of rows){
      const tds=row.querySelectorAll("td");
      if(tds.length<5) continue;
      const s=tds[3].innerText.trim(); // początek slotu

      for(const startHour of selectedStarts){
        const expectedStart=`${dateStr} ${startHour}`;
        if(s===expectedStart){
          const btn=row.querySelector("button");
          if(btn){
            btn.click();
            clicked=true;
            log(`🎃 Złapano slot od ${startHour}!`);
            alert(`👻 Slot przechwycony od ${startHour}!`);
            active=false;
            return;
          }
        }
      }
    }

    if(!clicked){
      log("🕸️ Brak slotu – próba ponownie za "+delay/1000+"s");
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
      background:linear-gradient(145deg,#1c0f2e,#2b0033);
      z-index:9999;
      border:2px solid #ff7518;
      padding:14px;
      font-family:'Trebuchet MS', sans-serif;
      border-radius:10px;
      box-shadow:0 0 20px rgba(255,117,24,0.7);
      color:#ffb347;
      width:260px;
      text-shadow:0 0 4px black;
    `;

    const startSlots=[
      "00:30","02:30","04:30","06:30",
      "08:30","10:30","12:30","14:30",
      "16:30","18:30","20:30","22:30"
    ];

    const checkboxHTML=startSlots.map(start=>
      `<label style="display:block;margin:3px 0;color:#ffb347;">
         <input type="checkbox" class="slotStartCheck" value="${start}" style="margin-right:6px;"> 🎃 ${start}
       </label>`
    ).join("");

    const delayOptions=Array.from({length:15},(_,i)=>{
      const ms=(i+1)*1000;
      return `<option value="${ms}" ${ms===1000?"selected":""}>${ms} ms</option>`;
    }).join("");

    d.innerHTML=`
      <b style="font-size:16px;color:#ff7518;">👻 GCT Halloween Clicker</b><br><br>

      <div style="font-size:13px;">Godziny początkowe:</div>
      <div style="max-height:120px;overflow-y:auto;margin-bottom:6px;padding-right:5px;">
        ${checkboxHTML}
      </div>

      <div style="font-size:13px;">Opóźnienie:</div>
      <select id="slotDelay" style="width:100%;padding:5px;margin:5px 0;border:1px solid #ff7518;background:#2b0033;color:#ffb347;border-radius:5px;">
        ${delayOptions}
      </select>

      <div style="font-size:13px;">📅 Data:</div>
      <select id="slotDay" style="width:100%;padding:5px;margin:5px 0;border:1px solid #ff7518;background:#2b0033;color:#ffb347;border-radius:5px;">
        <option value="today" selected>Dzisiaj</option>
        <option value="tomorrow">Jutro</option>
      </select>

      <button id="slotStart" style="width:48%;padding:6px;background:#ff7518;color:#2b0033;border:none;border-radius:6px;cursor:pointer;margin-right:4%;box-shadow:0 0 10px #ff7518;font-weight:bold;">START 🎃</button>
      <button id="slotStop" style="width:48%;padding:6px;background:#6a0dad;color:#ffb347;border:none;border-radius:6px;cursor:pointer;box-shadow:0 0 10px #6a0dad;font-weight:bold;">STOP 💀</button>

      <div id="slotStatus" style="margin-top:8px;font-size:12px;color:#ffb347;">🕷️ Status: Gotowy</div>
    `;

    document.body.appendChild(d);

    document.getElementById("slotStart").onclick=()=>{
      const selectedChecks=Array.from(document.querySelectorAll(".slotStartCheck")).filter(c=>c.checked);
      if(selectedChecks.length===0){
        alert("⚠️ Wybierz przynajmniej jedną godzinę początkową.");
        return;
      }
      selectedStarts=selectedChecks.map(c=>c.value);
      delay=parseInt(document.getElementById("slotDelay").value);
      targetDay=document.getElementById("slotDay").value;
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
