import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import {
  LegalPage,
  LegalSection,
  LegalParagraph,
  LegalBullets,
} from "@/src/components/legal-page";
import { makeStyles, fonts, spacing } from "@/src/theme";

const LAST_UPDATE = "18 febbraio 2026";

export default function PrivacyPolicy() {
  const styles = useStyles();
  const router = useRouter();

  return (
    <LegalPage eyebrow="Il Pescematto" title="Privacy Policy" testID="privacy-policy-screen">
      <LegalParagraph>
        La presente Informativa descrive il trattamento dei dati personali
        nell'ambito del sito «Il Pescematto — Trattoria del Mare», ai sensi
        degli artt. 13 e 14 del Regolamento (UE) 2016/679 («GDPR»). Ultimo
        aggiornamento: {LAST_UPDATE}.
      </LegalParagraph>

      <LegalSection title="1. Titolare del trattamento">
        <LegalParagraph>
          TRATTORIA DELLA SALUTE S.R.L.S. (unipersonale)
          {"\n"}Sede legale: Piazza Matteotti n. 6 — 18015 Riva Ligure (IM)
          {"\n"}P.IVA / C.F. 01716090087 — CCIAA di IM — REA 220844
          {"\n"}Capitale sociale € 10.000,00 i.v.
          {"\n"}Telefono: 0183 754557
          {"\n"}Email: [DA COMPLETARE — indirizzo email dedicato alle richieste privacy]
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Responsabile della Protezione dei Dati (DPO)">
        <LegalParagraph>
          [DA COMPLETARE — inserire i contatti del DPO, se nominato. Per le
          attività di ristorazione la nomina non è di norma obbligatoria; il
          Titolare valuti la propria situazione.]
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Tipologie di dati trattati tramite il sito">
        <LegalParagraph>
          Il sito, così com'è progettato, non raccoglie dati personali degli
          utenti. Non sono presenti form di contatto, form di prenotazione,
          registrazione utenti né sistemi di analytics.
        </LegalParagraph>
        <LegalParagraph>
          Vengono utilizzati soltanto strumenti tecnici locali (localStorage),
          descritti in dettaglio nella Cookie Policy, che non trasmettono dati a
          server esterni.
        </LegalParagraph>
        <Pressable
          onPress={() => router.push("/cookie-policy")}
          testID="privacy-cookie-link"
        >
          <Text style={styles.link}>Vai alla Cookie Policy →</Text>
        </Pressable>
      </LegalSection>

      <LegalSection title="4. Dati raccolti tramite canali diversi dal sito">
        <LegalParagraph>
          Se l'utente contatta il ristorante telefonicamente (ad es. per una
          prenotazione), i dati eventualmente comunicati sono trattati al di
          fuori del sito, secondo le indicazioni di seguito:
        </LegalParagraph>
        <LegalBullets
          items={[
            "Finalità: gestione della prenotazione e del rapporto con il cliente.",
            "Base giuridica: esecuzione di misure precontrattuali richieste dall'interessato (art. 6.1.b GDPR).",
            "Categorie di dati: nome, numero di telefono, eventuali esigenze alimentari comunicate dal cliente.",
            "Conservazione: [DA COMPLETARE — indicare il periodo di conservazione, es. fino alla conclusione del servizio o secondo obblighi contabili].",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Base giuridica dei trattamenti tramite sito">
        <LegalParagraph>
          Poiché il sito utilizza esclusivamente strumenti tecnici strettamente
          necessari, il trattamento si fonda sulla necessità di erogare il
          servizio richiesto dall'utente (art. 122 D.lgs. 196/2003) senza
          richiedere consenso preventivo.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Destinatari dei dati">
        <LegalParagraph>
          Il sito non trasmette dati a terze parti. I dati raccolti tramite
          canali diversi (telefono, in loco) possono essere comunicati a:
        </LegalParagraph>
        <LegalBullets
          items={[
            "Fornitori tecnici (hosting del sito, servizi telefonici), nominati Responsabili del trattamento ex art. 28 GDPR.",
            "Autorità pubbliche, ove richiesto dalla legge.",
            "[DA COMPLETARE — eventuali altri destinatari specifici individuati dal Titolare].",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Trasferimento dati extra-UE">
        <LegalParagraph>
          Il sito è servito tramite l'infrastruttura di hosting di Emergent, che
          può utilizzare provider situati anche al di fuori dell'Unione Europea.
          In tal caso, i trasferimenti avvengono sulla base di clausole
          contrattuali standard adottate dalla Commissione Europea o altre
          garanzie previste dagli artt. 44 e ss. del GDPR.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Diritti dell'interessato">
        <LegalParagraph>
          Ai sensi degli artt. 15-22 del GDPR, ciascun interessato può
          esercitare i seguenti diritti:
        </LegalParagraph>
        <LegalBullets
          items={[
            "Accesso ai propri dati personali.",
            "Rettifica o cancellazione.",
            "Limitazione del trattamento.",
            "Portabilità dei dati.",
            "Opposizione al trattamento.",
            "Revoca del consenso, ove applicabile.",
            "Proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).",
          ]}
        />
        <LegalParagraph>
          Le richieste possono essere inviate ai recapiti del Titolare indicati
          al punto 1.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. Modifiche">
        <LegalParagraph>
          La presente Informativa può essere aggiornata. Le modifiche saranno
          pubblicate su questa pagina, con indicazione della nuova data di
          aggiornamento.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
}

const useStyles = makeStyles((colors) => ({
  link: {
    marginTop: spacing.sm,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.brandPrimary,
    letterSpacing: 0.3,
  },
}));
