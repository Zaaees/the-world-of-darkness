/**
 * Disciplines de Vampire: The Masquerade V20
 *
 * Chaque discipline a 5 niveaux de pouvoir.
 * L'accès dépend du clan (disciplines de clan) et du niveau de Puissance du Sang.
 *
 * Accès par Puissance du Sang:
 * - BP 1: Niveaux 1-2
 * - BP 2: Niveaux 1-3
 * - BP 3: Niveaux 1-4
 * - BP 4-5: Niveaux 1-5
 */

export const DISCIPLINES = {
  animalism: {
    id: "animalism",
    name: "Animalisme",
    description: "Communion avec la Bête intérieure et les animaux",
    powers: [
      {
        level: 1,
        name: "Murmures Fauves",
        description: "Communiquer avec les animaux par le regard et les sons. L'animal comprend les intentions du vampire et peut répondre de manière limitée."
      },
      {
        level: 2,
        name: "L'Appel",
        description: "Convoquer les animaux d'une espèce choisie dans les environs. Les créatures arrivent aussi vite que possible et sont bien disposées."
      },
      {
        level: 3,
        name: "Dompter la Bête",
        description: "Apaiser la Bête d'un vampire en frénésie ou provoquer le Rötschreck chez un autre vampire par un regard intense."
      },
      {
        level: 4,
        name: "Communion Spirituelle",
        description: "Projeter son esprit dans un animal, prenant le contrôle total de son corps pendant que le sien reste en torpeur."
      },
      {
        level: 5,
        name: "Libérer la Bête",
        description: "Projeter sa propre Bête dans une victime, lui infligeant une frénésie tandis que le vampire devient temporairement incapable d'émotion."
      }
    ]
  },

  auspex: {
    id: "auspex",
    name: "Auspex",
    description: "Sens surnaturels et perception extrasensorielle",
    powers: [
      {
        level: 1,
        name: "Sens Accrus",
        description: "Amplifier considérablement un sens choisi, permettant de voir dans l'obscurité quasi-totale ou d'entendre une conversation à grande distance."
      },
      {
        level: 2,
        name: "Perception de l'Aura",
        description: "Percevoir les auras psychiques, révélant l'état émotionnel, la nature surnaturelle et les intentions d'une personne."
      },
      {
        level: 3,
        name: "Toucher de l'Esprit",
        description: "Lire les impressions psychiques laissées sur les objets, voyant des flashs du passé liés à l'objet touché."
      },
      {
        level: 4,
        name: "Télépathie",
        description: "Lire les pensées de surface d'une cible ou projeter ses propres pensées dans l'esprit d'autrui."
      },
      {
        level: 5,
        name: "Projection Psychique",
        description: "Séparer son esprit de son corps, voyageant sous forme astrale à travers le monde physique et le monde des esprits."
      }
    ]
  },

  celerity: {
    id: "celerity",
    name: "Célérité",
    description: "Vitesse et réflexes surnaturels",
    powers: [
      {
        level: 1,
        name: "Grâce Féline",
        description: "Se mouvoir avec une fluidité inhumaine. +1 dé pour les actions d'esquive et d'initiative."
      },
      {
        level: 2,
        name: "Rapidité",
        description: "Effectuer des mouvements à une vitesse imperceptible. Possibilité d'une action supplémentaire par tour."
      },
      {
        level: 3,
        name: "Fulgurance",
        description: "Atteindre une vitesse de déplacement extraordinaire, semblant se téléporter sur de courtes distances."
      },
      {
        level: 4,
        name: "Lenteur du Monde",
        description: "Le temps semble ralentir autour du vampire. Multiples actions par tour sans pénalité."
      },
      {
        level: 5,
        name: "Projection Éclair",
        description: "Se déplacer si vite qu'on devient invisible à l'œil nu, traversant de grandes distances en un instant."
      }
    ]
  },

  dominate: {
    id: "dominate",
    name: "Domination",
    description: "Contrôle mental et manipulation de la volonté",
    powers: [
      {
        level: 1,
        name: "Commandement",
        description: "Donner un ordre d'un mot qui doit être obéi immédiatement. Nécessite un contact visuel."
      },
      {
        level: 2,
        name: "Mésmerisme",
        description: "Implanter des suggestions post-hypnotiques complexes qui se déclenchent selon des conditions précises."
      },
      {
        level: 3,
        name: "Oubli",
        description: "Effacer ou modifier les souvenirs de la victime, de quelques minutes à des années entières."
      },
      {
        level: 4,
        name: "Conditionnement",
        description: "Sessions répétées de Domination qui brisent totalement la volonté de la victime, en faisant un esclave dévoué."
      },
      {
        level: 5,
        name: "Possession",
        description: "Projeter son esprit dans le corps d'un mortel, prenant le contrôle total tandis que son propre corps reste en torpeur."
      }
    ]
  },

  fortitude: {
    id: "fortitude",
    name: "Force d'Âme",
    description: "Résistance surnaturelle aux dégâts",
    powers: [
      {
        level: 1,
        name: "Résilience",
        description: "Résistance accrue aux dégâts contondants et capacité à ignorer les blessures légères."
      },
      {
        level: 2,
        name: "Endurance",
        description: "Absorber les dégâts létaux comme des dégâts contondants. Résistance au feu et au soleil légèrement accrue."
      },
      {
        level: 3,
        name: "Résistance",
        description: "Résister partiellement même aux dégâts aggravés. Capacité à rester conscient malgré des blessures graves."
      },
      {
        level: 4,
        name: "Inébranlable",
        description: "Ignorer les effets de la douleur et les pénalités de blessures. Résistance significative au feu et au soleil."
      },
      {
        level: 5,
        name: "Invulnérabilité",
        description: "Résistance presque totale aux dégâts physiques normaux. Même les flammes et le soleil causent des dégâts réduits."
      }
    ]
  },

  obfuscate: {
    id: "obfuscate",
    name: "Occultation",
    description: "Invisibilité et dissimulation surnaturelle",
    powers: [
      {
        level: 1,
        name: "Cape d'Ombre",
        description: "Devenir impossible à remarquer tant qu'on reste immobile dans l'ombre. On n'est pas invisible, juste ignoré."
      },
      {
        level: 2,
        name: "Présence Invisible",
        description: "Se mouvoir tout en restant non remarqué. Les gens détournent inconsciemment le regard."
      },
      {
        level: 3,
        name: "Masque aux Mille Visages",
        description: "Changer son apparence perçue, prenant les traits de n'importe qui. Ne change pas la réalité physique."
      },
      {
        level: 4,
        name: "Disparition",
        description: "Devenir invisible même aux sens surnaturels. Disparaître instantanément de la vue de tous."
      },
      {
        level: 5,
        name: "Voile Collectif",
        description: "Étendre l'invisibilité à un groupe entier ou dissimuler des objets de grande taille comme des véhicules."
      }
    ]
  },

  potence: {
    id: "potence",
    name: "Puissance",
    description: "Force physique surnaturelle",
    powers: [
      {
        level: 1,
        name: "Vigueur",
        description: "Force accrue permettant de soulever le double du poids normal et d'infliger des dégâts supplémentaires."
      },
      {
        level: 2,
        name: "Prouesse",
        description: "Accomplir des exploits de force impressionnants. Briser des portes, tordre le métal."
      },
      {
        level: 3,
        name: "Brutalité",
        description: "Force suffisante pour projeter un homme à travers une pièce ou détruire un mur de briques."
      },
      {
        level: 4,
        name: "Fureur",
        description: "Puissance dévastatrice capable de renverser des véhicules ou d'écraser l'acier."
      },
      {
        level: 5,
        name: "Force Titanesque",
        description: "Atteindre une force quasi-divine, capable de détruire des structures ou d'arrêter des véhicules en mouvement."
      }
    ]
  },

  presence: {
    id: "presence",
    name: "Présence",
    description: "Manipulation émotionnelle et charisme surnaturel",
    powers: [
      {
        level: 1,
        name: "Crainte Révérencielle",
        description: "Projeter une aura d'intimidation ou de majesté qui attire l'attention et inspire le respect ou la peur."
      },
      {
        level: 2,
        name: "Regard Terrifiant",
        description: "Inspirer une terreur paralysante d'un simple regard, forçant la cible à fuir ou se prosterner."
      },
      {
        level: 3,
        name: "Envoûtement",
        description: "Créer un lien émotionnel intense, la cible devient fascinée et désire plaire au vampire."
      },
      {
        level: 4,
        name: "Convocation",
        description: "Appeler une personne précédemment rencontrée. La cible ressent un besoin irrésistible de rejoindre le vampire."
      },
      {
        level: 5,
        name: "Majesté",
        description: "Devenir si impressionnant que personne ne peut lever la main contre le vampire ou même le contrarier."
      }
    ]
  },

  protean: {
    id: "protean",
    name: "Protéisme",
    description: "Transformation du corps et communion avec la terre",
    powers: [
      {
        level: 1,
        name: "Yeux de la Bête",
        description: "Les yeux brillent de rouge, permettant de voir parfaitement dans l'obscurité totale."
      },
      {
        level: 2,
        name: "Griffes de la Bête",
        description: "Faire pousser des griffes acérées infligeant des dégâts aggravés, capables de déchirer l'acier."
      },
      {
        level: 3,
        name: "Fusion avec la Terre",
        description: "S'enfoncer dans le sol pour se reposer en sécurité, à l'abri du soleil et des ennemis."
      },
      {
        level: 4,
        name: "Forme de la Bête",
        description: "Se transformer en animal : loup ou chauve-souris traditionnellement, gardant sa conscience."
      },
      {
        level: 5,
        name: "Forme de Brume",
        description: "Devenir une brume intangible, immunisée aux dégâts physiques et capable de passer par les fissures."
      }
    ]
  },

  obtenebration: {
    id: "obtenebration",
    name: "Obténébration",
    description: "Manipulation des ténèbres et des ombres",
    powers: [
      {
        level: 1,
        name: "Jeu d'Ombres",
        description: "Manipuler les ombres existantes, les étirer, les animer ou obscurcir une zone."
      },
      {
        level: 2,
        name: "Linceul de la Nuit",
        description: "Créer une zone de ténèbres impénétrables qui étouffe les sons et aveugle complètement."
      },
      {
        level: 3,
        name: "Bras des Abysses",
        description: "Invoquer des tentacules d'ombre solide qui peuvent agripper, frapper ou étrangler."
      },
      {
        level: 4,
        name: "Forme Ténébreuse",
        description: "Transformer son corps en ombre vivante, immunisée aux dégâts physiques."
      },
      {
        level: 5,
        name: "Ténèbres Intérieures",
        description: "Libérer les ténèbres de son âme, créant un puits d'obscurité dévorant qui consume tout."
      }
    ]
  },

  thaumaturgy: {
    id: "thaumaturgy",
    name: "Thaumaturgie",
    description: "Magie du sang des Tremere",
    powers: [
      {
        level: 1,
        name: "Goût du Sang",
        description: "En goûtant le sang, connaître les traits fondamentaux de la créature : génération, clan, diablerie récente..."
      },
      {
        level: 2,
        name: "Rage du Sang",
        description: "Forcer le sang d'une victime à chauffer, lui infligeant d'intenses douleurs internes."
      },
      {
        level: 3,
        name: "Puissance du Sang",
        description: "Concentrer le pouvoir de son sang, augmentant temporairement ses attributs physiques."
      },
      {
        level: 4,
        name: "Vol de Vitae",
        description: "Arracher le sang d'une victime à distance, le sang jaillissant vers le vampire."
      },
      {
        level: 5,
        name: "Chaudron de Sang",
        description: "Faire bouillir le sang d'une victime dans ses veines, causant des dégâts aggravés massifs."
      }
    ]
  },

  vicissitude: {
    id: "vicissitude",
    name: "Vicissitude",
    description: "Modelage de la chair et des os",
    powers: [
      {
        level: 1,
        name: "Modelage Mineur",
        description: "Altérer ses propres traits faciaux et petites caractéristiques corporelles de façon permanente."
      },
      {
        level: 2,
        name: "Sculpture de Chair",
        description: "Remodeler la chair d'autrui comme de l'argile, créant des altérations permanentes."
      },
      {
        level: 3,
        name: "Sculpture d'Os",
        description: "Manipuler la structure osseuse, créant des armes naturelles, des armures ou des difformités."
      },
      {
        level: 4,
        name: "Forme Horrible",
        description: "Se transformer en monstre de guerre : 2m50, griffes d'os, armure de chair noire."
      },
      {
        level: 5,
        name: "Forme de Sang",
        description: "Dissoudre son corps en une flaque de vitae sentiente, immunisée aux dégâts physiques."
      }
    ]
  },

  necromancy: {
    id: "necromancy",
    name: "Nécromancie",
    description: "Pouvoir sur la mort et les esprits",
    powers: [
      {
        level: 1,
        name: "Insight",
        description: "Percevoir les fantômes et les traces de mort. Sentir si quelqu'un est proche de la mort."
      },
      {
        level: 2,
        name: "Convocation",
        description: "Appeler l'esprit d'un mort pour l'interroger. Nécessite un lien avec le défunt."
      },
      {
        level: 3,
        name: "Compelle",
        description: "Forcer un fantôme à obéir à vos ordres, même contre sa volonté."
      },
      {
        level: 4,
        name: "Animation Cadavérique",
        description: "Animer les morts pour créer des zombies obéissants. Plus le corps est frais, plus il est efficace."
      },
      {
        level: 5,
        name: "Tourment",
        description: "Infliger une agonie atroce aux fantômes et aux morts-vivants, ou arracher l'âme d'un mourant."
      }
    ]
  },

  quietus: {
    id: "quietus",
    name: "Quietus",
    description: "L'art silencieux de la mort des Banu Haqim",
    powers: [
      {
        level: 1,
        name: "Silence de la Mort",
        description: "Créer une zone de silence absolu autour de soi, étouffant tous les sons."
      },
      {
        level: 2,
        name: "Toucher du Scorpion",
        description: "Transformer sa vitae en poison paralysant qui peut être appliqué sur des armes."
      },
      {
        level: 3,
        name: "Appel de Dagon",
        description: "Faire suffoquer une victime en faisant remonter son propre sang dans sa gorge."
      },
      {
        level: 4,
        name: "Caresse de Baal",
        description: "Le sang du vampire devient un acide mortel au contact de l'air, infligeant des dégâts aggravés."
      },
      {
        level: 5,
        name: "Goût de la Mort",
        description: "Cracher son sang vitae comme un jet d'acide corrosif à distance."
      }
    ]
  },

  serpentis: {
    id: "serpentis",
    name: "Serpentis",
    description: "Pouvoirs serpentins du Ministry",
    powers: [
      {
        level: 1,
        name: "Regard Hypnotique",
        description: "Paralyser une victime par un contact visuel, la laissant fascinée et sans défense."
      },
      {
        level: 2,
        name: "Langue du Serpent",
        description: "Allonger sa langue en un appendice fourchu utilisable comme arme ou outil préhensile."
      },
      {
        level: 3,
        name: "Peau de Vipère",
        description: "Transformer sa peau en écailles de serpent, offrant une armure naturelle."
      },
      {
        level: 4,
        name: "Forme du Cobra",
        description: "Se transformer en grand serpent venimeux, gardant ses capacités vampiriques."
      },
      {
        level: 5,
        name: "Cœur des Ténèbres",
        description: "Retirer son propre cœur et le cacher, devenant immunisé au staking."
      }
    ]
  },

  dementation: {
    id: "dementation",
    name: "Aliénation",
    description: "Transmission de la folie malkavienne",
    powers: [
      {
        level: 1,
        name: "Passion",
        description: "Amplifier ou réduire les émotions d'une cible, la rendant euphorique ou mélancolique."
      },
      {
        level: 2,
        name: "Hantise",
        description: "Implanter une phobie irrationnelle ou une obsession dans l'esprit de la victime."
      },
      {
        level: 3,
        name: "Yeux du Chaos",
        description: "Percevoir les patterns cachés de la réalité, prédire les comportements et trouver des failles."
      },
      {
        level: 4,
        name: "Voix de la Folie",
        description: "Plonger temporairement la cible dans une folie complète avec quelques mots."
      },
      {
        level: 5,
        name: "Démence Totale",
        description: "Infliger une psychose permanente à la victime, fracturant irrémédiablement son esprit."
      }
    ]
  },

  chimerstry: {
    id: "chimerstry",
    name: "Chimérie",
    description: "Création d'illusions des Ravnos",
    powers: [
      {
        level: 1,
        name: "Ignis Fatuus",
        description: "Créer une illusion statique affectant un seul sens (image, son, odeur...)."
      },
      {
        level: 2,
        name: "Fata Morgana",
        description: "Créer des illusions multi-sensorielles statiques mais complètes."
      },
      {
        level: 3,
        name: "Apparition",
        description: "Les illusions peuvent maintenant bouger et réagir de manière autonome."
      },
      {
        level: 4,
        name: "Permanence",
        description: "Les illusions persistent même quand le vampire ne se concentre plus dessus."
      },
      {
        level: 5,
        name: "Réalité Illusoire",
        description: "Les illusions deviennent partiellement réelles et peuvent infliger de vrais dégâts psychosomatiques."
      }
    ]
  }
};

