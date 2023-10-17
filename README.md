# KindleCalendar 📆📷

![KindleCalendar](https://raw.githubusercontent.com/LightYagami28/KindleCalendar/main/kindleCalendar.png)

## Overview

KindleCalendar is a tool that utilizes Selenium automation to capture screenshots of your online calendar, making it accessible on your Kindle device's web browser. This project simplifies the process of viewing your calendar without the need for syncing with an external service.

**Note:** This project was last updated on October 18, 2022, and addressed a potential vulnerability in the code.

## Getting Started 🚀

To get started:

1. Log in to your Raspberry Pi or your preferred device.
2. Clone this repository to your device: `git clone https://github.com/LightYagami28/KindleCalendar.git`
3. Install Python dependencies: Navigate to the `KindleCalendar` directory and run `pip install -r requirements.txt`. Then return to the previous directory.
4. Set up systemd user services: Copy the systemd service files from `KindleCalendar/config/systemd/user/*` to `.config/systemd/user/`.
5. Enable systemd services: Run `systemctl --user daemon-reload` and then enable the `kindleserver` and `screenshot` services.
6. Install Firefox and log in with your Google account.
7. Visit Google Calendar to ensure it loads correctly.
8. Install the Selenium WebDriver for Firefox by following the [instructions here](https://firefox-source-docs.mozilla.org/testing/geckodriver/ARM.html).
9. Edit `KindleCalendar/screenshot.py` and set your Firefox profile path under `profile = webdriver.FirefoxProfile(...)`.
10. Install Node.js and npm by running `sudo apt install nodejs npm`.
11. Install project dependencies with npm by navigating to the `KindleCalendar` directory and running `npm i`.

If everything went smoothly, you should be able to visit your device's IP address on port 8080 using any web browser, including Kindle. Just ensure that JavaScript is enabled in your browser settings.

Enjoy! 📅📖

Special thanks to [noxquest](https://bitbucket.org/ocampos/noxquest_kindle-tty/src/master/) for their fantastic project and the `hixie` bridge node library.
