# Piano — Pannello amministrativo Il Pescematto

## Obiettivo
Rendere completamente gestibile dal titolare, senza toccare il codice, tutto ciò che oggi è "cablato" nell'app: menu (categorie e prodotti), orari, chiusure straordinarie e informazioni del ristorante. L'app pubblica esistente (Home, Menu, Info) resta com'è dal punto di vista visivo e di navigazione: cambia solo la sorgente dei contenuti, che passa dai dati hardcoded a un backend.

## Come funziona per chi la usa

### Sito/app pubblico
Nessuna differenza percepibile: le tre schede attuali continuano a mostrare gli stessi contenuti, ma leggendoli dal server. All'apertura viene mostrato un breve caricamento se la rete è lenta; se il server non risponde, l'app mostra l'ultima versione dei contenuti già vista in precedenza (fallback offline), così un cliente non trova mai una pagina vuota.

### Area amministrativa
Accessibile solo tramite l'indirizzo `/admin/login` (sull'anteprima web e, dopo il deploy, sul dominio pubblicato). Non è raggiungibile da alcun link dell'app pubblica ed è indicizzabile solo da chi conosce l'URL. Chiunque provi ad aprire `/admin` senza aver fatto login viene rimandato alla schermata di login.

**Login** — un unico account "titolare" con email e password. Nessuna pagina di registrazione, nessun recupero password automatico via email in questa prima versione (verrà scelta la password iniziale — vedi "Decisioni aperte"). Dopo 5 tentativi sbagliati consecutivi dallo stesso indirizzo IP, ulteriori tentativi vengono bloccati per 15 minuti.

**Dashboard** — schermata iniziale con quattro tessere che portano alle sezioni gestibili, più un riepilogo (stato aperto/chiuso di oggi, prossima chiusura straordinaria in programma, numero di prodotti a menu).

**Sezione Menu** — elenco delle categorie in ordine di visualizzazione, ciascuna espandibile per vedere i prodotti al suo interno. Per ogni categoria: rinomina, riordina (frecce su/giù o drag), elimina (con conferma). Per ogni prodotto: modifica nome, descrizione, prezzo, allergeni; sposta in un'altra categoria; riordina; imposta un badge tra "Novità", "Consigliato", "Non disponibile" (uno solo alla volta) oppure nessuno; elimina (con conferma). Aggiunta rapida di una nuova categoria o di un nuovo prodotto. Le variazioni sono salvate una a una con feedback "Modifiche salvate correttamente" e sono visibili nell'app pubblica subito dopo il salvataggio.

Nota — I prodotti marcati "Non disponibile" restano visibili nel menu pubblico ma appaiono in grigio con l'etichetta "Non disponibile" (scelta comune per le trattorie: il cliente vede che il piatto esiste ma non è ordinabile oggi).

**Sezione Orari** — una riga per ogni giorno della settimana. Per ciascun giorno: interruttore "Aperto/Chiuso" e, se aperto, una o più fasce orarie (es. 12:00–14:30 e 19:00–22:30). Pulsante "Aggiungi fascia" per gestire il pranzo e la cena in modo indipendente, con possibilità di aggiungerne altre in casi speciali. Le modifiche aggiornano immediatamente la scheda Info e la fascia "Aperto ora / Chiuso" della Home.

**Sezione Chiusure straordinarie** — elenco cronologico delle date di chiusura (es. 25 dicembre, Ferragosto). Per ciascuna: data, motivazione opzionale (mostrata al cliente solo se compilata), modifica ed eliminazione. Le chiusure straordinarie hanno la precedenza sugli orari settimanali: nel giorno di chiusura l'app pubblica mostra "Chiuso" e, se presente, la motivazione.

**Sezione Informazioni** — modulo unico con: nome del locale, sottotitolo/tagline, descrizione (testo libero visualizzato sulla Home), indirizzo, telefono (usato dai pulsanti "Chiama"), email, link Google Maps, link social (Facebook, Instagram — opzionali; se compilati, appaiono come icone nella scheda Info).

**Account** — cambio password (richiede la password attuale). Nessun'altra impostazione in questa prima versione.

**Logout** — pulsante sempre visibile nella barra laterale (o nel menu a tendina su mobile). Termina la sessione e riporta al login.

### Layout dell'admin
Sidebar verticale a sinistra su desktop/tablet con le voci: Dashboard, Menu, Orari, Chiusure, Informazioni, Account, Logout. Su smartphone la sidebar diventa un menu a tendina apribile dall'icona ☰ in alto a sinistra. Interfaccia in italiano, testi chiari, pulsanti grandi, tipografia leggibile. Tutte le operazioni (creazione, modifica, riordino, cancellazione) sono possibili anche da telefono.

