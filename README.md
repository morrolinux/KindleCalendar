# KindleCalendar
Selenium automation to screenshot your calendar and view it on the Kindle browser

<img src="https://raw.githubusercontent.com/morrolinux/KindleCalendar/main/kindleCalendar.png?token=GHSAT0AAAAAABZERVYNQVD7HKC52IKX5PHWYZXAWEA" width="50%" height="50%"> 

# How to get started
1. log in to your Pi (or whatever device you want to use)
2. Clone this repo: `git clone https://github.com/morrolinux/KindleCalendar.git`
3. Install systemd user services: `cp KindleCalendar/config/systemd/user/* .config/systemd/user/`
4. Enable systemd services: `systemctl --user daemon-reload && systemctl --user enable kindleserver && systemctl --user enable screenshot`
5. Install Firefox and login with your google account
6. Visit Google Calendar just to make sure it loads correctly
7. Install the selenium webdriver for firefox: [instructions here](https://firefox-source-docs.mozilla.org/testing/geckodriver/ARM.html)
8. Edit `KindleCalendar/screenshot.py` and set your Firefox profile path under `profile = webdriver.FirefoxProfile(...`
9. Reboot

If everything went fine, you should be able to visit your Pi's IP address on port 8080 with any browser including Kindle, but make sure Javascript is enabled in browser settings.

Enjoy!

Special thanks to [noxquest](https://bitbucket.org/ocampos/noxquest_kindle-tty/src/master/) for his awesome project and `hixie` bridge node library :)
