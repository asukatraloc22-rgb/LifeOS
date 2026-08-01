import type { ProgramDay, InjuryTypeInfo } from '../types';

// Ported verbatim from the original "Le Meneur Complet" tracker so history
// stays comparable week over week.
export const PROGRAM: Record<string, ProgramDay> = {
  lundi: {
    key: 'lundi', label: 'Lundi', title: 'Technique Tir + Push + Abdos + Saut #1',
    type: 'strength', jump: true, shooting: true,
    exercises: [
      { id: 'lu1', name: 'Pompes déclinées', sub: '4 x 12-15 RIR2' },
      { id: 'lu2', name: 'Écartés couchés', sub: '3 x 15' },
      { id: 'lu3', name: 'Développé militaire haltères', sub: '4 x 12' },
      { id: 'lu4', name: 'Élévations latérales', sub: '3 x 15-20' },
      { id: 'lu5', name: 'Extensions triceps', sub: '3 x 15' },
      { id: 'lu6', name: 'Abdos (relevés jambes / crunchs)', sub: '3 x 15-20' },
    ],
  },
  mardi: {
    key: 'mardi', label: 'Mardi', title: 'Technique Dribble + Pull + Isométrie #1',
    type: 'strength', iso: true, technique: 'Dribble & Finition',
    exercises: [
      { id: 'ma1', name: 'Rowing bûcheron', sub: '4 x 12-15 / bras' },
      { id: 'ma2', name: 'Pull-over haltère', sub: '3 x 15' },
      { id: 'ma3', name: 'Curl biceps + marteau', sub: '3 x 12-15' },
      { id: 'ma4', name: 'Gainage anti-rotation (abdos)', sub: '3 x 12 / côté' },
      { id: 'ma5', name: 'Wall sit', sub: '3 x 30-45 sec' },
      { id: 'ma6', name: 'Isometric squat hold', sub: '3 x 20-30 sec' },
    ],
  },
  mercredi: {
    key: 'mercredi', label: 'Mercredi', title: 'Basket + Isométrie #2',
    type: 'basket', iso: true,
    exercises: [
      { id: 'me1', name: 'Planche classique', sub: '3 x 40-60 sec' },
      { id: 'me2', name: 'Isometric calf raise hold', sub: '3 x 20 sec (si aucune douleur cheville)' },
    ],
  },
  jeudi: {
    key: 'jeudi', label: 'Jeudi', title: 'Saut #2 (AM) + Jambes (PM)',
    type: 'legday', jump: true,
    exercises: [
      { id: 'je1', name: 'Squats gobelet', sub: '4 x 12-15 RIR2' },
      { id: 'je2', name: 'Fentes bulgares', sub: '3 x 10-12 / jambe' },
      { id: 'je3', name: 'Soulevé de terre roumain', sub: '3 x 12' },
      { id: 'je4', name: 'Équilibre unijambe', sub: '3 x 30 sec / jambe' },
      { id: 'je5', name: 'Mollets sur marche', sub: '3 x 15-20' },
    ],
  },
  vendredi: {
    key: 'vendredi', label: 'Vendredi', title: 'Technique Tir/Passe/Défense + Bras + Isométrie #3',
    type: 'strength', iso: true, shooting: true, technique: 'Tir en mouvement, Passe & Défense',
    exercises: [
      { id: 've1', name: 'Curl marteau', sub: '3 x 15' },
      { id: 've2', name: 'Extensions triceps', sub: '3 x 15' },
      { id: 've3', name: 'Élévations frontales + latérales', sub: '3 x 12 chacune' },
      { id: 've4', name: 'Abdos : Russian twists légers', sub: '3 x 20 touches' },
      { id: 've5', name: 'Isometric push hold', sub: '3 x 20 sec' },
      { id: 've6', name: 'Planche latérale', sub: '3 x 30 sec / côté' },
    ],
  },
  samedi: { key: 'samedi', label: 'Samedi', title: 'Basket équipe / Match', type: 'basket', exercises: [] },
  dimanche: { key: 'dimanche', label: 'Dimanche', title: 'Basket équipe / Match + Récup', type: 'basket', exercises: [] },
};

export const DAY_ORDER = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export const INJURY_TYPES: InjuryTypeInfo[] = [
  { id: 'cheville', name: 'Entorse de cheville', short: 'Douleur/gonflement après torsion',
    signs: "Douleur sur le côté de la cheville, gonflement rapide, parfois hématome, douleur à l'appui.",
    care: "Repos relatif (éviter l'appui douloureux), glace 15-20 min plusieurs fois/jour les premières 48h, compression légère, élévation.",
    avoid: "Ne pas forcer l'amplitude tant qu'il y a une douleur nette. Éviter tout saut avant réévaluation." },
  { id: 'genou-rotulien', name: 'Tendinite rotulienne (genou du sauteur)', short: "Douleur sous la rotule à l'effort",
    signs: 'Douleur localisée juste sous la rotule, surtout après ou pendant les sauts/réceptions.',
    care: 'Réduire temporairement le volume de sauts et de squats profonds, glace après effort, renforcement progressif guidé par un pro.',
    avoid: 'Continuer à travers une douleur qui augmente aggrave généralement la tendinopathie.' },
  { id: 'genou-anterieur', name: 'Douleur antérieure du genou', short: 'Douleur diffuse autour de la rotule',
    signs: 'Douleur diffuse à l’avant du genou, accentuée en descente d’escalier ou squat profond.',
    care: 'Souvent lié à un déséquilibre renforcement/mobilité — un bilan kiné du sport aide à cibler la cause.',
    avoid: 'Ne pas ignorer une douleur qui revient à chaque séance de jambes.' },
  { id: 'epaule', name: 'Épaule (coiffe des rotateurs)', short: 'Douleur au tir ou en armé du bras',
    signs: 'Douleur en levant le bras au-dessus de la tête, en tirant ou dribblant fort.',
    care: 'Réduire le volume de développé/élévations, glace si douleur aiguë, renforcement doux si toléré.',
    avoid: "Continuer les séries proches de l'échec sur les mouvements d'épaule en épisode douloureux." },
  { id: 'doigt', name: 'Doigt de basket', short: 'Doigt qui gonfle après un ballon mal reçu',
    signs: "Douleur, gonflement, parfois incapacité à tendre complètement la dernière phalange.",
    care: 'Glace, attelle de protection si disponible, éviter de forcer l’extension.',
    avoid: 'Un doigt qui reste déformé après quelques jours doit être vu par un médecin.' },
  { id: 'lombaires', name: 'Lombalgie', short: 'Douleur bas du dos après charge ou pivot',
    signs: 'Douleur diffuse ou localisée dans le bas du dos, parfois raideur matinale.',
    care: 'Repos relatif (pas alitement complet), rester actif avec des mouvements doux et indolores.',
    avoid: 'Reprendre le soulevé de terre ou les squats lourds avant disparition complète de la douleur.' },
];