// Disciplines par clan
export const CLAN_DISCIPLINES = {
  brujah: ["celerity", "potence", "presence"],
  gangrel: ["animalism", "fortitude", "protean"],
  malkavian: ["auspex", "dementation", "obfuscate"],
  nosferatu: ["animalism", "obfuscate", "potence"],
  toreador: ["auspex", "celerity", "presence"],
  tremere: ["auspex", "dominate", "thaumaturgy"],
  ventrue: ["dominate", "fortitude", "presence"],
  lasombra: ["dominate", "obtenebration", "potence"],
  tzimisce: ["animalism", "auspex", "vicissitude"],
  hecata: ["auspex", "fortitude", "necromancy"],
  ministry: ["obfuscate", "presence", "serpentis"],
  banu_haqim: ["celerity", "obfuscate", "quietus"],
  ravnos: ["animalism", "chimerstry", "fortitude"]
};

// Niveau maximum de discipline selon la Puissance du Sang
export const MAX_DISCIPLINE_LEVEL = {
  1: 1,  // BP 1: accès au niveau 1
  2: 2,  // BP 2: accès aux niveaux 1-2
  3: 3,  // BP 3: accès aux niveaux 1-3
  4: 4,  // BP 4: accès aux niveaux 1-4
  5: 5   // BP 5: accès aux niveaux 1-5
};

/**
 * Récupère les disciplines disponibles pour un clan et un niveau de BP
 */
export function getAvailableDisciplines(clan, bloodPotency) {
  const clanLower = clan?.toLowerCase();
  const clanDisciplineIds = CLAN_DISCIPLINES[clanLower] || [];
  const maxLevel = MAX_DISCIPLINE_LEVEL[bloodPotency] || 2;

  return clanDisciplineIds.map(disciplineId => {
    const discipline = DISCIPLINES[disciplineId];
    if (!discipline) return null;

    return {
      ...discipline,
      powers: discipline.powers.filter(power => power.level <= maxLevel),
      maxLevel: maxLevel
    };
  }).filter(Boolean);
}

/**
 * Récupère toutes les disciplines (pour affichage admin/référence)
 */
export function getAllDisciplines() {
  return Object.values(DISCIPLINES);
}
