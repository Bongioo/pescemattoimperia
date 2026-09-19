# Piano — Pubblicare Il Pescematto come sito web

## Punto di partenza

Il progetto è già oggi un sito web funzionante:
- L'interfaccia (Home, Menu, Info, area gestore, Cookie Policy, Privacy Policy) gira nel browser come single-page application.
- Il backend risponde sotto lo stesso dominio, sulle rotte `/api/*`, quindi non serve gestire un secondo indirizzo.
- Menu e numero di telefono sono salvati su server e visibili a tutti i visitatori.

"Pubblicare come sito web" significa, in pratica, premere il pulsante **Publish** in alto a destra dell'editor Emergent e scegliere il flusso di deploy web. Non serve un altro provider, un altro dominio a pagamento, né riscrivere codice.

Il piano copre tutto ciò che è meglio sistemare *prima* di premere Publish, così il risultato pubblicato è pulito. Non introduce nuove funzionalità.

---

## 1. Nome e identità del sito nel browser

Oggi la scheda del browser mostra "il-pescematto" (nome tecnico del progetto) e l'icona è il logo generico Expo. In un sito pubblico bisogna renderli professionali.

Verrà cambiato:
- **Titolo pagina** → "Il Pescematto — Trattoria del Mare · Imperia"
- **Favicon** → il logo del ristorante (quello già usato in Home), preparato nelle dimensioni corrette per browser desktop e mobile
- **Nome dell'app nel manifest web** → "Il Pescematto"

Nessuna modifica al design interno.

---

## 2. Descrizione per motori di ricerca e condivisioni social

Quando qualcuno cerca il ristorante su Google, o incolla il link su WhatsApp / Facebook / Messenger, oggi appare un'anteprima vuota. Verrà aggiunta:

- **Meta description**: una frase breve tipo "Trattoria di mare a Borgo Prino, Imperia. Menu di pesce fresco, griglia Josper e pizze. Aperto tutti i giorni tranne il mercoledì."
- **Open Graph / Twitter Card**: titolo, descrizione, immagine di anteprima (il logo su sfondo scuro dell'app). È l'immagine che appare quando si incolla il link in una chat.
- **Lingua della pagina** dichiarata come italiano.
- **Nessun sistema di analytics o pixel** viene aggiunto. Se in futuro il titolare vorrà misurare le visite, si aggiornerà l'informativa e verrà attivato un vero banner di consenso.

---

## 3. Cosa succede nel momento del Publish

Lato utente:
- Il sito diventa raggiungibile all'indirizzo assegnato da Emergent (in genere `nome-progetto.emergent.host` o simile).
- L'indirizzo è servito in HTTPS.
- Il database del sito di preview e il database di produzione si separano da quel momento in poi: le modifiche al menu fatte oggi in anteprima non arrivano automaticamente in produzione. Dopo il primo deploy, il gestore rifà login sul sito pubblicato e aggiorna telefono / menu una volta; da lì restano.
- Le credenziali dell'area riservata gestore (username `PESCEMATTO`, password `MRPescematto.2026`) vengono copiate come Secrets nel pannello di deploy al primo Publish. Se il titolare vuole cambiare la password dopo il deploy, si genera un nuovo hash bcrypt e si aggiorna il Secret — non serve rideployare tutto.

Lato tecnico (già coperto dall'audit di deploy fatto):
- Il codice compila.
- Le variabili sensibili sono lato server, non nel bundle.
- Le rotte API sono sotto `/api` come richiesto.

---

## 4. Prima di premere Publish — cose che il titolare deve decidere

Non li può decidere il piano. Vanno confermati o assunti come default:

1. **Nome pubblico del dominio**: si tiene quello suggerito da Emergent oppure il titolare comunicherà un dominio proprio (per esempio `ilpescematto.it`) da collegare dopo il deploy?
   - **Assunzione se non risponde**: si tiene il dominio Emergent per il primo deploy. Il collegamento di un dominio proprio è un passaggio separato che avviene dopo, dal pannello Emergent.
2. **Email privacy nella Privacy Policy**: oggi è segnata come `[DA COMPLETARE]`. Prima del Publish sarebbe corretto sostituirla con l'indirizzo email a cui i clienti possono scrivere per richieste privacy.
   - **Assunzione se non risponde**: si lascia il placeholder. Il sito pubblicato mostrerà "[DA COMPLETARE]" nella policy, cosa visibile ai visitatori. Si consiglia di non lasciarlo così.
3. **Immagine per anteprima social**: si tiene il logo attuale come immagine di condivisione, oppure il titolare fornirà una foto specifica del locale?
   - **Assunzione se non risponde**: si usa il logo su sfondo scuro (già nell'app).
4. **Password gestore in produzione**: si tiene `MRPescematto.2026` anche sul sito pubblicato, o si sceglie una password diversa da usare solo online?
   - **Assunzione se non risponde**: si tiene la stessa.

---

## 5. Cosa il piano **non** fa

- Non compra domini.
- Non attiva analytics, pixel pubblicitari, form di contatto o sistemi di prenotazione online. Se aggiunti in futuro, cambia l'informativa cookie e va rivalutato.
- Non modifica il flusso di modifica menu / telefono già esistente.
- Non tocca colori, layout, contenuti del menu, orari.
- Non deploya al posto del titolare: il pulsante Publish va premuto da chi ha accesso all'editor.

---

## 6. Sintesi dell'esito atteso

Dopo l'approvazione di questo piano e l'esecuzione:
- L'anteprima in preview è identica a quella pubblicata, salvo il dominio.
- Chi apre il link vede "Il Pescematto — Trattoria del Mare · Imperia" nella scheda del browser, il logo come favicon, e un'anteprima decorosa se il link viene condiviso su chat / social.
- Il titolare può aggiornare menu e telefono dal proprio dispositivo e le modifiche sono visibili a tutti.
- Nessuna nuova dipendenza esterna, nessun costo aggiuntivo rispetto all'hosting Emergent, nessun tracciamento di visitatori.
