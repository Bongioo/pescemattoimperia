# Piano — Pubblicazione come sito web + gestione cookie/tracciamento

## 1. Da progetto Expo a sito web pubblico

Il progetto è già impostato su Expo con `react-native-web`. Può essere pubblicato come sito web senza riscriverlo: le stesse schermate (Home, Menu, Info, Area gestore) diventano pagine SPA servite dal browser.

Verranno rimosse dal manifest solo le configurazioni utili unicamente allo Store:
- identificativo pacchetto iOS
- identificativo pacchetto Android
- icona adattiva Android
- flag "supportsTablet" iOS

Non verrà tolto niente che serva al funzionamento web. Il pulsante di pubblicazione di Emergent viene usato in modalità "solo web".

Nessun cambio a design, contenuti o funzionalità.

---

## 2. Audit reale del progetto (ciò che il sito usa oggi)

Analisi del codice così com'è, senza inventare nulla:

### Cookie propri del sito
Nessuno. Il sito non imposta cookie sul proprio dominio.

### Local storage (prima parte, tecnico)
- `settings.phone` — numero di telefono personalizzato dal gestore
- `settings.menu` — versione personalizzata del menu dal gestore

Entrambi servono al funzionamento della funzione di modifica del gestore. Non escono dal browser, non vengono inviati a nessuno.

### Area gestore
Autenticazione tenuta solo in memoria (persa alla chiusura della scheda). Nessun cookie, nessun token persistente.

### Risorse caricate da domini esterni
- 1 logo servito da `customer-assets-cm19k8pv.emergentagent.net` (dominio della piattaforma di hosting)
- 2 immagini di sfondo servite da `images.unsplash.com` (hero della Home e banner della Info)

Queste sono richieste di sole immagini, non impostano cookie di tracciamento sul dominio del sito, ma sono comunque richieste verso un dominio terzo.

### Servizi terzi che si attivano solo su azione esplicita dell'utente
- "Apri in Maps" apre Google Maps in una nuova scheda (link esterno standard)
- "Chiama" / "Prenota" apre il compositore telefonico (`tel:`)

Nessun contenuto di terze parti è incorporato in pagina.

### Cosa NON è presente nel progetto
Nessun Google Analytics, nessun Google Tag Manager, nessun Meta/Facebook Pixel, nessun TikTok Pixel, nessun embed YouTube o Instagram, nessun font caricato da CDN, nessun sistema di prenotazione, nessun chatbot, nessun widget marketing, nessuna libreria di fingerprinting.

### Conclusione dell'audit
Il sito nella sua forma attuale usa **soltanto strumenti tecnici**. Non c'è nulla per cui, oggi, sia richiesto un consenso preventivo dell'utente.

---

## 3. Scelta sulle immagini remote

Le due hero images (Unsplash) e il logo (CDN Emergent) sono immagini decorative caricate da domini terzi. Non fanno tracking, ma sono comunque richieste esterne che l'utente attento può notare negli strumenti di sviluppo del browser.

Due possibili strade:

**A. Portarle nel bundle del sito** (raccomandata): il sito non fa più alcuna richiesta di dominio terzo. La Cookie Policy diventa più semplice e onesta perché non deve neanche menzionarle. Costo: qualche centinaio di KB in più nel pacchetto scaricato al primo accesso.

**B. Lasciarle remote**: nessun cambiamento tecnico, ma la Cookie Policy dovrà elencare `images.unsplash.com` (e il dominio Emergent) come fornitori di risorse grafiche di terza parte.

Assunzione senza risposta contraria: **Opzione A**.

---

## 4. Cosa verrà mostrato all'utente

Poiché non ci sono strumenti che richiedano consenso, non verrà costruito un finto pannello "Accetta / Rifiuta / Personalizza" — sarebbe fittizio e in contrasto con le richieste stesse dell'utente. Verrà invece implementato:

### a. Un'informativa breve alla prima visita
Piccolo pannello in basso, coerente con lo stile del sito (stessi colori scuri marittimi, stesso font display, stessi bordi), non oscura la pagina.

Testo indicativo:
> "Questo sito usa soltanto strumenti tecnici salvati sul tuo browser (per esempio per ricordare le modifiche fatte dal gestore al menu). Non usiamo analytics, cookie di profilazione o pixel di marketing. Puoi leggere la Cookie Policy per il dettaglio."

