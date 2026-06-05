# Google Drive Upload Setup

Diese Schritte verbinden das Beitragsformular mit einem Google-Drive-Ordner. Fuer normale kostenlose
Google-Konten nutzt die Function OAuth mit deinem Google-Konto. Dadurch zaehlen Uploads gegen deinen
Google-Drive-Speicher und nicht gegen einen Service Account ohne Speicherplatz.

Die Webseite speichert keine Google-Secrets im Repository. Die sensiblen Werte gehoeren nur in
Netlify Environment Variables.

## 1. Google-Drive-Ordner vorbereiten

1. Oeffne Google Drive.
2. Erstelle einen Ordner, zum Beispiel `GTS Wiki Vorschlaege`.
3. Oeffne den Ordner.
4. Kopiere die Ordner-ID aus der URL.

Beispiel:

```text
https://drive.google.com/drive/folders/ABC123xyz
```

Die Ordner-ID ist dann:

```text
ABC123xyz
```

Diese ID wird spaeter `GOOGLE_DRIVE_FOLDER_ID`.

## 2. Google Drive API aktivieren

1. Oeffne https://console.cloud.google.com/
2. Waehle dein Projekt.
3. Suche oben nach `Google Drive API`.
4. Oeffne die Google Drive API.
5. Klicke auf `Enable` bzw. `Aktivieren`.

## 3. OAuth-Zustimmungsbildschirm

1. In Google Cloud: `APIs und Dienste` -> `OAuth-Zustimmungsbildschirm`.
2. User Type: `External`, falls gefragt.
3. App-Name: zum Beispiel `GTS Wiki Upload`.
4. User support email: deine E-Mail.
5. Developer contact information: deine E-Mail.
6. Speichern.
7. Unter `Test users` deine eigene Google-E-Mail hinzufuegen.

Die App muss nicht veroeffentlicht werden, solange nur dein Konto den Refresh Token erzeugt.

## 4. OAuth Client erstellen

1. In Google Cloud: `APIs und Dienste` -> `Anmeldedaten`.
2. `+ Anmeldedaten erstellen` -> `OAuth-Client-ID`.
3. Anwendungstyp: `Webanwendung`.
4. Name: zum Beispiel `Netlify Drive Upload`.
5. Autorisierte Weiterleitungs-URI hinzufuegen:

```text
https://developers.google.com/oauthplayground
```

6. Erstellen.
7. `Client-ID` und `Clientschluessel` kopieren.

Diese Werte werden spaeter:

```text
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
```

## 5. Refresh Token erzeugen

1. Oeffne https://developers.google.com/oauthplayground
2. Rechts oben auf das Zahnrad klicken.
3. `Use your own OAuth credentials` aktivieren.
4. OAuth Client ID und OAuth Client Secret eintragen.
5. Links in der Scope-Liste `Drive API v3` oeffnen.
6. Diesen Scope auswaehlen:

```text
https://www.googleapis.com/auth/drive.file
```

7. `Authorize APIs` klicken.
8. Mit deinem Google-Konto anmelden.
9. Warnhinweis akzeptieren, falls die App noch im Testmodus ist.
10. `Exchange authorization code for tokens` klicken.
11. Den `Refresh token` kopieren.

Dieser Wert wird spaeter:

```text
GOOGLE_OAUTH_REFRESH_TOKEN
```

## 6. Netlify Environment Variables setzen

In Netlify:

1. Projekt oeffnen.
2. `Project configuration`.
3. `Environment variables`.
4. `Add environment variable`.

Lege diese vier Variablen an:

```text
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REFRESH_TOKEN
GOOGLE_DRIVE_FOLDER_ID
```

Empfehlung:

- `GOOGLE_OAUTH_CLIENT_SECRET` als Secret markieren.
- `GOOGLE_OAUTH_REFRESH_TOKEN` als Secret markieren.
- Scopes: mindestens `Functions`, gern `All scopes`.

Die alten Service-Account-Variablen werden fuer den OAuth-Weg nicht mehr gebraucht:

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
```

Sie koennen entfernt werden, sobald OAuth funktioniert.

## 7. Redeploy und Test

1. In Netlify einen neuen Deploy starten.
2. Danach `/beitragen` oeffnen.
3. Kleine Testdatei hochladen, am besten unter 1 MB.
4. Pruefen:
   - Datei landet im Drive-Ordner.
   - Netlify Forms zeigt eine Submission.
   - Die E-Mail enthaelt den Dateinamen und den Drive-Link.

Hinweis: Wegen Netlify Function Payload-Limits ist die Webseite auf Dateien bis 5 MB begrenzt.
Groessere Dateien sollten weiterhin als Google-Drive-/OneDrive-Link eingereicht werden.
