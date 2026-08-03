// Base de Données des Médicaments Courants en Tunisie (Nomenclature Pharmacie & CNAM)

export const TUNISIAN_PHARMA_CATALOG = [
  { name: 'Amlor 5mg (Gélules)', defaultDosage: '1 gélule le matin', duration: '3 mois', substitutable: false, cnamAP1: true },
  { name: 'Amlor 10mg (Gélules)', defaultDosage: '1 gélule le matin', duration: '3 mois', substitutable: false, cnamAP1: true },
  { name: 'Concor 5mg (Comprimés)', defaultDosage: '1 comprimé au petit déjeuner', duration: '3 mois', substitutable: false, cnamAP1: true },
  { name: 'Concor 10mg (Comprimés)', defaultDosage: '1 comprimé le matin', duration: '3 mois', substitutable: false, cnamAP1: true },
  { name: 'Tahor 10mg (Comprimés)', defaultDosage: '1 comprimé au coucher', duration: '3 mois', substitutable: true, cnamAP1: true },
  { name: 'Tahor 20mg (Comprimés)', defaultDosage: '1 comprimé au coucher', duration: '3 mois', substitutable: true, cnamAP1: true },
  { name: 'Plavix 75mg (Comprimés Pelliculés)', defaultDosage: '1 comprimé par jour', duration: '3 mois', substitutable: false, cnamAP1: true },
  { name: 'Aspegic 100mg (Sachet)', defaultDosage: '1 sachet à midi', duration: '3 mois', substitutable: true, cnamAP1: true },
  { name: 'Triatec 5mg (Comprimés)', defaultDosage: '1 comprimé le matin', duration: '3 mois', substitutable: true, cnamAP1: true },
  { name: 'Sintrom 4mg (Comprimés sécables)', defaultDosage: 'Selon INR (1/2 ou 1/4 j)', duration: '1 mois', substitutable: false, cnamAP1: true },
  { name: 'Augmentin 1g (Sachet / Comprimé)', defaultDosage: '1g matin et soir', duration: '7 jours', substitutable: true, cnamAP1: false },
  { name: 'Doliprane 1000mg (Comprimé Effervescent)', defaultDosage: '1 comprimé toutes les 8h si besoin', duration: '5 jours', substitutable: true, cnamAP1: false },
  { name: 'Glucophage 850mg (Comprimé)', defaultDosage: '1 comprimé après les repas', duration: '3 mois', substitutable: true, cnamAP1: true },
  { name: 'Avlocardyl 40mg (Comprimé)', defaultDosage: '1/2 comprimé 2 fois par jour', duration: '1 mois', substitutable: true, cnamAP1: false },
  { name: 'Xarelto 20mg (Comprimé Pelliculé)', defaultDosage: '1 comprimé au cours du repas', duration: '3 mois', substitutable: false, cnamAP1: true }
];

export function searchTunisianDrugs(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return TUNISIAN_PHARMA_CATALOG.filter(d => d.name.toLowerCase().includes(q));
}