Un solo pulsante di chiusura ("Ho capito") e un link "Leggi la Cookie Policy". Nessuna casella preselezionata, nessun consenso mascherato: la chiusura è solo un acknowledgment dell'informativa, non un consenso a tracciamenti (che non esistono).

Lo scroll e la semplice navigazione non chiudono il banner. La chiusura richiede un click esplicito.

### b. Link "Gestisci cookie" sempre disponibile
Aggiunto nel footer già presente (pagina Info). Riapre l'informativa e permette anche di cancellare le preferenze tecniche locali (pulsante "Cancella preferenze salvate su questo dispositivo", che svuota `settings.phone` e `settings.menu`).

### c. Se in futuro il titolare vorrà attivare analytics o strumenti di marketing
La stessa infrastruttura verrà estesa al modello a tre pulsanti (Accetta / Rifiuta / Personalizza) con blocco preventivo degli script. Non lo facciamo ora perché oggi non c'è nulla da bloccare.

---

## 5. Pagina Cookie Policy — `/cookie-policy`

Contenuto costruito solo su ciò che l'audit ha trovato. Sezioni previste:

- **Strumenti tecnici locali**: tabella con `settings.phone` e `settings.menu`. Per ciascuno: fornitore (prima parte, il sito stesso), tipologia (localStorage), finalità, durata (persistente finché l'utente non li cancella dal browser), come cancellarli.
- **Terze parti — risorse grafiche**: sezione presente solo se resta l'Opzione B del punto 3.
- **Servizi aperti dall'utente su click esplicito**: Google Maps (link esterno) e compositore telefonico. Nota che, una volta aperto Google Maps, si applica la privacy policy di Google.
- **Area riservata gestore**: sessione tenuta in memoria durante la visita, nessun cookie né storage persistente.
- **Cosa NON usiamo**: elenco esplicito di Google Analytics, Google Tag Manager, Meta Pixel, TikTok Pixel, YouTube embed, Instagram, Facebook SDK, chat, font esterni. Serve alla trasparenza.
- Data di ultimo aggiornamento e collegamento alla Privacy Policy.

Nessun campo verrà inventato. Se un dato non è deducibile dal progetto, viene segnalato come "da completare a cura del titolare", non riempito con contenuto fittizio.

---

## 6. Pagina Privacy Policy — `/privacy-policy`

Sarà creata una struttura predisposta. I dati del titolare già in nostro possesso vengono usati così come sono:
- TRATTORIA DELLA SALUTE S.R.L.S.
- Piazza Matteotti n. 6, 18015 Riva Ligure (IM)
- P.IVA / C.F. 01716090087 — REA 220844
- Telefono 0183 754557

Verranno inseriti placeholder chiaramente marcati (`[DA COMPLETARE — …]`) per le informazioni che il sito da solo non può ricavare, in particolare:
- indirizzo email dedicato alle richieste privacy
- eventuale DPO
- eventuali trattamenti offline (fatturazione, prenotazioni telefoniche) che il titolare vorrà descrivere

Non verranno inventati DPO, email o finalità di trattamento inesistenti.

---

## 7. Cosa non verrà cambiato

Nessun cambiamento a: palette, font, layout, contenuti del menu, orari, info di contatto, flusso di login gestore, modifica telefono, modifica menu. Il pulsante "Publish" di Emergent continua a funzionare come oggi.

---

## 8. Punti che richiedono una scelta del titolare

Elencati esplicitamente perché il piano non può decidere per lui:

1. Email di contatto per richieste privacy (necessaria in Privacy Policy).
2. Eventuale nomina di un DPO (di solito non richiesta per questo tipo di attività, ma è una scelta del titolare).
3. Opzione A vs B sulle immagini remote (punto 3).
4. Se in futuro verrà aggiunto un form di prenotazione online, un widget di recensioni, un pixel pubblicitario o Google Analytics: cambierà l'audit e verrà attivato un vero banner con blocco preventivo.

---

## 9. Rischio residuo dichiarato

L'implementazione tecnica sarà coerente con quello che il sito fa oggi. Non verrà dichiarato che il sito è "conforme al 100%" a nessuna normativa: la conformità legale piena richiede una verifica di un professionista del diritto, che non viene fatta qui. L'obiettivo di questo lavoro è tecnicamente corretto, coerente con la normativa italiana/europea sui cookie applicata a un sito che usa solo strumenti tecnici, e predisposto a evolvere se in futuro verranno aggiunti strumenti che richiedono consenso.
