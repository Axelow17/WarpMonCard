let currentFID = null;
let opponentFID = null;

const openPackBtn = document.getElementById("openPackBtn");
const packArea = document.getElementById("packArea");
const cardResults = document.getElementById("cardResults");
const closePackBtn = document.getElementById("closePackBtn");
const inventoryBtn = document.getElementById("inventoryBtn");
const inventoryArea = document.getElementById("inventoryArea");
const inventoryContainer = document.getElementById("inventoryContainer");
const closeInventoryBtn = document.getElementById("closeInventoryBtn");
const modal = document.getElementById("cardModal");
const modalCard = document.getElementById("modalCard");
const modalName = document.getElementById("modalName");
const modalRarity = document.getElementById("modalRarity");
const modalElement = document.getElementById("modalElement");
const modalAtk = document.getElementById("modalAtk");
const modalDef = document.getElementById("modalDef");
const closeModalBtn = document.getElementById("closeModalBtn");
const shareCardBtn = document.getElementById("shareCardBtn");
const pvpBtn = document.getElementById("pvpBtn");
const pvpModal = document.getElementById("pvpModal");
const closePvpBtn = document.getElementById("closePvpBtn");
const startBattleBtn = document.getElementById("startBattleBtn");
const battleResult = document.getElementById("battleResult");
const myFID = document.getElementById("myFID");
const oppFID = document.getElementById("opponentFID");
const loginFarcasterBtn = document.getElementById("loginFarcasterBtn");
const packStatus = document.getElementById("packStatus");

const cards = [
  { name: "Warpmon Fire", rarity: "Common", atk: 40, def: 30, element: "Fire" },
  { name: "Warpmon Water", rarity: "Rare", atk: 45, def: 50, element: "Water" },
  { name: "Warpmon Earth", rarity: "Epic", atk: 60, def: 55, element: "Earth" },
  { name: "Warpmon Light", rarity: "Legendary", atk: 80, def: 70, element: "Light" },
  { name: "Warpmon Void", rarity: "UltraLegendary", atk: 120, def: 100, element: "Void" }
];

// === RANDOM CARD ===
function randomCard() {
  const roll = Math.random();
  if (roll < 0.5) return cards[0];
  if (roll < 0.75) return cards[1];
  if (roll < 0.93) return cards[2];
  if (roll < 0.99999) return cards[3];
  return cards[4];
}

// === CREATE CARD ELEMENT ===
function createCard(card) {
  const elementClass = card.element.toLowerCase();
  const artPath = `assets/warpmon/warpmon_${elementClass}.png`;

  const cardEl = document.createElement("div");
  cardEl.className = `card ${card.rarity}`;
  cardEl.innerHTML = `
    <div class="card-inner">
      <div class="card-art ${elementClass}" style="background-image:url('${artPath}');"></div>
      <div class="card-info">
        <div class="card-name">${card.name}</div>
        <div class="card-element">🌪️ ${card.element}</div>
        <div class="card-stats">
          <span>⚔️ ${card.atk}</span><span>🛡️ ${card.def}</span>
        </div>
      </div>
    </div>
  `;

  cardEl.onclick = () => showCardDetail(card);
  return cardEl;
}

// === OPEN PACK (DAILY LIMIT) ===
openPackBtn.onclick = () => {
  const lastPackTime = localStorage.getItem("lastPackTime");
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (lastPackTime && now - parseInt(lastPackTime) < oneDay) {
    const remaining = oneDay - (now - parseInt(lastPackTime));
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    alert(`⏳ Kamu sudah membuka pack hari ini!\nTunggu ${hours} jam ${minutes} menit lagi.`);
    return;
  }

  // buka pack
  packArea.classList.remove("hidden");
  cardResults.innerHTML = "";
  const pack = [];

  for (let i = 0; i < 5; i++) {
    const card = randomCard();
    pack.push(card);
    const cardEl = createCard(card);
    setTimeout(() => cardEl.classList.add("revealed"), i * 300);
    cardResults.appendChild(cardEl);
  }

  // simpan ke inventory
  localStorage.setItem("lastPackTime", now.toString());
  let inventory = JSON.parse(localStorage.getItem("warpmonInventory")) || [];
  inventory.push(...pack);
  localStorage.setItem("warpmonInventory", JSON.stringify(inventory));

  alert("🎁 Pack berhasil dibuka! Kartu baru masuk ke inventory.");
  updatePackStatus();
};

closePackBtn.onclick = () => packArea.classList.add("hidden");

