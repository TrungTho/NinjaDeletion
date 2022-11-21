# Ninja Deletion App

- **TL;DR** Just delete only anything that **belongs** to you.
- This is a personal project for cross-platform desktop application purposes only. At first, I wanted to go with **ElectronJS**, but some posts showed that it likes to use a sledgehammer to crack a nut. And then I found **NeutralinoJS**, "a lightweight and portable desktop application development framework".
- Idea: In my place, when you go to a photocopy shop and want to print some personal stuff (ID card, household book, CV, transcript,...) and you don't want them to keep those things on their computers (or even use it for negative purposes). You may ask them to delete it after printing and sometimes get back a grumpy glance. Or use this app to delete what **belongs** to you.

# Tech

- JS, NeutralinoJS, HTML, CSS
- Telegram BOT API

---

# Feature

1. Delete multiple files & folders after a timeout duration.
2. Show/ hide application to icon tray.
3. invisible taskbar icon/ move icon to tray
4. Config & send results logs to telegram group chat via Telegram BOT Api
5. Custom kill processes before start deletion (pdf viewer prevents deleting opening file)

---

# Usage

- Download:
- Note: **the binary file, .neu and WebView2Loader.dll have to be in the same dir.**

# Telegram config:

For now this app just supports send logs only via telegram bot api. Here is how:

- Step 1: Create and get telegram bot token with @botfather: [Docs](https://learn.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-telegram?view=azure-bot-service-4.0)
- Step 2: Create a new **group chat** and invite your bot to this group.
- Step 3: Get chat_id of group you created at step 2. How? [Telegram App](https://www.wikihow.com/Know-Chat-ID-on-Telegram-on-Android) - [Telegram Web](https://stackoverflow.com/a/45577773)
- Step 4: Fill your information, test and save.

# Clone Project

- Install nodejs, npm.
- Install neu
  ```
  npm install -g @neutralinojs/neu
  ```
- Clone repo:

  ```
  git clone https://github.com/TrungTho/NinjaDeletion
  ```

- Update project binary & file
  ```
  neu update
  ```
- Modify as you want.

# Icon credits

- `ninjaIcon.png` - Made by [Freepik](https://www.freepik.com/ "‌") and downloaded from [Flaticon](https://www.flaticon.com/ "‌")

---

# Revison

- 21/11/2022: Version 1.0
- 27/10/2022: After researching and some tests, I prefer to use NeutralinoJS for this project because:
  - Lightweight & single execute release file
  - Easy to interact with machine files, systems via native API. In the other hand, when I tried to just open an dialog with the latest version of ElectronJS, it's truly a messy.
- 24/10/2022 init requirements.

‌