## Cosa cambia sull'app pubblica
- Menu, orari, chiusure e informazioni non sono più letti da un file di codice ma da una chiamata al server. I contenuti attuali (menu completo del Pescematto, orari 12:00–14:30 / 19:00–22:30 tranne mercoledì, indirizzo Borgo Prino Imperia, telefono 0183 754557) vengono usati come "contenuto iniziale" e resteranno identici a quelli visibili oggi finché il titolare non li modificherà.
- L'indicatore "Aperto ora / Chiuso" tiene conto anche delle chiusure straordinarie.
- Se un prodotto è "Non disponibile", viene mostrato in grigio con etichetta; se è "Novità" o "Consigliato", ha un piccolo badge dorato di fianco al nome.

## Sicurezza — come è protetta l'area admin
- Password del titolare salvata solo come hash sicuro (bcrypt) nel database. Nessuna credenziale scritta nel codice dell'app.
- La verifica delle credenziali avviene esclusivamente sul server. Il codice dell'app scaricato dai clienti non contiene né user né password né chiavi segrete.
- Ogni chiamata alle API di amministrazione (creare, modificare, eliminare) richiede un token di sessione valido; senza token, il server risponde 401 Unauthorized. Il fatto che l'interfaccia admin sia nascosta al pubblico non è la sola barriera: anche chi provasse a chiamare le API direttamente riceverebbe un rifiuto.
- Comunicazione sempre in HTTPS (già garantita dall'ambiente di anteprima e di produzione Emergent).
- Protezione contro tentativi ripetuti di login: 5 errori dallo stesso IP → blocco temporaneo di 15 minuti.
- Il token di sessione ha durata 7 giorni (finestra abbastanza comoda per il titolare, senza essere eterna). Il logout invalida il token immediatamente.
- Sanificazione dei dati in ingresso: nome/descrizione dei prodotti passano da un controllo di lunghezza massima e di caratteri consentiti; il prezzo viene interpretato come numero e formattato server-side.

## Cosa NON è incluso in questa versione
Per tenere il progetto snello e coerente con la richiesta, restano fuori:
- Registrazione pubblica utenti (esplicitamente esclusa dalla richiesta).
- Recupero password via email (non richiesto; la password si cambia dal pannello Account una volta loggati).
- Autenticazione a due fattori.
- Prenotazioni online (l'utente conferma "solo numero di telefono da chiamare").
- Ordini da asporto o pagamenti.
- Multi-utente (più account amministratori).
- Caricamento immagini per i piatti (l'utente ha scelto "solo menu testuale", nessuna galleria).
- Traduzioni multilingua dell'app pubblica.

Questi punti sono aggiungibili come iterazioni future.

## Decisioni aperte — cortesemente da confermare
1. **Credenziali iniziali del titolare.** Servono l'email e la password di partenza per il primo login. Se preferisci, posso generare io una password iniziale robusta e mostrarla una sola volta; il titolare la cambierà al primo accesso dalla sezione "Account". In alternativa scegli tu email + password.
2. **URL della pagina di login.** Confermi `/admin/login` (e area protetta su `/admin`) oppure preferisci un percorso meno indovinabile, ad esempio `/gestione/…`? Un URL meno prevedibile aggiunge un piccolo scoraggiamento ma nulla di più (la protezione vera è il login).
3. **Badge "Novità / Consigliato / Non disponibile" — comportamento sul pubblico.** Confermi che "Non disponibile" debba restare visibile in grigio con etichetta (mostra al cliente che il piatto esiste ma oggi non c'è)? In alternativa può essere nascosto del tutto dalla lista.
4. **Chiusure straordinarie ricorrenti.** Ti serve poter marcare una data come "chiusura ricorrente ogni anno" (es. 25 dicembre sempre chiuso), oppure ogni anno si inseriscono manualmente le nuove date? La prima opzione è più comoda ma aggiunge una piccola complessità alla schermata.
5. **Motivazione della chiusura visibile al cliente.** La motivazione va mostrata sull'app pubblica accanto al giorno chiuso (es. "Chiuso — Ferie estive") o resta solo un promemoria interno per il titolare?

Se non risponderai a uno o più di questi punti, procederò con queste scelte di default: (1) genero una password iniziale robusta e la mostrerò nel messaggio finale; (2) URL `/admin/login`; (3) "Non disponibile" resta visibile in grigio; (4) niente ricorrenze automatiche, le chiusure si inseriscono anno per anno; (5) la motivazione è visibile al cliente solo se compilata.