// === STATUS PACK TIMER ===
function updatePackStatus() {
  const lastPackTime = localStorage.getItem("lastPackTime");
  if (!lastPackTime) {
    packStatus.textContent = "🎁 Kamu bisa membuka pack sekarang!";
    return;
  }
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const remaining = oneDay - (now - parseInt(lastPackTime));

  if (remaining <= 0) {
    packStatus.textContent = "🎁 Pack tersedia! Silakan buka.";
  } else {
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    packStatus.textContent = `⏳ Tunggu ${hours} jam ${minutes} menit untuk buka pack lagi.`;
  }
}
updatePackStatus();
setInterval(updatePackStatus, 60000);

// === INVENTORY ===
inventoryBtn.onclick = () => showInventory();

function showInventory(filter = "all") {
  inventoryArea.classList.remove("hidden");
  inventoryContainer.innerHTML = "";

  const inventory = JSON.parse(localStorage.getItem("warpmonInventory")) || [];
  const filtered = filter === "all" ? inventory : inventory.filter(c => c.rarity === filter);

  filtered.forEach(card => {
    const cardEl = createCard(card);
    inventoryContainer.appendChild(cardEl);
  });

  document.getElementById("inventoryCount").textContent =
    `Total Cards: ${inventory.length} | Showing: ${filtered.length}`;
}

document.getElementById("rarityFilter").onchange = (e) => {
  showInventory(e.target.value);
};
closeInventoryBtn.onclick = () => inventoryArea.classList.add("hidden");

// === CARD DETAIL ===
function showCardDetail(card) {
  const elementClass = card.element.toLowerCase();
  const artPath = `assets/warpmon/warpmon_${elementClass}.png`;

  modalCard.className = `card big-card ${card.rarity}`;
  modalCard.innerHTML = `
    <div class="card-inner">
      <div class="card-art ${elementClass}" style="background-image:url('${artPath}');"></div>
      <div class="card-info">
        <div class="card-name">${card.name}</div>
        <div class="card-element">🌪️ ${card.element}</div>
        <div class="card-stats">
          <span>⚔️ ${card.atk}</span><span>🛡️ ${card.def}</span>
        </div>
      </div>
    </div>`;

  modalName.textContent = card.name;
  modalRarity.textContent = card.rarity;
  modalElement.textContent = card.element;
  modalAtk.textContent = card.atk;
  modalDef.textContent = card.def;

  modal.classList.remove("hidden");
}

closeModalBtn.onclick = () => modal.classList.add("hidden");

// === FARCASTER LOGIN ===
loginFarcasterBtn.onclick = () => {
  currentFID = "FID-" + Math.floor(Math.random() * 9999);
  alert("✅ Login Farcaster berhasil: " + currentFID);
};

// === SHARE CARD TO FARCASTER ===
shareCardBtn.onclick = () => {
  const cardName = modalName.textContent;
  const rarity = modalRarity.textContent;
  const element = modalElement.textContent;
  const message = `Check out my WarpMon card: ${cardName} (${rarity}, ${element} element)! 🔥 #WarpMonCard`;
  const fid = currentFID || "";
  const shareUrl = `https://farcaster.xyz/~/inbox/create/${fid}?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, "_blank");
};

// === PVP MODE ===
pvpBtn.onclick = () => {
  if (!currentFID) {
    alert("⚠️ Login Farcaster dulu sebelum PVP!");
    return;
  }

  opponentFID = "FID-" + Math.floor(Math.random() * 9999);
  myFID.textContent = currentFID;
  oppFID.textContent = opponentFID;
  battleResult.textContent = "";
  pvpModal.classList.remove("hidden");
};

closePvpBtn.onclick = () => pvpModal.classList.add("hidden");

startBattleBtn.onclick = () => {
  const inventory = JSON.parse(localStorage.getItem("warpmonInventory")) || [];
  if (inventory.length === 0) {
    alert("Kamu belum punya kartu untuk bertarung!");
    return;
  }

  const myCard = inventory[Math.floor(Math.random() * inventory.length)];
  const oppCard = cards[Math.floor(Math.random() * cards.length)];

  const myScore = myCard.atk + Math.random() * 20;
  const oppScore = oppCard.def + Math.random() * 20;

  if (myScore > oppScore) {
    battleResult.textContent = `🏆 Kamu Menang! ${myCard.name} mengalahkan ${oppCard.name}`;
  } else {
    battleResult.textContent = `💀 Kamu Kalah! ${oppCard.name} bertahan dari serangan ${myCard.name}`;
  }
};