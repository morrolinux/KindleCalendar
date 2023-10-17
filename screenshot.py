#!/usr/bin/env python3
from selenium.common.exceptions import TimeoutException
from selenium import webdriver
import random
import signal
import sys
from datetime import datetime, timedelta
from PIL import Image, ImageFont, ImageDraw
from io import BytesIO

# Geckodriver Autoinstaller installa automaticamente geckodriver se non è già presente
import geckodriver_autoinstaller

# Configura il gestore del segnale per interrompere il programma in modo pulito
def signal_handler(sig, frame):
    global browser
    print("You pressed Ctrl+C!")
    browser.close()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# Configura le preferenze del browser Firefox
profile = webdriver.FirefoxProfile(
    "/home/pi/.mozilla/firefox/u41lkvuj.default-esr/")
profile.set_preference("dom.webdriver.enabled", False)
profile.set_preference("useAutomationExtension", False)
profile.set_preference("font.size.systemFontScale", 150)
profile.update_preferences()
desired = webdriver.DesiredCapabilities.FIREFOX
opts = webdriver.FirefoxOptions()
opts.add_argument("--width=1200")
opts.add_argument("--height=1048")
opts.add_argument("--headless")
opts.set_preference("general.useragent.override", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36")

# Inizializza il browser
browser = webdriver.Firefox(firefox_profile=profile, desired_capabilities=desired, options=opts)

# Funzione per determinare se è notte
def night():
    return (datetime.now().hour < 8) or (datetime.now().hour > 21)

# Funzione per la gestione del segnale di terminazione
def handle_exit_signal(sig, frame):
    global browser
    print("You pressed Ctrl+C! Exiting...")
    browser.quit()
    sys.exit(0)

# Imposta l'handler del segnale di uscita
signal.signal(signal.SIGINT, handle_exit_signal)
signal.signal(signal.SIGTERM, handle_exit_signal)

# Ciclo principale
try:
    i = -1
    actions = webdriver.ActionChains(browser)
    
    while True:
        i = i + 1

        if night():
            # Immagine notturna bianca
            gcal = Image.new("RGBA", (758, 1048), (255, 255, 255, 255))
            gcal.save("gcal.png")
            time.sleep(3600)
            continue

        # Aggiorna la pagina ogni 60 minuti
        if (i % 6) == 0:
            print("Aggiorno la pagina...")
            browser.get("https://calendar.google.com")
            time.sleep(20 + random.randrange(0, 5))
            browser.execute_script("document.body.style.MozTransform='scale(1.5)';")

        print("Preparazione per la nuova cattura...")
        if (i % 3) == 0:
            try:
                actions.perform()
            except Exception as e:
                print(e)

        # Cattura la barra oraria
        browser.execute_script("document.body.style.MozTransformOrigin = 'left 700px';")
        timebar = Image.open(BytesIO(browser.get_screenshot_as_png()))
        timebar = timebar.crop((15, 0, 57, timebar.size[1]))

        # Sposta alla posizione del giorno corrente (orizzontale)
        if datetime.now().strftime("%A") == "lunedì":
            browser.execute_script("document.body.style.MozTransformOrigin = '120px 700px';")
        if datetime.now().strftime("%A") == "martedì":
            browser.execute_script("document.body.style.MozTransformOrigin = '580px 700px';")
        if datetime.now().strftime("%A") == "mercoledì":
            browser.execute_script("document.body.style.MozTransformOrigin = '1060px 700px';")
        if datetime.now().strftime("%A") == "giovedì":
            browser.execute_script("document.body.style.MozTransformOrigin = '1540px 700px';")
        if datetime.now().strftime("%A") in ["venerdì", "sabato", "domenica"]:
            browser.execute_script("document.body.style.MozTransformOrigin = '2020px 700px';")

        # Cattura l'intera pagina di Google Calendar, la ritaglia alle dimensioni dello schermo e sovrappone la barra oraria
        gcal = Image.open(BytesIO(browser.get_screenshot_as_png()))
        gcal = gcal.crop((0, 0, 758, gcal.size[1]))
        Image.Image.paste(gcal, timebar)

        dateoffsets = [130, 370, 600]

        if datetime.now().strftime("%A") == "sabato":
            daysrange = [-1, 0, 1]
        elif datetime.now().strftime("%A") == "domenica":
            daysrange = [-2, -1, 0]
        else:
            daysrange = [0, 1, 2]

        for i, idx in enumerate(daysrange):
            dt = datetime.now() + timedelta(days=idx)
            datestring = dt.strftime("%A")[:3] + " " + str(dt.day)
            datemark = Image.new("RGBA", (100, 30), (255, 255, 255, 0))
            font = ImageFont.truetype("DejaVuSansMono-Bold", 26)
            draw = ImageDraw.Draw(datemark)
            draw.text((0, 0), datestring, (0, 0, 0), font=font)
            Image.Image.paste(gcal, datemark, (dateoffsets[i], 0), datemark)

        gcal.save("gcal.png")
        print("Screenshot completato")

        time.sleep(600)

finally:
    browser.quit()
