/**
 * Adds seoContent and seoFaqs template keys to messages/en.json
 * Run: node scripts/add-seo-content.mjs
 */
import fs from 'fs'

const j = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'))
const dc = j.documentChecklist

dc.seoContent = {
  ausbildung: {
    p1: "Germany's Ausbildung (dual vocational training) system is one of the most sought-after immigration pathways for {country} nationals. The national D-visa for vocational training, governed by §17a of the German Residence Act (AufenthG), entitles you to complete a 2–3-year accredited training programme at a German company while earning a salary. Unlike Studium, Ausbildung requires no university degree — a secondary school diploma (Baccalauréat or equivalent) and a signed training contract are the core requirements.",
    p2: "Document authentication is a decisive factor in how quickly applicants from {country} can submit their visa file. Germany requires authentication by {authMethod} for all official documents issued in {country}, including your birth certificate, diplomas, school transcripts, and police clearance. The {authMethod} step costs €{authFeeMin}–{authFeeMax} per document and adds {authDaysMin}–{authDaysMax} days to your preparation. Sworn German translations are also mandatory for all non-German documents — plan for an additional €20–60 per page from a certified translator.",
    p3: "The visa process itself begins with a German B1 language certificate (Goethe, telc or ÖSD), since this is the minimum required for most Ausbildung visas. Your future employer in Germany files a Vorab-Zustimmung (preliminary approval) with the Bundesagentur für Arbeit — if granted, visa processing shrinks from around 8 months to roughly 2 months. Financial proof is also required: depending on your training salary, you may need a Sperrkonto (blocked account) holding €11,904 for the year, or an alternative guarantee (Verpflichtungserklärung) from a German-resident sponsor.",
    p4: "From {country}, the realistic end-to-end timeline — from gathering documents to your first day at work in Germany — is {timelineMin}–{timelineMax} weeks. Visa appointment slots at the German mission or TLScontact/VFS centre in {country} tend to fill up months in advance. Submit your complete dossier at the appointment: incomplete files are not accepted and no refunds are given. The national D-visa fee is €{visaFee}, payable on the day."
  },
  studium: {
    p1: "Germany is one of the top destinations in the world for international students — and for {country} nationals, a German Studium (university study) visa opens the door to tuition-free or low-fee education at world-ranked institutions. The national D-visa for higher education is governed by §16b AufenthG and allows you to enrol in a full Bachelor's, Master's, or PhD programme.",
    p2: "All academic documents from {country} must be authenticated by {authMethod} before they can be submitted to the German mission. This applies to your Baccalauréat diploma, transcripts, higher-education diplomas, and any other officially issued certificates. The {authMethod} step takes {authDaysMin}–{authDaysMax} days and costs €{authFeeMin}–{authFeeMax} per document — and each document will also need a sworn German translation (€20–60 per page). The total authentication and translation budget for an average Studium file from {country} typically runs €300–800.",
    p3: "The Studienkolleg is a preparatory year required if your secondary school diploma does not directly qualify you for German university admission. Use the Anabin database (anabin.kmk.org) to check your qualification's status before applying. Applicants are also required to open a Sperrkonto (blocked account) holding €11,904 as proof of financial means — online providers such as Fintiba, Expatrio or Coracle open one within a few days. A German B2 language certificate (Goethe, telc, ÖSD, or TestDaF) is mandatory for German-taught programmes; English-taught programmes accept IELTS/TOEFL instead.",
    p4: "The total document count for a Studium visa from {country} is {totalDocs} items, and the estimated total cost (documents, authentication, translations, Sperrkonto setup, and visa fee) is €{totalCostMin}–{totalCostMax}. The realistic preparation timeline is {timelineMin}–{timelineMax} weeks. Start at least 6 months before your intended study start — German universities send admissions letters late, and apostille or legalization queues in {country} can run several weeks."
  },
  tourist: {
    p1: "Citizens of {country} need a Schengen C visa (also called a short-stay or tourist visa) to visit Germany and the broader Schengen Area. The Schengen C visa allows up to 90 days of stay in any 180-day rolling period and covers tourism, family visits, short business trips, and cultural events. The application is submitted at the German embassy, consulate, or an authorised visa centre (VFS Global or TLScontact) in {country}.",
    p2: "The Schengen tourist visa fee is €{visaFee} as of 2024 (raised from €80 in June 2024 under the revised EU Visa Code). Children under 6 are exempt; children aged 6–12 pay €45. The fee is non-refundable even if the visa is refused. You will also pay any visa-centre service charges on top of the consular fee. In {country}, total application costs including insurance and document preparation typically range from €150 to €350.",
    p3: "The strongest factor in a Schengen visa approval is demonstrating strong ties to your home country — proof that you intend to return. An employment letter granting you approved leave, a property deed, a business registration, or a student enrolment certificate all serve this purpose. Financial proof must show you can cover approximately €45–100 per day of your stay. Travel health insurance with a minimum coverage of €30,000 and valid for all Schengen countries is mandatory.",
    p4: "Appointment wait times at the German mission or visa centre in {country} vary by season: expect {authDaysMin}–{authDaysMax} business days in off-peak periods and up to 8 weeks in summer. Processing after submission takes a maximum of 15 calendar days for straightforward applications (up to 30 days for complex cases, 45 days in exceptional circumstances). Multiple-entry visas valid for 1–5 years can be issued to frequent travellers with a clean travel history."
  },
  family_reunification: {
    p1: "Family reunification to Germany — bringing a spouse, minor children, or dependent parents to join a German resident — is regulated by §§27–36 of the AufenthG. Citizens of {country} applying to join a family member in Germany must obtain a national D-visa before arriving. The most common case is spousal reunion (Ehegattennachzug), which gives the spouse the right to work in Germany immediately upon arrival.",
    p2: "The most distinctive requirement for spouses applying from {country} is the German A1 language certificate. Before a spousal reunion visa is issued, the applicant must demonstrate basic German-language proficiency at CEFR level A1 (Goethe-Zertifikat A1, telc Deutsch A1 or ÖSD Zertifikat A1). Exceptions exist if the sponsor holds a German Hochschulabschluss or has C1-level German, if the applicant is over 67, or if there is a proven hardship case. Document authentication from {country} uses {authMethod} and costs €{authFeeMin}–{authFeeMax} per document, adding {authDaysMin}–{authDaysMax} days.",
    p3: "The sponsor (the person already in Germany) plays a central role: they must prove that their income is sufficient to support the reunited family without recourse to public funds. The required income threshold varies by Bundesland and household size but typically equals the Grundsicherung minimum plus 20%. The sponsor must also prove adequate housing — a minimum of 12 m² of living space per additional person is the benchmark used by most Ausländerbehörden. These documents (income proof, housing confirmation) must be sent to you in {country} before your visa appointment.",
    p4: "From {country}, the full process — gathering documents, authentication ({authMethod}), A1 certificate, and the visa appointment — takes {timelineMin}–{timelineMax} weeks. The national D-visa fee is €{visaFee}. Once in Germany, the sponsored family member must register at the local Einwohnermeldeamt within two weeks and apply for a residence permit (Aufenthaltstitel) at the Ausländerbehörde. Spouses have the right to take up any employment immediately; children of school age are integrated into the public school system without additional permit requirements."
  },
  noVisaEu: "As a citizen of {country}, you benefit from the European Union's freedom of movement — one of the most significant rights in the EU legal order. You can live, work, study, or retire in Germany for any length of time without obtaining a visa, residence permit, or work permit. The only administrative step required is registering your address at the local Einwohnermeldeamt (Anmeldung) within two weeks of arrival, and enrolling in health insurance if you are employed.",
  touristFree: "Citizens of {country} are exempt from the Schengen C tourist visa under a bilateral visa-free agreement or EU/EEA freedom of movement. You may enter Germany and the Schengen Area for stays of up to 90 days in any 180-day period without any visa. For stays longer than 90 days — for Ausbildung, Studium, or family reunification — a national D-visa is required. The D-visa application is submitted at the German embassy or honorary consulate responsible for your residence in {country}."
}

