const serverIP = "RoyalSMP_Plus.aternos.me";

// Seznam všech členů party
const allPlayers = [
    "Jac0bs_Cz",
    "Kolacek20",
    "litttel",
    "Shoebill_"
  ];

const REFRESH_INTERVAL = 120; // 2 minuty v sekundách
let countdown = REFRESH_INTERVAL;

async function updateServerStatus() {
  const notice = document.getElementById("server-notice");
  const listContainer = document.getElementById("player-list");

  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}?t=${Date.now()}`);
    const data = await res.json();

    let onlineList = [];

    if (notice) {
      if (data.online) {
        notice.textContent = `Server je Online (${data.players.online}/${data.players.max} hráčů)`;
        notice.style.color = "#16a34a";
      } else {
        notice.textContent = "Server je momentálně Offline";
        notice.style.color = "#dc2626";
      }
    }

    if (data.online && data.players && data.players.list) {
      onlineList = data.players.list.map(p => p.name_clean.toLowerCase());
    }

    // Vykreslení hráčů (pokud existuje kontejner na playerlist.html)
    if (listContainer) {
      listContainer.innerHTML = "";

      allPlayers.forEach(player => {
        const isOnline = onlineList.includes(player.toLowerCase());

        const row = document.createElement("div");
        row.className = "player-row";

        row.innerHTML = `
          <div class="player-info">
            <img class="player-head" src="https://mc-heads.net/avatar/${player}/32" alt="${player}">
            <strong>${player}</strong>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14px; color: ${isOnline ? '#16a34a' : '#6b7280'}">
              ${isOnline ? 'Online' : 'Offline'}
            </span>
            <span class="status-dot ${isOnline ? 'status-online' : 'status-offline'}"></span>
          </div>
        `;

        listContainer.appendChild(row);
      });
    }

  } catch (err) {
    console.error("Chyba při načítání stavu:", err);
    if (notice) {
      notice.textContent = "Nepodařilo se načíst stav serveru";
      notice.style.color = "#dc2626";
    }
  }
}

// Běh odpočtu každou sekundu
function startTimer() {
  const timerElem = document.getElementById("status-timer");

  setInterval(() => {
    countdown--;

    if (countdown <= 0) {
      countdown = REFRESH_INTERVAL;
      updateServerStatus();
    }

    if (timerElem) {
      const minutes = Math.floor(countdown / 60);
      const seconds = countdown % 60;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      timerElem.textContent = `(obnova za ${minutes}:${formattedSeconds})`;
    }
  }, 1000);
}

// Start při načtení stránky
document.addEventListener("DOMContentLoaded", () => {
  updateServerStatus();
  startTimer();
});