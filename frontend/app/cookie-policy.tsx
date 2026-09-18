import { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import {
  LegalPage,
  LegalSection,
  LegalParagraph,
  LegalBullets,
  LegalTable,
  LegalCallout,
} from "@/src/components/legal-page";
import { clearLocalPreferences } from "@/src/hooks/useCookieNotice";
import { makeStyles, fonts, spacing, radius } from "@/src/theme";

const LAST_UPDATE = "18 febbraio 2026";

export default function CookiePolicy() {
  const styles = useStyles();
  const router = useRouter();
  const [cleared, setCleared] = useState(false);

  const haptic = (kind: "success" | "light" = "light") => {
    if (Platform.OS === "web") return;
    if (kind === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const doClear = async () => {
    await clearLocalPreferences();
    setCleared(true);
    haptic("success");
    setTimeout(() => setCleared(false), 2500);
  };

  return (
    <LegalPage eyebrow="Il Pescematto" title="Cookie Policy" testID="cookie-policy-screen">
      <LegalParagraph>
        La presente Cookie Policy descrive gli strumenti di memorizzazione utilizzati
        dal sito «Il Pescematto — Trattoria del Mare» (di seguito, il «Sito»). Ultimo
        aggiornamento: {LAST_UPDATE}.
      </LegalParagraph>

      <LegalSection title="1. Introduzione">
        <LegalParagraph>
          Il Sito è realizzato come applicazione a pagina singola. Non imposta cookie
          sul proprio dominio e non utilizza strumenti di analisi statistica o
          profilazione. Vengono impiegate esclusivamente memorizzazioni locali
          strettamente necessarie al funzionamento delle funzionalità offerte.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Strumenti tecnici locali (localStorage)">
        <LegalParagraph>
          Il Sito utilizza il localStorage del browser (o SecureStore su
          applicazione nativa) esclusivamente per due finalità tecniche
          strettamente necessarie: mantenere la sessione dell'area riservata
          gestore e ricordare che l'informativa iniziale è stata visualizzata.
          Le informazioni pubbliche (numero di telefono, menu) sono invece
          conservate sul nostro server per garantire coerenza tra tutti i
          visitatori.
        </LegalParagraph>
        <LegalTable
          columns={["Chiave", "Tipo", "Finalità", "Durata"]}
          rows={[
            [
              "auth.token",
              "localStorage",
              "Mantiene la sessione dell'area riservata dopo il login del gestore. Assente per gli utenti non autenticati.",
              "12 ore o fino al logout / cancellazione manuale.",
            ],
            [
              "cookie_notice.acknowledged",
              "localStorage",
              "Ricorda che l'informativa iniziale è stata visualizzata.",
              "Persistente finché non viene cancellato dal browser.",
            ],
          ]}
        />
        <LegalCallout>
          Trattandosi di strumenti strettamente necessari, l'utilizzo non richiede
          consenso preventivo, ai sensi dell'art. 122 del Codice Privacy e delle
          linee guida del Garante del 10 giugno 2021.
        </LegalCallout>
      </LegalSection>

      <LegalSection title="3. Dati conservati sul server">
        <LegalParagraph>
          Le informazioni pubbliche mostrate ai visitatori (numero di telefono e
          menu) sono conservate su un nostro database, gestito dal fornitore
          tecnico di hosting. Non contengono dati personali di visitatori. Le
          modifiche possono essere effettuate esclusivamente dal gestore
          autenticato.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Area riservata gestore">
        <LegalParagraph>
          L'accesso all'area riservata avviene tramite credenziali verificate
          lato server. In caso di autenticazione riuscita il server rilascia un
          token temporaneo (JWT) valido 12 ore, che il browser conserva
          localmente e che accompagna le richieste di modifica. La password non
          è mai memorizzata nell'app: sul server è conservato solo un hash
          crittografico (bcrypt).
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="5. Servizi aperti su azione esplicita dell'utente">
        <LegalParagraph>
          Alcune azioni dell'utente possono richiamare applicazioni o servizi di
          terze parti, il cui utilizzo è governato dalle rispettive privacy policy:
        </LegalParagraph>
        <LegalBullets
          items={[
            "«Apri in Maps» apre l'applicazione di Google Maps o il suo sito in una nuova scheda (Privacy Policy Google).",
            "«Chiama» / «Prenota» attiva il compositore telefonico del dispositivo.",
          ]}
        />
        <LegalParagraph>
          Nessun contenuto di terze parti è incorporato all'interno del Sito.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Strumenti che NON utilizziamo">
        <LegalParagraph>
          A fini di trasparenza, si precisa che il Sito non utilizza:
        </LegalParagraph>
        <LegalBullets
          items={[
            "Google Analytics, Google Tag Manager e affini",
            "Pixel di tracciamento pubblicitario (Meta/Facebook, TikTok, LinkedIn, Google Ads)",
            "Embed video (YouTube, Vimeo) o social (Instagram, Facebook, X)",
            "Servizi di chat, live chat o chatbot",
            "Font caricati da CDN esterne",
            "Librerie di fingerprinting o profilazione",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Gestione delle preferenze e cancellazione">
        <LegalParagraph>
          È possibile cancellare in qualsiasi momento le informazioni tecniche
          salvate localmente da questo dispositivo (token di sessione gestore e
          preferenza di visualizzazione dell'informativa). I dati pubblici del
          Sito (numero di telefono e menu) restano invece invariati sul server.
        </LegalParagraph>
        <Pressable
          onPress={doClear}
          style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.85 }]}
          testID="cookie-policy-clear"
        >
          <Feather name="trash-2" size={14} color="#C4A464" />
          <Text style={styles.clearBtnText}>Cancella preferenze salvate su questo dispositivo</Text>
        </Pressable>
        {cleared && (
          <View style={styles.savedPill} testID="cookie-policy-cleared">
            <Feather name="check-circle" size={12} color="#5EAD6E" />
            <Text style={styles.savedText}>Preferenze cancellate</Text>
          </View>
        )}
        <LegalParagraph>
          È inoltre possibile svuotare l'intero storage locale dalle impostazioni
          del browser (Chrome, Safari, Firefox, Edge: sezione «Cookie e dati dei
          siti»).
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Titolare del trattamento">
        <LegalParagraph>
          Il Titolare è TRATTORIA DELLA SALUTE S.R.L.S., con sede legale in Piazza
          Matteotti n. 6 — 18015 Riva Ligure (IM), P.IVA / C.F. 01716090087. Per
          ogni dettaglio consulta la{" "}
        </LegalParagraph>
        <Pressable
          onPress={() => router.push("/privacy-policy")}
          testID="cookie-policy-privacy-link"
        >
          <Text style={styles.link}>Privacy Policy →</Text>
        </Pressable>
      </LegalSection>

      <LegalSection title="9. Aggiornamenti">
        <LegalParagraph>
          Ci riserviamo di aggiornare la presente Cookie Policy qualora vengano
          introdotti nuovi strumenti. In tal caso verrà mostrata una nuova
          informativa all'utente.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}

const useStyles = makeStyles((colors) => ({
  clearBtn: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.brandPrimary,
    backgroundColor: "rgba(196,164,100,0.06)",
  },
  clearBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: colors.brandPrimary,
    textAlign: "center",
  },
  savedPill: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 0.5,
    borderColor: "#5EAD6E",
    backgroundColor: "rgba(94,173,110,0.08)",
  },
  savedText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: "#5EAD6E",
  },
  link: {
    marginTop: spacing.sm,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.brandPrimary,
    letterSpacing: 0.3,
  },
}));
