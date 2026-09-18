# Il Pescematto — Trattoria del Mare (Imperia)

Mobile app Expo/React Native per il ristorante "Il Pescematto" a Borgo Prino, Imperia. Design elegante marittimo (dark) ispirato al logo.

## Funzionalità
- **Home**: logo, tagline, stato Aperto/Chiuso live, CTA "Vedi il Menu" e "Prenota" (tel:).
- **Menu**: 9 categorie (Aperitivi, Bevande, Antipasti, Primi, Frittura, Secondi di Pesce, Griglia, Carni, Pizze) con chip orizzontali sticky, prezzi in oro, allergeni per piatto. Modal "Allergeni" con legenda completa (14 voci).
- **Info**: contatti tappabili (telefono, "Apri in Maps"), tabella orari con evidenza del giorno corrente ("Mercoledì → Chiuso"), coperto € 2,00.
- **Footer legale**: dati societari TRATTORIA DELLA SALUTE S.R.L.S.
- **Area riservata gestore**: login con username/password (nascosto in fondo alla pagina Info). Permette di modificare il numero di telefono mostrato in Home e Info (salvataggio locale via AsyncStorage). Credenziali in `frontend/.env`.

## Stack tecnico
- Expo 57 + expo-router (tabs + stack), react-native-safe-area-context, react-native-reanimated, expo-image, expo-linear-gradient, expo-blur, expo-haptics, @react-native-vector-icons/feather.
- Nessun backend: dati menu statici in `/app/frontend/src/data/menu.ts`.

## File chiave
- `/app/frontend/app/_layout.tsx` — root con SafeArea + prewarming icone.
- `/app/frontend/app/(tabs)/{index,menu,info}.tsx` — tab principali.
- `/app/frontend/app/admin/{login,settings}.tsx` — area riservata.
- `/app/frontend/src/hooks/useSettings.ts` — hook telefono + auth gestore.
- `/app/frontend/src/theme.ts` — token colore (dark) + spacing + font.

## Note
- L'accesso gestore è client-only (device gate); credenziali in `EXPO_PUBLIC_ADMIN_USER` / `EXPO_PUBLIC_ADMIN_PASS`. In deploy pubblico i valori sono visibili nel bundle — sufficiente per un semplice pannello locale, non per protezione di dati sensibili.
