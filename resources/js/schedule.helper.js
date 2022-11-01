function startInteval(f, unitTime = 1000) {
  return setInterval(f, unitTime);
}

function stopInterval(intervalName) {
  clearInterval(intervalName);
}

async function scheduleTimeout(f, delayTime) {
  return setTimeout(() => {
    f();
  }, delayTime);
}

function stopScheduleTimeout(name) {
  clearTimeout(name);
}

export { startInteval, stopInterval, scheduleTimeout, stopScheduleTimeout };
