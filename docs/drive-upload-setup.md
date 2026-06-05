# Google Drive Upload Setup

Diese Schritte verbinden das Beitragsformular mit einem Google-Drive-Ordner. Die Webseite speichert
keine Google-Secrets im Repository. Die sensiblen Werte gehoeren nur in Netlify Environment Variables.

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

## 2. Google Cloud Projekt und Drive API

1. Oeffne https://console.cloud.google.com/
2. Erstelle ein neues Projekt oder waehle ein bestehendes Projekt.
3. Suche oben nach `Google Drive API`.
4. Oeffne die Google Drive API.
5. Klicke auf `Enable` bzw. `Aktivieren`.

## 3. Service Account erstellen

1. In Google Cloud: `IAM & Admin` -> `Service Accounts`.
2. Klicke auf `Create service account`.
3. Name: zum Beispiel `gts-wiki-drive-upload`.
4. Klicke weiter und fertigstellen. Eine Projektrolle ist fuer diesen Fall nicht noetig, weil der
   Service Account nur Zugriff auf den Drive-Ordner bekommt, den du gleich explizit teilst.
5. Oeffne den Service Account.
6. Kopiere die Service-Account-E-Mail.

Diese E-Mail wird spaeter:

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL
```

## 4. Drive-Ordner mit Service Account teilen

1. Zurueck zu Google Drive.
2. Rechtsklick auf den Ordner `GTS Wiki Vorschlaege`.
3. `Share` bzw. `Freigeben`.
4. Fuege die Service-Account-E-Mail hinzu.
5. Rolle: `Editor`.
6. Freigeben.

## 5. JSON-Key erstellen

1. In Google Cloud wieder den Service Account oeffnen.
2. Tab `Keys`.
3. `Add key` -> `Create new key`.
4. `JSON` auswaehlen.
5. Datei herunterladen.

Aus dieser JSON-Datei brauchst du:

```text
client_email
private_key
```

Wichtig: Diese JSON-Datei nicht ins Repository legen und nicht oeffentlich teilen.

## 6. Netlify Environment Variables setzen

In Netlify:

1. Projekt oeffnen.
2. `Project configuration`.
3. `Environment variables`.
4. `Add environment variable`.

Lege diese drei Variablen an:

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_DRIVE_FOLDER_ID
```

Werte:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Wert aus `client_email`.
- `GOOGLE_PRIVATE_KEY`: kompletter Wert aus `private_key`, inklusive `-----BEGIN PRIVATE KEY-----`.
- `GOOGLE_DRIVE_FOLDER_ID`: die Ordner-ID aus Google Drive.

Bei `GOOGLE_PRIVATE_KEY` kann der Wert mit echten Zeilenumbruechen oder mit `\n` gespeichert werden.
Die Function kann beides lesen.

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
