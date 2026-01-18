const login = require("ws3-fca");
const fs = require("fs");
const express = require("express");

// ✅ Load AppState 
let appState;
try {
  appState = JSON.parse(fs.readFileSync("appstate.json", "utf-8"));
} catch (err) {
  console.error("⛔ Error reading appstate.json:", err);
  process.exit(1);
}

// ✅ Group Info
const GROUP_THREAD_ID = "24658709510380133";
const LOCKED_GROUP_NAME = "Group ka name lock ke liye";

// ✅ Express Server to keep bot alive (for Render or UptimeRobot)
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("🤖 Group Name Locker Bot is alive!"));
app.listen(PORT, () => console.log(🌐 Web server running on port ${PORT}));

// ✅ Function to start locking loop
function startGroupNameLocker(api) {
  const lockLoop = () => {
    api.getThreadInfo(GROUP_THREAD_ID, (err, info) => {
      if (err) {
        console.error("⛔ Error fetching group info:", err);
      } else {
        if (info.name !== LOCKED_GROUP_NAME) {
          console.warn(✅ Group name changed to "${info.name}" → resetting in 10s...);
          setTimeout(() => {
            api.setTitle(LOCKED_GROUP_NAME, GROUP_THREAD_ID, (err) => {
              if (err) {
                console.error("⛔ Failed to reset group name:", err);
              } else {
                console.log("✅ Group name reset successfully.");
              }
            });
          }, 1000); // 1 sec delay before reset
        } else {
          console.log("✅ Group name is correct.");
        }
      }

      // 🔁 Schedule next check after 5 seconds
      setTimeout(lockLoop, 1000);
    });
  };

  lockLoop(); // Start loop
}

// 🟢 Facebook Login
login({ appState }, (err, api) => {
  if (err) {
    console.error("⛔ Login Failed:", err);
    return;
  }

  console.log("✅ Logged in successfully. Group name locker activated.");
  startGroupNameLocker(api);
});
