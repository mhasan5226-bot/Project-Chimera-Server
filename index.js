const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*", // সব ডোমেইন থেকে কানেকশন এলাউ করবে
    methods: ["GET", "POST"]
  }
});

// আমাদের ক্লায়েন্ট ওয়েব পেজ
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// স্ট্যাটিক ফাইল (HTML, CSS, JS) পরিবেশন করার জন্য
app.use(express.static('public'));

// ক্লায়েন্ট যখন কানেক্ট হবে
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // টার্গেট ডিভাইস থেকে ডেটা পাওয়ার জন্য ইভেন্ট লিসেনার
  socket.on('data_from_target', (data) => {
    console.log('Data from target:', data);
    // এই ডেটা ক্লায়েন্ট ওয়েব পেজে পাঠানো হবে
    io.emit('update_client_ui', data);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
