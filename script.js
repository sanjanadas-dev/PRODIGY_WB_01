/**
 * Stopwatch: HH:MM:SS display, Start / Pause / Reset / Lap
 * Uses performance.now() for elapsed time while running.
 */
(function () {
  const displayEl = document.getElementById("display");
  const btnStart = document.getElementById("btn-start");
  const btnPause = document.getElementById("btn-pause");
  const btnReset = document.getElementById("btn-reset");
  const btnLap = document.getElementById("btn-lap");
  const btnLogin = document.getElementById("btn-login");
  const lapsList = document.getElementById("laps-list");
  const lapsEmpty = document.getElementById("laps-empty");

  /** @type {number} ms accumulated before current run segment */
  let elapsedMs = 0;
  /** @type {number | null} performance.now() when current segment started */
  let segmentStart = null;
  /** @type {ReturnType<typeof setInterval> | null} */
  let tickId = null;

  /** Total elapsed at last lap (for split calculation) */
  let lastLapTotalMs = 0;
  let lapCounter = 0;

  function isRunning() {
    return segmentStart !== null;
  }

  function getTotalMs() {
    if (segmentStart === null) return elapsedMs;
    return elapsedMs + (performance.now() - segmentStart);
  }

  function formatHMS(totalMs) {
    const totalSeconds = Math.floor(totalMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function updateDisplay() {
    displayEl.textContent = formatHMS(getTotalMs());
  }

  function startTick() {
    if (tickId !== null) return;
    tickId = setInterval(updateDisplay, 250);
  }

  function stopTick() {
    if (tickId !== null) {
      clearInterval(tickId);
      tickId = null;
    }
  }

  function syncButtons() {
    const running = isRunning();
    btnStart.disabled = running;
    btnPause.disabled = !running;
    btnLap.disabled = !running;
  }

  function onStart() {
    if (isRunning()) return;
    segmentStart = performance.now();
    startTick();
    updateDisplay();
    syncButtons();
  }

  function onPause() {
    if (!isRunning()) return;
    elapsedMs += performance.now() - segmentStart;
    segmentStart = null;
    stopTick();
    updateDisplay();
    syncButtons();
  }

  function onReset() {
    stopTick();
    elapsedMs = 0;
    segmentStart = null;
    lastLapTotalMs = 0;
    lapCounter = 0;
    lapsList.innerHTML = "";
    lapsEmpty.classList.remove("is-hidden");
    updateDisplay();
    syncButtons();
  }

  function onLap() {
    if (!isRunning()) return;
    const total = getTotalMs();
    const splitMs = total - lastLapTotalMs;
    lastLapTotalMs = total;
    lapCounter += 1;

    lapsEmpty.classList.add("is-hidden");

    const li = document.createElement("li");
    li.innerHTML =
      '<span class="lap-num">Lap ' +
      lapCounter +
      '</span><span class="lap-time">' +
      formatHMS(splitMs) +
      "</span>";
    lapsList.appendChild(li);
    lapsList.scrollTop = lapsList.scrollHeight;
  }

  function onLogin() {
    alert("Login functionality coming soon!");
  }

  btnStart.addEventListener("click", onStart);
  btnPause.addEventListener("click", onPause);
  btnReset.addEventListener("click", onReset);
  btnLap.addEventListener("click", onLap);
  btnLogin.addEventListener("click", onLogin);

  updateDisplay();
  syncButtons();
})();
