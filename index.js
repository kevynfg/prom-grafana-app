import express from 'express';
const app = express();
import client from 'prom-client';
const register = new client.Registry();

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

const luckNumber = new client.Gauge({
    name: 'luck_number',
    help: 'Luck number',
})

const intensiveComputing = new client.Histogram({
    name: 'intensive_computing',
    help: 'Intensive computing',
    labelNames: ["operation", "status"]
})

register.registerMetric(luckNumber);

register.registerMetric(intensiveComputing);

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.get("/luck-number", (req, res) => {
    const number = Math.floor(Math.random() * 100);
    luckNumber.set(number);
    res.send(`Your luck number is ${number}`);
})

app.get("/intensive-computing", (req, res) => {
    const performanceStart = Date.now();
    const timer = intensiveComputing.startTimer();
    let begin = 0;
    while (begin < 1000) {
        Array.from({ length: 1000 }, () => Math.random());
        begin++
    }
    const performanceEnd = Date.now() - performanceStart;
    intensiveComputing.observe(performanceEnd);
    timer({operation: 'intensive-computing', status: 'success'})
    res.send(`Done with intensive computing in ${performanceEnd}ms`);
})

app.get("/metrics", async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
})

app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
})