dc.seoFaqs = {
  ausbildung: [
    {
      q: "How many documents do I need for the German Ausbildung visa from {country}?",
      a: "A standard Ausbildung visa application from {country} requires {totalDocs} documents. The most critical are the signed Ausbildungsvertrag (training contract) from your German employer, a German B1/B2 language certificate, authenticated school diplomas and transcripts, and proof of financial means. Every document in a language other than German must be accompanied by a sworn German translation."
    },
    {
      q: "How long does it take to get a German Ausbildung visa from {country}?",
      a: "The realistic end-to-end timeline from {country} is {timelineMin}–{timelineMax} weeks. The bottleneck is usually document authentication ({authMethod}: {authDaysMin}–{authDaysMax} days), followed by the visa appointment waiting time (often 4–12 weeks), and consulate processing (8–12 weeks without Vorab-Zustimmung, ~8 weeks with it). Start preparing at least 6 months before your training start date."
    },
    {
      q: "Does {country} require apostille or consular legalization for a German visa?",
      a: "For German visa applications, {country} documents must undergo {authMethod}. {authMethodDetail} The cost is €{authFeeMin}–{authFeeMax} per document and the process takes {authDaysMin}–{authDaysMax} days. Plan this step first as it is the hardest to accelerate."
    },
    {
      q: "What is the German Ausbildung visa fee?",
      a: "The national D-visa fee for Ausbildung is €{visaFee}, paid in cash or by card at your appointment. The fee is non-refundable if the visa is refused. Some German visa centres (TLScontact, VFS) charge an additional service fee of €20–40."
    },
    {
      q: "Do I need to speak German before applying for an Ausbildung visa from {country}?",
      a: "Yes. Most Ausbildung visas require a minimum German B1 certificate (Goethe-Institut, telc or ÖSD). Many employers and some training sectors (healthcare, trades) require B2. Start your German classes early — the B1 exam takes 3–6 months of study from zero, and B2 takes a further 3–4 months. The certificate must not be older than 2 years at the time of your visa appointment."
    },
    {
      q: "Do I need a Sperrkonto for the Ausbildung visa from {country}?",
      a: "It depends on your training salary. If your gross monthly salary is below approximately €934, you will likely need a Sperrkonto (blocked account) holding €11,904. Trainees with higher salaries or those whose German employer provides a Verpflichtungserklärung (financial guarantee) may be exempt. Confirm with the German mission in {country} as requirements vary."
    }
  ],
  studium: [
    {
      q: "How many documents are required for a German Studium visa from {country}?",
      a: "A Studium visa application from {country} typically requires {totalDocs} documents, including: university admission letter (Zulassung), German B2 or TestDaF language certificate, Baccalauréat diploma and transcripts (authenticated and translated), higher-education diplomas (if applicable), proof of financial means (Sperrkonto at €11,904 or equivalent), and travel health insurance."
    },
    {
      q: "How long does it take to get a Studium visa from {country}?",
      a: "From {country}, the realistic timeline is {timelineMin}–{timelineMax} weeks. The document authentication stage ({authMethod}: {authDaysMin}–{authDaysMax} days) and the university admission process (which can take 3–6 months via uni-assist or directly) are the longest steps. Apply to German universities a full year before your intended start date."
    },
    {
      q: "What is the Sperrkonto and is it mandatory for students from {country}?",
      a: "The Sperrkonto is a blocked bank account holding €11,904 (as of 2026), which proves you can cover your living costs for the first year in Germany. The funds are released to you in monthly instalments of €992 after you arrive. It is mandatory for most Studium visa applicants from {country} unless you have an equivalent scholarship or a strong Verpflichtungserklärung. Set one up through Fintiba, Expatrio, or Coracle — they can open the account within a few business days."
    },
    {
      q: "Do I need an APS certificate from {country} for a German Studium visa?",
      a: "APS (Akademische Prüfstelle) certificates are required for applicants from China, India, Vietnam, Mongolia, and Pakistan. For {country}, {apsDetail}. If required, apply for the APS early as processing takes 6–20 weeks and the certificate is mandatory before the German mission will process your visa."
    },
    {
      q: "What does document authentication cost for students from {country}?",
      a: "For applicants from {country}, authentication uses {authMethod} and costs €{authFeeMin}–{authFeeMax} per document, taking {authDaysMin}–{authDaysMax} days. For a standard Studium file you will authenticate roughly 4–6 documents (diplomas, transcripts, birth certificate, police clearance). Add sworn translations at €20–60 per page. Total authentication and translation budget: typically €300–800 from {country}."
    },
    {
      q: "Can I work in Germany while studying on a Studium visa?",
      a: "Yes. Students on a German Studium visa may work up to 120 full days or 240 half-days per year without needing a separate work permit. Hours above this limit require approval from the Ausländerbehörde and Bundesagentur für Arbeit. Student jobs (Werkstudent, Hiwi, or mini-job) are a common way to supplement living costs."
    }
  ],
  tourist: [
    {
      q: "Do {country} citizens need a visa to visit Germany?",
      a: "Yes, citizens of {country} need a Schengen C (tourist/short-stay) visa to enter Germany and all Schengen countries. The visa permits up to 90 days of stay in any 180-day period. The application is submitted at the German embassy, consulate, or an authorised visa centre (VFS Global, TLScontact) serving {country}."
    },
    {
      q: "What documents do I need for a German tourist visa from {country}?",
      a: "A German Schengen tourist visa from {country} requires {totalDocs} documents: completed Schengen application form, valid passport (3+ months beyond trip), biometric photos (2×), travel health insurance (€30,000+ coverage), round-trip flight reservation, accommodation proof (hotel or invitation letter), bank statements showing sufficient funds (€45–100/day), and proof of ties to {country} such as an employment letter or property deed."
    },
    {
      q: "What is the German tourist visa fee for {country} citizens?",
      a: "The standard Schengen C visa fee is €{visaFee} (revised June 2024). Children under 6 are free; children 6–12 pay €45. The fee is non-refundable. Additional visa-centre service fees (VFS/TLScontact) of €20–40 may apply. Total payment is made at the appointment — check with your local visa centre for accepted payment methods."
    },
    {
      q: "How long does it take to get a German tourist visa from {country}?",
      a: "Standard processing is 15 calendar days from the date of application. It can extend to 30 days and exceptionally up to 45 days. Factor in the appointment wait at the visa centre: {authDaysMin}–{authDaysMax} days in normal periods, up to 8 weeks during summer peak season. Book your appointment as early as possible — at least 3 months before your planned travel date."
    },
    {
      q: "How much money do I need to show for a German tourist visa from {country}?",
      a: "Germany requires proof of approximately €45–100 per day of your stay in the Schengen area. For a 14-day trip, that is roughly €630–1,400. Bank statements from the last 3 months are the standard evidence. If a family member or German host is sponsoring you, a Verpflichtungserklärung (financial guarantee, issued at a German Ausländerbehörde) can substitute for your own funds."
    },
    {
      q: "Can a Schengen tourist visa be extended or converted to a longer visa in Germany?",
      a: "A Schengen C tourist visa cannot normally be extended beyond 90 days and cannot be converted into a national D-visa inside Germany. If you wish to stay longer — for Ausbildung, Studium, or family reasons — you must return to {country} and apply for the appropriate national D-visa through the German mission before re-entering Germany."
    }
  ],
  family_reunification: [
    {
      q: "What documents do I need for a German family reunification visa from {country}?",
      a: "A family reunification visa from {country} requires {totalDocs} documents across two sides: your documents (passport, birth certificate, marriage certificate, police clearance, German A1 certificate if joining a spouse, plus authenticated translations), and your sponsor's documents from Germany (copy of their Aufenthaltstitel, last 3 salary slips, tax assessment, and housing confirmation showing ≥12 m² per additional person)."
    },
    {
      q: "Is the German A1 language certificate mandatory for family reunification from {country}?",
      a: "Yes, for spousal reunification (Ehegattennachzug) from {country}, you must present a German A1 language certificate (Goethe-Zertifikat A1, telc Deutsch A1 or ÖSD Zertifikat A1) at your visa appointment. Exceptions: your sponsor holds a German Hochschulabschluss or has documented C1+ German, you are over 67, you have a recognised disability that prevents language learning, or a compelling hardship case exists. Children under 16 joining parents are exempt."
    },
    {
      q: "How long does family reunification from {country} take?",
      a: "The full process — document collection, authentication ({authMethod}: {authDaysMin}–{authDaysMax} days), A1 certificate exam, and visa appointment — takes {timelineMin}–{timelineMax} weeks from {country}. The German mission is required to decide on a complete application within 3 months. Incomplete files are returned without a decision, restarting the clock."
    },
    {
      q: "How much income does the sponsor in Germany need for family reunification?",
      a: "The sponsor must earn enough to support the family without public assistance. The threshold varies by Bundesland and family size: roughly €1,600–2,200 net per month for a couple, plus €300–400 per additional child. The sponsor submits the last 3 salary slips and a tax assessment (Steuerbescheid) to the German mission on your behalf. Self-employed sponsors can use profit-and-loss statements."
    },
    {
      q: "Can the spouse work in Germany after family reunification?",
      a: "Yes. A spouse joining a German resident or EU/EEA national receives an Aufenthaltstitel (residence permit) that includes full, unrestricted work authorisation — no employer sponsorship needed. They may take up any employed or self-employed work immediately upon receiving their permit. Children of school age are automatically integrated into the public school system."
    },
    {
      q: "What authentication method does {country} use for family reunification documents?",
      a: "Documents from {country} must be authenticated via {authMethod} for German visa purposes. {authMethodDetail} Authentication costs €{authFeeMin}–{authFeeMax} per document and takes {authDaysMin}–{authDaysMax} days. Every authenticated document must also be accompanied by a sworn German translation (€20–60 per page). Start the authentication process as early as possible — it is the step most applicants underestimate."
    }
  ]
}

// Add SEO page section labels
dc.seoArticleTitle = "About the {path} visa for {country} nationals"
dc.seoFaqTitle = "Frequently asked questions"
dc.authMethodDetail = {
  apostille: "{country} is a member of the Hague Convention and Germany accepts its apostilles. Your documents are authenticated with an apostille stamp from the relevant national authority.",
  legalization: "Despite being a Hague Convention member, Germany has formally objected to {country}'s accession. Full consular legalization via the German embassy or a chain of national authorities is therefore required — not an apostille."
}
dc.apsDetail = {
  required: "an APS (Akademische Prüfstelle) certificate IS required. You must have your academic documents verified by the APS office before submitting your visa application.",
  notRequired: "an APS certificate is NOT required. You can submit your authenticated academic documents directly in your visa file."
}

fs.writeFileSync('messages/en.json', JSON.stringify(j, null, 2), 'utf8')
console.log('Done — added seoContent, seoFaqs, seoArticleTitle, seoFaqTitle, authMethodDetail, apsDetail to en.json')
