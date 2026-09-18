# Il Pescematto — Trattoria del Mare (Imperia)

Sito web / Web app (Expo + react-native-web) per il ristorante "Il Pescematto" a Borgo Prino, Imperia. Design elegante marittimo (dark) ispirato al logo. Il progetto è pubblicabile come sito web tramite il pulsante Publish di Emergent.

## Funzionalità
- **Home**: logo bundlato, tagline, stato Aperto/Chiuso live, CTA "Vedi il Menu" e "Prenota".
- **Menu**: 9 categorie con chip orizzontali sticky, prezzi in oro, allergeni per piatto. Modal "Allergeni" con legenda completa (14 voci). Menu dinamico, caricato da storage locale (override gestore) o dal default.
- **Info**: contatti tappabili (telefono, "Apri in Maps"), tabella orari, coperto, informazioni legali societarie, link legali.
- **Area riservata gestore** (`/admin/login` → `/admin/settings` → `/admin/menu`): modifica numero di telefono e menu completo (aggiunta/modifica/eliminazione/riordino piatti, reset).

## Compliance & Legal
- **Cookie notice**: pannello informativo alla prima visita (chiusura tramite "Ho capito" o link Cookie Policy). Non oscura la pagina.
- **Cookie Policy** (`/cookie-policy`): elenca solo strumenti tecnici realmente usati (`settings.phone`, `settings.menu`, `cookie_notice.acknowledged`). Pulsante per cancellare le preferenze locali dal dispositivo. Elenco esplicito di strumenti NON usati (Analytics, Meta Pixel, ecc.).
- **Privacy Policy** (`/privacy-policy`): impianto GDPR con dati del Titolare (TRATTORIA DELLA SALUTE S.R.L.S.) e placeholder `[DA COMPLETARE]` per email privacy, DPO e altre voci fuori portata del codice.
- Footer Info ha 3 link: Cookie Policy · Privacy Policy · Gestisci cookie (riapre l'informativa).
- Tutte le immagini sono nel bundle locale (`assets/images/local/`): il sito non fa richieste a domini terzi. Google Maps si apre solo su click esplicito dell'utente.

## Stack tecnico
- Expo 57 + expo-router (tabs + stack), react-native-safe-area-context, expo-image, expo-linear-gradient, expo-blur, expo-haptics, @react-native-vector-icons/feather.
- Storage locale via `@/src/utils/storage`. Nessun backend.
- `app.json` ottimizzato per web (rimossi `ios.bundleIdentifier`, `android.package`, `android.adaptiveIcon`, `ios.supportsTablet`).

## Da completare a cura del Titolare
- Email dedicata alle richieste privacy nella Privacy Policy.
- Eventuale nomina DPO (di norma non richiesta per la ristorazione).
- Periodi di conservazione di dati raccolti off-site (prenotazioni telefoniche).
