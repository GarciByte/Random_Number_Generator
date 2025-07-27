import { parentPort } from "worker_threads";

parentPort.on("message", ({ min, max, mode, allowRepeats, amount }) => {

    const possible = [];
    for (let n = min; n <= max; n++) {
        if (
        mode === "any" ||
        (mode === "even" && n % 2 === 0) ||
        (mode === "odd" && n % 2 !== 0)
        )
        possible.push(n);
    }

    const result = [];
    while (result.length < amount) {
        const n = possible[Math.floor(Math.random() * possible.length)];
        if (allowRepeats || !result.includes(n)) {
        result.push(n);
        }
    }

    parentPort.postMessage(result);
});
