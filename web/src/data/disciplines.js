/**
 * Disciplines de Vampire: The Masquerade V20
 *
 * Chaque discipline a 5 niveaux de pouvoir.
 * L'accès dépend du clan (disciplines de clan) et du niveau de Puissance du Sang.
 *
 * Accès par Puissance du Sang:
 * - BP 1: Niveau 1
 * - BP 2: Niveaux 1-2
 * - BP 3: Niveaux 1-3
 * - BP 4: Niveaux 1-4
 * - BP 5: Niveaux 1-5
 * - BP 6+: Niveaux 1-6+ (Accès Elder)
 */

export const DISCIPLINES = {
  animalism: {
    id: "animalism",
    name: "Animalisme",
    description: "Ta Bête reconnaît ses semblables. Les créatures sauvages sentent la prédation dans ton regard et s'y soumettent.",
    powers: [
      {
        level: 1,
        name: "Murmures Fauves",
        bloodCost: 0,
        duration: "scene",
        description: "Croise le regard d'un animal et parle-lui comme à un égal. Le chien de garde comprendra ta requête, le rat d'égout te décrira ce qu'il a vu, le corbeau te guidera vers ta proie. Les animaux te répondent par leurs comportements et leurs sons que tu comprends instinctivement. Tu peux demander un service simple ou obtenir des informations sur ce qui se passe dans leur territoire."
      },
      {
        level: 2,
        name: "L'Appel",
        bloodCost: 1,
        duration: "scene",
        description: "Pousse un hurlement, un cri ou un sifflement silencieux dans la nuit. Tous les animaux d'un type que tu choisis (corbeaux, rats, chiens errants, chats de gouttière) dans un rayon de plusieurs pâtés de maisons ressentent ton appel irrésistible. Ils accourent par dizaines, prêts à t'obéir. Parfait pour créer une diversion, espionner un quartier entier, ou submerger un ennemi sous une marée de créatures furieuses."
      },
      {
        level: 3,
        name: "Dompter la Bête",
        bloodCost: 3,
        duration: "instant",
        description: "Ta propre Bête reconnaît celle des autres. D'un regard chargé de volonté, tu peux calmer un vampire en pleine frénésie, apaisant sa rage comme on dompte un animal sauvage. Ou au contraire, libère la terreur primordiale : fixe un vampire et réveille son Rötschreck, cette peur ancestrale du feu et du soleil qui le force à fuir comme une bête traquée."
      },
      {
        level: 4,
        name: "Communion Spirituelle",
        bloodCost: 3,
        duration: "prolonged",
        description: "Ferme les yeux et projette ton esprit dans le corps d'un animal que tu as touché. Pendant que ton corps de vampire tombe en torpeur, tu vois par les yeux du faucon planant au-dessus de la ville, tu cours dans les rues avec le corps du loup, tu te faufiles dans les conduits avec celui du rat. Tu contrôles totalement l'animal, gardant ton intelligence et ta perception. L'espionnage parfait, personne ne soupçonne l'oiseau sur le rebord de la fenêtre."
      },
      {
        level: 5,
        name: "Libérer la Bête",
        bloodCost: 9,
        duration: "scene",
        description: "Quand la frénésie monte en toi, projette-la violemment dans une victime proche. Ta Bête bondit de ta poitrine vers la sienne, et c'est elle qui sombre dans la rage animale tandis que tu deviens étrangement vide, froid, incapable d'émotions pendant quelques heures. Tu peux diriger ta Bête vers un ennemi pour qu'il se transforme en monstre enragé, ou vers un innocent pour t'en débarrasser. Quand ta Bête reviendra, elle se souviendra de ce que tu lui as fait."
      },
      {
        level: 6,
        name: "L'Innocence du Berger",
        bloodCost: 9,
        duration: "scene",
        description: "Tu dégages une aura de pureté naturelle qui apaise même les prédateurs les plus féroces. Les animaux ne te craignent plus, ils t'adorent. Ils viennent se frotter contre toi, te protègent et refusent de t'attaquer, même contraints par la magie. Tu es le roi de la jungle, non par la force, mais par le droit divin."
      },
      {
        level: 7,
        name: "Conquérir la Bête",
        bloodCost: 9,
        duration: "scene",
        description: "Tu as dompté le monstre en toi. Lorsque la Frénésie te gagne, tu ne perds pas le contrôle. Tu deviens une machine à tuer froide, lucide et terrifiante, utilisant la rage de la Bête avec la précision d'un chirurgien. La peur et la colère ne sont plus des maîtres, mais des carburants."
      },
      {
        level: 8,
        name: "Esprits Jumeaux",
        bloodCost: 9,
        duration: "prolonged",
        description: "Tu n'es plus limité à un seul corps. Ton esprit peut habiter et contrôler un animal tout en gardant une conscience totale de ta forme vampirique. Tu es à la fois le maître dans son trône et le loup dans la forêt, agissant simultanément en deux lieux, coordonnant tes propres actions avec une synergie parfaite."
      },
      {
        level: 9,
        name: "Lien de Chair",
        bloodCost: 9,
        duration: "permanent",
        description: "La frontière entre toi et ta ghoule animale s'efface. Tu peux absorber son corps dans le tien, fusionnant vos chairs et vos esprits. Elle vit en toi, renforçant ton corps de sa vigueur, prête à être 'expulsée' pour combattre à tes côtés à tout moment. Vous êtes une légion dans un seul corps."
      },
      {
        level: 10,
        name: "Armée de Bêtes",
        bloodCost: 10,
        duration: "scene",
        description: "Un cri mental suffit. Chaque animal, du rat d'égout à l'oiseau de proie, dans un rayon de plusieurs kilomètres, répond à ton appel. Tu ne commandes pas une meute, tu diriges un écosystème entier qui se soulève pour dévorer tes ennemis. La nature elle-même part en guerre sur ton ordre."
      }
    ]
  },

  auspex: {
    id: "auspex",
    name: "Auspex",
    description: "Le voile entre les mondes s'efface. Tes sens transcendent la chair pour percevoir ce que les mortels ne verront jamais.",
    powers: [
      {
        level: 1,
        name: "Sens Accrus",
        bloodCost: 0,
        duration: "scene",
        description: "Concentre-toi et l'un de tes sens devient surhumain. Choisis de voir dans l'obscurité totale des égouts comme en plein jour, d'entendre une conversation chuchotée à trois étages de distance, de suivre une trace à l'odeur comme un limier, de goûter le moindre poison dans le vin, ou de sentir les vibrations de pas à travers un mur. Les détails invisibles aux mortels t'apparaissent clairement. La contrepartie ? Pendant ce temps, tu es hypersensible : un flash de lumière t'aveugle, un bruit fort te paralyse."
      },
      {
        level: 2,
        name: "Perception de l'Aura",
        bloodCost: 0,
        duration: "instant",
        description: "Regarde quelqu'un et tu vois son âme nue. Des volutes de couleurs tournent autour de lui : rouge pour la colère, bleu pour le calme, noir strié d'écarlate pour un vampire, or pâle pour un mortel pieux, vert maladif pour l'envie. Tu discernes ses émotions dominantes, détectes s'il ment, vois s'il est ensorcelé par la Domination, ou reconnais sa vraie nature surnaturelle. Les auras ne mentent jamais, mais les interpréter demande de l'expérience."
      },
      {
        level: 3,
        name: "Toucher de l'Esprit",
        bloodCost: 3,
        duration: "instant",
        description: "Prends un objet entre tes mains et ferme les yeux. Les émotions et souvenirs qui y sont imprégnés déferlent dans ton esprit en visions fragmentées. Ce couteau ? Tu vois son propriétaire le plonger dans le dos de sa victime. Cette lettre ? Tu ressens le désespoir de celle qui l'a écrite. Plus l'objet est chargé émotionnellement ou ancien, plus les visions sont intenses. Touche un mur et vois le meurtre qui s'y est déroulé il y a dix ans."
      },
      {
        level: 4,
        name: "Télépathie",
        bloodCost: 3,
        duration: "scene",
        description: "Fixe quelqu'un et plonge dans son esprit. Ses pensées de surface te parviennent comme des murmures : 'Je dois cacher cette lettre', 'Il ment, je le sais', 'Comment sortir d'ici ?'. Tu peux aussi projeter tes propres pensées directement dans sa tête, créant une conversation silencieuse. Avec de l'effort, tu peux fouiller plus profondément, cherchant un souvenir précis, mais l'esprit résiste comme un château fortifié. Les pensées des vampires anciens sont encore plus difficiles à pénétrer."
      },
      {
        level: 5,
        name: "Projection Psychique",
        bloodCost: 9,
        duration: "prolonged",
        description: "Ton esprit se détache de ton corps de chair qui s'effondre, inanimé. Tu flottes au-dessus, forme fantomatique d'énergie psychique argentée, invisible aux mortels. Traverse les murs, vole au-dessus de la ville à la vitesse de la pensée, explore le repaire de ton ennemi sans risque. Tu peux voyager jusqu'au plan astral, un monde de symboles et d'archétypes où rôdent des entités étranges. Mais ton corps est vulnérable : s'il meurt pendant ton absence, ton esprit erre pour l'éternité."
      },
      {
        level: 6,
        name: "Clairvoyance",
        bloodCost: 9,
        duration: "prolonged",
        description: " Tes sens ne sont plus limités par la matière ou la distance. Ferme les yeux et vois ce qui se passe à l'autre bout de la ville, écoute les conspirations derrière des murs insonorisés. Tu deviens l'observateur omniscient, le fantôme qui hante chaque recoin de la cité sans jamais quitter son refuge."
      },
      {
        level: 7,
        name: "Vision Karmique",
        bloodCost: 9,
        duration: "instant",
        description: "Tu ne regardes plus la personne, mais la tapisserie de son destin. Tu vois le poids de ses péchés, les nœuds de son avenir et les chaînes de son passé. Tu sais ce qu'elle a fait, ce qu'elle est destinée à faire, et combien son âme est proche de la rupture totale."
      },
      {
        level: 8,
        name: "Assaut Psychique",
        bloodCost: 9,
        duration: "instant",
        description: "La connaissance est une arme. Tu peux projeter une attaque mentale brute si violente qu'elle se manifeste physiquement. Tes victimes saignent des yeux, leurs synapses grillent, leurs souvenirs s'effacent. Tu tues par la simple pensée, transformant leur propre esprit en chambre de torture."
      },
      {
        level: 9,
        name: "Maître du Domus",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu deviens l'esprit du lieu. Tu sais tout ce qui se passe dans ton domaine : chaque pas sur le sol, chaque mot chuchoté, chaque poussière déplacée. Personne ne peut se cacher chez toi. Tu n'as pas besoin de caméras ; les murs eux-mêmes sont tes yeux et tes oreilles."
      },
      {
        level: 10,
        name: "Pouls de la Canaille",
        bloodCost: 10,
        duration: "scene",
        description: "Tu connectes ton esprit à la psyché collective de toute une ville. Tu entends les pensées de millions d'âmes comme un bruit de fond, tu ressens les émotions de masse. Tu sais tout, tout le temps. L'individualité s'efface devant l'omniscience. Tu es la Ville."
      }
    ]
  },

  celerity: {
    id: "celerity",
    name: "Célérité",
    description: "Le sang mort dans tes veines pulse d'une énergie explosive. Le monde ralentit autour de toi tandis que tu deviens l'éclair.",
    powers: [
      {
        level: 1,
        name: "Grâce Féline",
        bloodCost: 0,
        duration: "permanent",
        description: "Ton corps réagit avant même que ton esprit ne commande. Plus qu'une vitesse brute, c'est un équilibre parfait et surnaturel. Tu ne trébuches jamais, tu rattrapes un verre qui tombe avant qu'une goutte ne s'en échappe, tu esquives un coup que tu n'avais même pas vu venir. Tu es perpétuellement en état d'alerte physiologique parfaite."
      },
      {
        level: 2,
        name: "Rapidité",
        bloodCost: 1,
        duration: "scene",
        description: "Tes membres deviennent flous. Ce n'est pas encore courir vite, c'est agir vite. Tu peux dégainer, tirer et rengainer avant qu'un mortel ne cligne des yeux. Tu peux porter trois coups de couteau dans le temps qu'il en faut pour respirer. Pour un observateur, tu sembles avoir simplement sauté une étape dans la réalité."
      },
      {
        level: 3,
        name: "Fulgurance",
        bloodCost: 1,
        duration: "instant",
        description: "La distance n'a plus de sens. Tu peux traverser une pièce bondée sans bousculer personne, simplement en passant dans les 'interstices' de leur attention. Tu es ici, et la seconde d'après tu es derrière ton ennemi à l'autre bout de la rue. Tu deviens le cauchemar qui frappe et disparaît avant même que le son de l'impact ne parvienne aux témoins."
      },
      {
        level: 4,
        name: "Lenteur du Monde",
        bloodCost: 1,
        duration: "scene",
        description: "Ce n'est plus toi qui vas vite, c'est le monde qui s'arrête. Tu marches tranquillement entre les gouttes de pluie suspendues dans l'air. Tu as le temps de composer un poème pendant qu'une explosion se déploie au ralenti à côté de toi. Tu ne te contentes pas de réagir, tu planifies et exécutes avec une précision chirurgicale pendant que tes ennemis sont figés comme des statues de cire."
      },
      {
        level: 5,
        name: "Projection Éclair",

        bloodCost: 3,
        duration: "instant",
        description: "La gravité et l'inertie ne s'appliquent plus à toi. Tu deviens une force cinétique pure capable de courir à la verticale sur la façade d'un gratte-ciel ou de traverser une étendue d'eau sans t'y enfoncer. Ton passage crée un souffle d'air violent, et tu peux t'arrêter net depuis une vitesse supersonique sans ressentir l'impact. Tu n'es plus un corps, tu es un projectile vivant."
      },
      {
        level: 6,
        name: "Projectile",
        bloodCost: 9,
        duration: "instant",
        description: "Tu transfères ta vitesse surnaturelle à un objet que tu lances. Une simple pièce de monnaie devient une balle traversant l'acier, un couteau de lancer frappe avec la force d'un canon. L'objet ne se contente pas de voler vite, il devient un missile cinétique dévastateur."
      },
      {
        level: 7,
        name: "Fleur de Mort",
        bloodCost: 9,
        duration: "scene",
        description: "Tu te déplaces si vite que tu sembles être partout à la fois. Tu deviens une tempête de lames et de coups, frappant chaque ennemi dans la pièce avant que le premier corps ne touche le sol. Ce n'est pas un combat, c'est une exécution simultanée de masse."
      },
      {
        level: 8,
        name: "Zéphyr",
        bloodCost: 9,
        duration: "scene",
        description: "La gravité ne s'applique plus à toi. Tu cours sur l'eau sans créer d'ondulations, tu marches sur les murs comme si c'était le sol, tu peux même courir sur des fils de pêche ou des nuages de fumée si tu es assez rapide. Tu es devenu insaisissable, une force pure en mouvement."
      },
      {
        level: 9,
        name: "Dilatation Temporelle",
        bloodCost: 9,
        duration: "scene",
        description: "Le temps n'est plus une rivière, c'est un lac gelé. Entre deux battements de cœur d'un mortel, tu as vécu une éternité. Tu marches calmement au milieu des explosions figées, tu déplaces tes ennemis comme des mannequins inertes. Pour eux, tu n'as pas bougé : tu es simplement devenu la mort instantanée."
      }
    ]
  },

  dominate: {
    id: "dominate",
    name: "Domination",
    description: "Ton regard est une chaîne, ta voix un fouet. Les esprits faibles se brisent devant ta volonté comme du verre.",
    powers: [
      {
        level: 1,
        name: "Commandement",
        bloodCost: 1,
        duration: "instant",
        description: "Regarde quelqu'un dans les yeux et donne-lui un ordre d'un seul mot : 'Fuis !', 'Tombe !', 'Oublie !', 'Parle !'. Ta volonté s'écrase contre la sienne comme un marteau. Il doit obéir immédiatement, incapable de résister à cet impératif qui résonne dans son crâne. L'ordre doit être simple et direct, mais les possibilités sont infinies : faire tomber une arme, avouer un secret, quitter la pièce. Le commandement ne dure qu'un instant, mais cet instant peut tout changer."
      },
      {
        level: 2,
        name: "Mésmerisme",
        bloodCost: 1,
        duration: "prolonged",
        description: "Plonge ton regard dans le sien et parle doucement. Implante une suggestion complexe dans son subconscient comme on programme une machine : 'Quand tu verras le Prince, tu oublieras ce que tu as vu ce soir', 'Si quelqu'un pose des questions, tu diras que j'étais avec toi toute la soirée'. La suggestion reste dormante jusqu'à ce que la condition se déclenche. La victime ne se souviendra pas de tes instructions, elle agira simplement comme si c'était son idée. Tu peux créer des alibis, des taupes, des saboteurs qui ne savent pas qu'ils le sont."
      },
      {
        level: 3,
        name: "Oubli",
        bloodCost: 3,
        duration: "permanent",
        description: "Regarde-le dans les yeux et vole ses souvenirs. Efface les dernières minutes de sa mémoire comme on gomme du crayon, fais disparaître toute la soirée, ou plonge plus profond pour arracher des années entières. Tu peux aussi réécrire ses souvenirs : il se souviendra t'avoir vu ailleurs, ou que c'est son ami qui l'a trahi, pas toi. Les vampires utilisent ce pouvoir pour préserver la Mascarade, pour créer des témoins fiables de crimes qu'ils n'ont pas commis, ou simplement pour que leurs proies oublient le baiser."
      },
      {
        level: 4,
        name: "Conditionnement",
        bloodCost: 3,
        duration: "permanent",
        description: "Séance après séance, nuit après nuit, tu brises sa volonté comme on dresse un animal. Ce n'est pas une œuvre d'un instant : l'esprit doit être plié lors de trois nuits distinctes pour être définitivement conquis. Chaque session de Domination enfonce les chaînes plus profondément : obéissance absolue, dévotion totale, soumission sans limite. Au terme de la troisième nuit, sa personnalité est remodelée. Il t'aime, te craint, te vénère. Il trahira sa famille pour toi, tuera pour toi, mourra pour toi en souriant. Les esclaves ainsi conditionnés sont appelés des goules de l'esprit, et leur loyauté dépasse celle du sang."
      },
      {
        level: 5,
        name: "Possession",
        bloodCost: 9,
        duration: "prolonged",
        description: "Fixe un mortel dans les yeux et projette ton esprit dans le sien, l'écrasant, le noyant, le poussant dans un coin obscur de son propre crâne. Tu prends le contrôle total de son corps. Pendant que ton enveloppe de vampire tombe en torpeur, tu vis sa vie : tu sens la chaleur du soleil, tu goûtes la nourriture, tu respires. Tu peux marcher en plein jour, passer inaperçu, accéder à des lieux interdits aux vampires. Mais son esprit hurle dans sa prison mentale, et s'il meurt pendant que tu l'habites, ton esprit meurt avec lui."
      },
      {
        level: 6,
        name: "Rationalisation",
        bloodCost: 9,
        duration: "permanent",
        description: "Tes victimes ne se contentent plus d'obéir aveuglément ; elles croient que c'est leur idée. Ordonne à un garde de tuer son roi, et il trouvera lui-même une raison politique pour le faire. Elles justifient tes ordres les plus absurdes avec une sincérité terrifiante, protégeant ton influence contre toute détection."
      },
      {
        level: 7,
        name: "Manipulation de Masse",
        bloodCost: 9,
        duration: "scene",
        description: "Ton regard n'a plus besoin de croiser un seul regard. Tu peux dominer une foule entière, une armée, ou une salle de bal d'un seul mot. Ils s'arrêtent, écoutent, et obéissent à l'unisson. Tu transformes une émeute hurlante en une chorale disciplinée en une seconde."
      },
      {
        level: 8,
        name: "Maîtrise Lointaine",
        bloodCost: 9,
        duration: "instant",
        description: "La distance ne te protège plus. Si tu connais ta cible, tu peux la Dominer à l'autre bout du monde. Un coup de téléphone, une lettre, ou même une simple pensée dirigée suffit à briser sa volonté. Tu es la voix dans leur tête qui ne se tait jamais, où qu'ils aillent."
      },
      {
        level: 9,
        name: "Parole du Sang",
        bloodCost: 10,
        duration: "instant",
        description: "Tu parles, et ta lignée obéit. Tu peux donner un ordre à tous les vampires qui descendent de toi, même des générations plus bas. 'Venez à moi', et cinquante vampires convergent vers ta position. C'est le pouvoir des Antédiluviens, le contrôle absolu sur sa descendance."
      }
    ]
  },

  fortitude: {
    id: "fortitude",
    name: "Force d'Âme",
    description: "Ton corps mort est plus résistant que l'acier vivant. Balles, lames et flammes se brisent contre ta chair de cadavre.",
    powers: [
      {
        level: 1,
        name: "Résilience",
        bloodCost: 0,
        duration: "permanent",
        description: "La douleur existe toujours, mais elle est... lointaine. Les coups qui feraient tomber un mortel te font à peine ciller. Une batte de baseball sur l'épaule ? Tu tournes la tête, agacé. Un coup de poing dans le ventre ? Tu expires calmement. Ton corps absorbe les impacts comme un sac de sable, sans broncher, sans reculer. Tu n'es pas encore invulnérable, mais tu es terriblement difficile à faire tomber."
      },
      {
        level: 2,
        name: "Endurance",
        bloodCost: 0,
        duration: "permanent",
        description: "Les balles entrent, mais elles ne t'arrêtent pas. Le couteau plonge dans ta chair, et tu continues d'avancer. Ce qui tuerait un mortel ne fait que te ralentir légèrement. Tu peux combattre avec une lame plantée dans le ventre, courir avec une balle dans la jambe. Les blessures sont là, visibles, mais elles semblent... optionnelles. Tu décideras de t'en occuper plus tard."
      },
      {
        level: 3,
        name: "Résistance",
        bloodCost: 0,
        duration: "permanent",
        description: "Même les choses qui devraient te détruire peinent à t'entamer. Le feu te brûle, mais lentement, te laissant le temps de fuir. Les griffes d'un loup-garou déchirent ta chair, mais ne la consument pas comme elles le devraient. Tu peux plonger ta main dans les flammes pour récupérer un objet, traverser un brasier pour t'échapper. La destruction elle-même doit négocier avec toi."
      },
      {
        level: 4,
        name: "Inébranlable",
        bloodCost: 0,
        duration: "permanent",
        description: "Ton bras est arraché. Tu te relèves. Ta colonne vertébrale est brisée. Tu rampes vers ton ennemi. La moitié de ton corps est en feu. Tu continues de frapper. La douleur n'est plus qu'un bruit de fond lointain, un concept abstrait qui ne te concerne pas. Ton corps refuse simplement d'abandonner, même quand toute logique dit qu'il devrait s'effondrer. Tu es la chose qui ne reste pas à terre."
      },
      {
        level: 5,
        name: "Invulnérabilité",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu es ce dont les chasseurs de vampires font des cauchemars. Les balles rebondissent sur ta peau comme sur du blindage. Les lames se tordent contre tes os. Le soleil lui-même te consume au ralenti là où il devrait t'incinérer en un instant. Tu peux traverser un immeuble en flammes, encaisser l'explosion d'une grenade, te relever après avoir été percuté par un camion. Tu n'es pas immortel. Mais tu es la chose qui s'en approche le plus."
      },
      {
        level: 6,
        name: "Armure Personnelle",
        bloodCost: 9,
        duration: "scene",
        description: "Ta peau change de texture, devenant plus dure que le diamant. Les armes de corps à corps se brisent littéralement à l'impact contre ta chair. Frapper ton visage, c'est comme frapper un mur de béton armé. Tu brises les lames de tes ennemis avec ton cou."
      },
      {
        level: 7,
        name: "Force Partagée",
        bloodCost: 9,
        duration: "scene",
        description: "Tu peux étendre ton invulnérabilité. Touche un allié et donne-lui ta résistance légendaire. Pendant quelques instants, il devient aussi indestructible que toi. Tu es le bouclier qui protège la coterie contre l'apocalypse."
      },
      {
        level: 8,
        name: "Adamantin",
        bloodCost: 9,
        duration: "permanent",
        description: "Tu as dépassé le concept de blessure. La plupart des sources de dégâts conventionnels (balles, chutes, écrasements) ne t'affectent simplement plus. Tu peux marcher sous une presse hydraulique et la bloquer. Seules les destructions magiques ou massives peuvent espérer t'égratigner."
      }
    ]
  },

  obfuscate: {
    id: "obfuscate",
    name: "Occultation",
    description: "Tu plies la perception comme d'autres plient la lumière. Les regards glissent sur toi, les esprits t'oublient instantanément.",
    powers: [
      {
        level: 1,
        name: "Cape d'Ombre",
        bloodCost: 0,
        duration: "scene",
        description: "Fonds-toi dans l'ombre d'un recoin, d'une colonne, d'une alcôve. Reste immobile et tu deviens... rien. Pas invisible : les gens pourraient techniquement te voir si ils regardaient directement, mais leur cerveau refuse d'enregistrer ta présence. Leur regard glisse sur toi comme l'eau sur du verre. Tu es juste un détail sans importance, un morceau du décor, un rien. Bouge trop vite et le charme se brise. Parfait pour écouter des conversations ou attendre le moment parfait pour frapper."
      },
      {
        level: 2,
        name: "Présence Invisible",
        bloodCost: 0,
        duration: "scene",
        description: "Maintenant tu peux marcher parmi eux. Traverse une foule, longe un couloir, suis ta cible dans la rue. Les gens te voient subconsciemment et s'écartent sans savoir pourquoi, comme on évite un poteau. Les caméras de surveillance enregistrent ton passage mais l'opérateur qui regarde l'écran ne remarque rien. Tu peux fouiller un bureau pendant que le propriétaire travaille à son bureau, voler des clés dans la poche de quelqu'un, passer devant un garde. Ne fais rien pour attirer l'attention et tu restes invisible."
      },
      {
        level: 3,
        name: "Masque aux Mille Visages",
        bloodCost: 3,
        duration: "scene",
        description: "Au lieu de disparaître, projette une autre image : un visage différent, des vêtements différents, une corpulence différente. Tu ne changes pas physiquement, mais tous ceux qui te regardent voient ce que tu veux qu'ils voient. Deviens ce PDG pour entrer dans l'immeuble, prends les traits de son garde du corps, ou apparais comme un parfait inconnu. Les photos et vidéos montreront ton vrai visage, mais les témoins oculaires jureront avoir vu quelqu'un d'autre. Change d'apparence en un instant pour semer tes poursuivants."
      },
      {
        level: 4,
        name: "Disparition",
        bloodCost: 3,
        duration: "scene",
        description: "En pleine conversation, en pleine course, en plein combat : disparais. Un instant tu es là, l'instant suivant tu n'y es plus, évaporé comme de la fumée. Même ceux qui te regardaient directement clignent des yeux, confus, se demandant où tu es passé. Même les sens vampiriques et l'Auspex ont du mal à te détecter - tu es devenu un trou dans la réalité. Réapparais derrière ton adversaire, échappe-toi d'une pièce verrouillée en marchant devant les gardes stupéfaits, ou observe une scène en étant physiquement présent mais totalement imperceptible."
      },
      {
        level: 5,
        name: "Voile Collectif",
        bloodCost: 9,
        duration: "scene",
        description: "Étends ton pouvoir comme un manteau. Touche tes compagnons et ils disparaissent avec toi, un groupe fantôme qui se déplace dans la ville sans être vu. Dissimule ta voiture pour passer des barrages routiers, cache un groupe de goules armées, ou fais disparaître des preuves compromettantes sous les yeux des enquêteurs. Plus le groupe est large, plus c'est difficile : si l'un d'eux attire l'attention, le voile se déchire pour tous. Mais un groupe discipliné peut traverser un aéroport bondé comme des spectres."
      },
      {
        level: 6,
        name: "Esprit Vide",
        bloodCost: 9,
        duration: "prolonged",
        description: "Tu ne caches pas seulement ton corps, mais ton esprit. Tu deviens un trou noir psychique. Aucune télépathie, aucun Auspex, aucune détection magique ne peut te trouver. Même si on te regarde en face, on ne perçoit aucune pensée, aucune aura, aucune âme. Tu es un vide dans la réalité."
      },
      {
        level: 7,
        name: "Cache",
        bloodCost: 9,
        duration: "permanent",
        description: "Tu peux effacer un lieu entier de la mémoire du monde. Ta maison devient invisible et inatteignable. Les gens passent devant sans la voir, les GPS l'évitent, et ceux qui y entrent oublient pourquoi ils sont là dès qu'ils franchissent le seuil. Tu vis dans un angle mort de l'univers."
      },
      {
        level: 8,
        name: "Vieil Ami",
        bloodCost: 9,
        duration: "scene",
        description: "Tu n'as plus besoin de te cacher. Tout le monde te voit, mais tout le monde te voit comme quelqu'un en qui ils ont une confiance absolue. Pour le garde, tu es son collègue préféré. Pour le Prince, tu es son plus fidèle conseiller. Tu peux assassiner quelqu'un en plein jour, et les témoins jureront que c'était un accident malheureux, car tu ne ferais jamais ça."
      }
    ]
  },

  potence: {
    id: "potence",
    name: "Puissance",
    description: "Tes muscles morts contiennent la force de la damnation. Ce qui résiste, tu le brises. Ce qui s'oppose, tu l'écrases.",
    powers: [
      {
        level: 1,
        name: "Vigueur",
        bloodCost: 0,
        duration: "permanent",
        description: "Ta poigne est un étau. Tes muscles ne tremblent jamais sous l'effort, ne fatiguent jamais. Tu peux tenir une prise toute la nuit, serrer une main jusqu'à ce que les os craquent sans même forcer. Ce n'est pas encore de la force explosive, c'est une fondation inébranlable : tu es l'ancre que rien ne peut déplacer, le roc contre lequel les vagues se brisent."
      },
      {
        level: 2,
        name: "Prouesse",
        bloodCost: 0,
        duration: "permanent",
        description: "Les objets du monde mortel ne sont plus que des jouets fragiles. Tu plies les barreaux comme des branches mortes, tu enfonces les portes comme du carton, tu arraches les serrures avec tes doigts. Là où les autres utilisent des outils, tu n'as besoin que de tes mains. Le métal cède, le bois éclate, la pierre s'effrite sous ta prise."
      },
      {
        level: 3,
        name: "Brutalité",
        bloodCost: 0,
        duration: "permanent",
        description: "Chaque coup est une détonation. Un poing qui traverse un torse, une gifle qui brise une nuque, un coup de pied qui envoie un corps voler sur dix mètres. Tu ne frappes plus, tu détruis. Les mortels touchés par ta violence ne se relèvent pas. Les vampires réfléchissent à deux fois avant de croiser ta route. Ton corps est devenu une arme de démolition."
      },
      {
        level: 4,
        name: "Fureur",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu ne te mesures plus aux hommes, mais aux structures. Renverse une voiture d'une main, arrache un lampadaire du trottoir pour t'en servir comme gourdin, fais s'effondrer un mur porteur d'un coup d'épaule. Tes adversaires ne sont plus seulement les vivants, mais les bâtiments eux-mêmes. Tu es le tremblement de terre qui marche."
      },
      {
        level: 5,
        name: "Force Titanesque",
        bloodCost: 0,
        duration: "permanent",
        description: "Les lois de la physique te regardent avec incrédulité. Arrête un camion lancé à pleine vitesse en te plantant sur son chemin. Soulève un pylône électrique comme un javelot. Enfonce tes doigts dans le béton armé comme dans du beurre. Tu appartiens aux légendes maintenant, aux récits des anciens sur les géants et les titans. Ceux qui te voient à l'œuvre ne parlent plus de monstre, mais de dieu."
      },
      {
        level: 6,
        name: "Onde de Choc",
        bloodCost: 9,
        duration: "instant",
        description: "Frappe tes mains l'une contre l'autre ou frappe le sol : l'impact crée une onde de choc cinétique qui renverse tout le monde dans la pièce. Les vitres explosent, les meubles volent, et tes ennemis sont projetés comme des poupées de chiffon. Tu es l'épicentre du tremblement de terre."
      },
      {
        level: 7,
        name: "Séisme",
        bloodCost: 9,
        duration: "instant",
        description: "Une simple frappe au sol suffit à fissurer la route, faire s'effondrer des fondations ou créer des crevasses. Tu ne combats plus des hommes, tu combats le terrain lui-même. Tu peux faire s'écrouler un tunnel ou démolir un bâtiment d'un seul coup bien placé."
      },
      {
        level: 8,
        name: "Pichenette",
        bloodCost: 9,
        duration: "instant",
        description: "Ta maîtrise de la force est totale. Un simple claquement de doigts sur le front d'un ennemi suffit à lui briser le crâne. Une tape amicale peut disloquer une épaule. Tu n'as plus besoin d'élan ou de levier ; le moindre de tes mouvements porte la force d'un marteau-pilon."
      }
    ]
  },

  presence: {
    id: "presence",
    name: "Présence",
    description: "Ton aura plie les émotions comme un ouragan plie les arbres. Amour, terreur, dévotion : tu es la tempête dans leurs cœurs.",
    powers: [
      {
        level: 1,
        name: "Crainte Révérencielle",
        bloodCost: 0,
        duration: "scene",
        description: "Entre dans une pièce et tous les regards se tournent vers toi. Projette une aura de fascination magnétique ou de menace primordiale. Les conversations s'arrêtent, les gens s'écartent inconsciemment. Tu peux choisir l'émotion : admiration qui fait que les inconnus veulent te plaire, ou crainte qui les fait baisser les yeux. Pas besoin de contact visuel ou de mots, ta simple présence suffit. Les mortels trouvent des excuses pour rester près de toi ou pour fuir, selon ce que tu veux."
      },
      {
        level: 2,
        name: "Regard Terrifiant",
        bloodCost: 1,
        duration: "instant",
        description: "Fixe quelqu'un et libère ta Bête juste assez pour qu'il la voie. Tes yeux deviennent ceux d'un prédateur antédiluvien, ton visage un masque de terreur primordiale. La victime voit sa propre mort dans ton regard et la peur absolue la submerge. Elle fuit en hurlant, se recroqueville en position fœtale, ou se fige complètement, paralysée. Même les vampires peuvent être affectés, leur propre Bête reconnaissant un prédateur supérieur. L'effet est instantané et dévastateur."
      },
      {
        level: 3,
        name: "Envoûtement",
        bloodCost: 3,
        duration: "prolonged",
        description: "Parle à quelqu'un pendant quelques minutes et tisse autour de lui un réseau d'affection surnaturelle. Il devient fasciné par toi, pensant constamment à toi, cherchant des excuses pour te revoir. Ce n'est pas de l'amour véritable mais une obsession induite, aussi puissante qu'irrationnelle. Il te fera des faveurs, te couvrira, rationalisera tes actions horribles. Le lien émotionnel peut durer des semaines ou des mois. Cumule les victimes et tu peux bâtir un culte de mortels dévoués qui feraient n'importe quoi pour toi."
      },
      {
        level: 4,
        name: "Convocation",
        bloodCost: 3,
        duration: "instant",
        description: "Concentre-toi sur quelqu'un que tu as déjà rencontré, prononce son nom, et envoie l'appel. Où qu'il soit dans la ville, il ressent une impulsion irrésistible de venir te retrouver. Il ne sait pas pourquoi, mais il doit te voir, maintenant. Il quittera son travail, sa famille, son lit au milieu de la nuit pour te rejoindre. Le trajet peut prendre des heures, mais il viendra. Il ne peut pas résister à la convocation, sauf s'il est retenu physiquement. Quand il arrive, il sera désorienté, ne comprenant pas pourquoi il est venu."
      },
      {
        level: 5,
        name: "Majesté",
        bloodCost: 9,
        duration: "scene",
        description: "Active cette couronne invisible et tu deviens intouchable. Ton aura devient si écrasante, si magnifique et terrible à la fois, que personne ne peut lever la main contre toi. Les agresseurs baissent leurs armes, incapables de te frapper. Les insulteurs ravalent leurs mots. Même les vampires anciens hésitent. Tu deviens comme un roi-dieu : vénéré, craint, mais absolument inattaquable. Marche à travers une foule hostile sans être touché, donne des ordres que personne n'ose contester. Pour briser ta Majesté, il faut une volonté de fer ou ne plus te regarder du tout."
      },
      {
        level: 6,
        name: "Regard Paralysant",
        bloodCost: 9,
        duration: "scene",
        description: "Ton regard ne fait pas que faire peur, il éteint le système nerveux. La victime est physiquement incapable de bouger, de parler, ou même de cligner des yeux. Elle reste figée comme une statue, consciente mais prisonnière de son propre corps, tant que tu le décides."
      },
      {
        level: 7,
        name: "Coopération",
        bloodCost: 9,
        duration: "scene",
        description: "Tu imposes l'harmonie. Sous ton influence, des ennemis jurés travailleront ensemble avec une efficacité parfaite. Tu peux synchroniser une foule hétéroclite pour en faire une unité d'élite, ou forcer tes ennemis à t'aider à accomplir ton but. La discorde meurt en ta présence."
      }
    ]
  },

  protean: {
    id: "protean",
    name: "Protéisme",
    description: "Ta chair est argile, tes os sont fluides. La nature sauvage coule dans tes veines et tu peux prendre les formes de la Bête.",
    powers: [
      {
        level: 1,
        name: "Yeux de la Bête",
        bloodCost: 0,
        duration: "scene",
        description: "Tes yeux brillent d'une lueur rouge sang dans l'obscurité, comme ceux d'un loup ou d'un chat. L'obscurité totale devient claire comme le jour : tu vois chaque détail dans les tunnels d'égouts, les forêts sans lune, les caves sans fenêtres. Les mortels qui croisent ton regard dans le noir voient deux orbes écarlates flottant dans les ténèbres et comprennent qu'ils sont face à un prédateur. Même la lumière ne te gêne plus : tes yeux s'adaptent instantanément, passant de la vision nocturne à la vision diurne sans aveuglement."
      },
      {
        level: 2,
        name: "Griffes de la Bête",
        bloodCost: 1,
        duration: "scene",
        description: "Tes ongles s'allongent et s'épaississent, devenant des griffes d'os noir et brillant, dures comme de l'acier trempé et aiguisées comme des rasoirs. Elles poussent en quelques secondes dans un craquement d'os. Ces griffes ne sont pas de simples armes : elles infligent des blessures aggravées qui ne guérissent pas facilement, déchirant la chair vampirique comme du papier. Lacère un ennemi, déchire une gorge, éviscère d'un geste. Ou utilise-les pour escalader : plante-les dans la pierre, le béton, même l'acier, et grimpe comme une araignée."
      },
      {
        level: 3,
        name: "Fusion avec la Terre",
        bloodCost: 3,
        duration: "prolonged",
        description: "Agenouille-toi et touche la terre nue. Ton corps se liquéfie partiellement, s'enfonçant dans le sol comme dans de l'eau. En quelques secondes, tu disparais complètement, fusionnant avec la terre, le béton, même l'asphalte. Pendant le jour, tu reposes dans les entrailles de la terre, totalement protégé du soleil. Tu es conscient de ce qui se passe au-dessus : les vibrations des pas, les voix. Si quelqu'un creuse jusqu'à toi, tu te réveilles instantanément. Au crépuscule, émerge du sol comme un cadavre surgissant de sa tombe. Impossible à trouver, impossible à atteindre."
      },
      {
        level: 4,
        name: "Forme de la Bête",
        bloodCost: 3,
        duration: "scene",
        description: "Ton corps se tord, se reforme, les os craquent et la chair coule. En quelques secondes de transformation douloureuse, tu deviens un loup massif aux yeux rouges ou une chauve-souris géante. Tu gardes ton intelligence et ta personnalité, mais gains les sens et capacités de l'animal : vitesse et morsure du loup, vol et écholocation de la chauve-souris. Chasse dans les rues comme un prédateur naturel, vole au-dessus de la ville pour espionner, ou utilise ta forme animale pour échapper aux poursuivants. Les vêtements et petits objets se fondent dans la transformation."
      },
      {
        level: 5,
        name: "Forme de Brume",
        bloodCost: 9,
        duration: "scene",
        description: "Ton corps se dissout en brume spectrale, un nuage de vapeur pâle à peine visible. Tu deviens intangible : les balles te traversent, les lames ne font que disperser temporairement ton essence. Glisse-toi sous les portes, à travers les grilles, les fissures dans les murs. Flotte au-dessus des obstacles, échappe à toute contrainte physique. Tu peux même te disperser complètement pour éviter un danger, te reformant plus loin. Le vent peut te pousser mais pas te blesser. Seuls le feu et le soleil peuvent te nuire sous cette forme, mais même eux causent moins de dégâts. Tu es devenu l'essence même du vampire : ni mort ni vivant, entre deux états."
      },
      {
        level: 6,
        name: "Chair de Marbre",
        bloodCost: 9,
        duration: "scene",
        description: "Ta peau devient une substance surnaturelle, flexible comme la soie mais dure comme la pierre enchantée. Les coups ricoorent, les balles s'aplatissent. C'est plus qu'une armure, c'est une négation de la blessure. Pour te blesser, il faut une force capable de briser une montagne."
      },
      {
        level: 7,
        name: "Colère de la Bête",
        bloodCost: 9,
        duration: "scene",
        description: "Tu dépasses le loup et la chauve-souris. Tu deviens une monstruosité hybride, un cauchemar de griffes, de crocs et de muscles qui défie toute description biologique. Sous cette forme, tu es une machine de guerre pure, faite pour le massacre de masse, capable de déchiqueter un tank."
      },
      {
        level: 8,
        name: "Purifier la Bête",
        bloodCost: 9,
        duration: "instant",
        description: "Ton corps rejette tout ce qui est étranger. Tu peux expulser violemment les pieux, les balles, les poisons ou même les esprits intrus. Le bois pourri jaillit de ton cœur, les plaies se referment instantanément après avoir craché le plomb. Tu ne peux pas être contenu."
      },
      {
        level: 9,
        name: "Forme Mythique",
        bloodCost: 9,
        duration: "scene",
        description: "Tu te transformes en créature de légende. Dragon, Griffon, Hydre... Tu incarnes un mythe vivant avec tous ses pouvoirs supposés. Tu voles sans ailes, tu craches peut-être du feu (métaphorique ou réel), tu inspires une terreur ancestrale. Tu n'es plus un vampire, tu es un monstre de l'ancien monde."
      }
    ]
  },

  obtenebration: {
    id: "obtenebration",
    name: "Obténébration",
    description: "L'Abysse répond à ton appel. Les ténèbres t'obéissent comme des serviteurs, et dans ton ombre quelque chose de terrible attend.",
    powers: [
      {
        level: 1,
        name: "Jeu d'Ombres",
        bloodCost: 0,
        duration: "scene",
        description: "Les ombres autour de toi s'animent à ton contact. Fais danser ton ombre sur le mur, étire celle d'un arbre pour couvrir une fenêtre, assombris un coin de la pièce pour te cacher. Les ombres que tu manipules deviennent plus sombres, plus denses, presque palpables. Éteins une lampe sans la toucher en l'enveloppant d'obscurité, fais croire à quelqu'un qu'une silhouette se déplace dans l'ombre, ou crée des zones d'obscurité pour faciliter ta fuite. C'est subtil, mais terriblement efficace pour créer la peur et la confusion."
      },
      {
        level: 2,
        name: "Linceul de la Nuit",
        bloodCost: 1,
        duration: "scene",
        description: "Invoque une sphère de ténèbres absolues qui avale toute lumière. À l'intérieur : obscurité totale, même pour ceux qui peuvent voir dans le noir. Les lampes torches y meurent, les sorts de lumière s'éteignent. Pire encore, le Linceul étouffe le son, transformant les cris en murmures étouffés. Les victimes prisonnières sont aveugles, sourdes, désorientées, paniquées. Toi, tu te déplaces dans ces ténèbres comme chez toi. Crée le chaos dans un combat, couvre ta fuite, ou isole une victime pour l'éliminer sans témoins."
      },
      {
        level: 3,
        name: "Bras des Abysses",
        bloodCost: 3,
        duration: "scene",
        description: "Ton ombre se soulève et des tentacules d'obscurité solide en jaillissent comme des serpents. Ces membres d'ombre sont froids au toucher, solides comme de la chair mais faits de ténèbres vivantes. Ils agrippent, frappent, étranglent selon ta volonté. Emprisonne un adversaire dans une étreinte glaciale, gifle une arme hors d'une main, soulève quelqu'un et projette-le contre un mur. Les tentacules peuvent aussi servir à manipuler des objets à distance. Les victimes paniquent souvent, horrifiées de se faire toucher par l'Abysse elle-même."
      },
      {
        level: 4,
        name: "Forme Ténébreuse",
        bloodCost: 3,
        duration: "scene",
        description: "Dissous ton corps en ombre vivante, une silhouette sombre et mouvante à peine discernable dans la pénombre. Sous cette forme, tu es bidimensionnel : glisse le long des murs, coule sur le sol, rampe au plafond. Les armes physiques te traversent sans effet, les balles passent à travers toi comme à travers de la fumée. Seule la lumière intense te blesse, te forçant à fuir vers les ténèbres. Tu peux te faufiler sous les portes, à travers les grilles, dans les conduits. Tu es devenu l'ombre incarnée, une chose d'obscurité et de terreur."
      },
      {
        level: 5,
        name: "Ténèbres Intérieures",
        bloodCost: 9,
        duration: "scene",
        description: "Ouvre ton âme et libère l'Abysse qui sommeille en toi. Un puits de ténèbres absolues jaillit de ta bouche, de tes yeux, de ta poitrine, s'étendant comme une tache d'encre vivante. Cette obscurité dévore tout : la lumière, le son, la chaleur, l'espoir. Ceux qui y sont pris ressentent un froid glacial, une terreur viscérale, comme s'ils tombaient dans un gouffre sans fond. L'obscurité peut consumer les objets, dissoudre les murs, aspirer les victimes dans un néant temporaire. Même les autres vampires reculent devant cette manifestation pure de l'Abysse. C'est l'arme ultime du Lasombra, mais l'utiliser trop longtemps, c'est risquer que les ténèbres ne te consument aussi."
      },
      {
        level: 6,
        name: "Pas d'Ombre",
        bloodCost: 9,
        duration: "instant",
        description: "Tu peux entrer dans n'importe quelle ombre et ressortir instantanément par une autre, n'importe où à portée de vue (ou plus loin selon ta puissance). C'est une téléportation immédiate via l'Abysse. Tu ne traverses pas l'espace, tu le contournes par les ténèbres."
      },
      {
        level: 8,
        name: "Éclipser le Soleil",
        bloodCost: 10,
        duration: "scene",
        description: "Le rêve ultime du clan Lasombra. Tu craches des ténèbres si massives qu'elles montent au ciel et obscurcissent le soleil lui-même sur toute une région. Le jour devient nuit. Les vampires peuvent marcher dehors à midi sous ta protection. C'est un acte de guerre contre Dieu."
      }
    ]
  },

  thaumaturgy: {
    id: "thaumaturgy",
    name: "Thaumaturgie",
    description: "Le sang est pouvoir, et tu en es le maître. La magie des Tremere plie la vitae à ta volonté, transformant le sang en arme.",
    powers: [
      {
        level: 1,
        name: "Goût du Sang",
        bloodCost: 0,
        duration: "instant",
        description: "Une seule goutte sur ta langue et les secrets se révèlent. Goûte le sang de quelqu'un et tu sais instantanément : vampire ou mortel, quel clan, quelle génération, combien de fois il s'est nourri récemment. Si c'est un vampire, tu sens s'il a commis la diablerie, ce crime ultime qui laisse une trace indélébile dans la vitae. Tu peux analyser le sang d'une scène de crime pour identifier le coupable, vérifier l'identité d'un suspect, ou détecter un imposteur. Le sang parle, et toi seul l'entends."
      },
      {
        level: 2,
        name: "Rage du Sang",
        bloodCost: 1,
        duration: "scene",
        description: "Pointe du doigt quelqu'un à distance de regard et concentre-toi. Son sang commence à chauffer, à bouillonner dans ses veines. La victime ressent une douleur atroce, comme si son corps brûlait de l'intérieur. Les mortels s'effondrent en hurlant, les vampires luttent contre la frénésie tandis que leur vitae se rebelle. La douleur est si intense qu'elle empêche toute concentration, tout mouvement coordonné. Paralyse un adversaire le temps de fuir, torture un prisonnier sans le toucher, ou force un vampire à dépenser sa précieuse vitae pour résister."
      },
      {
        level: 3,
        name: "Puissance du Sang",
        bloodCost: 3,
        duration: "scene",
        description: "Concentre ta vitae par un rituel rapide, forçant le pouvoir de ton sang à irriguer tes muscles, tes réflexes, ta résistance. Tant que tu maintiens cet état, tu deviens plus fort, plus rapide, plus résistant qu'aucun vampire de ton âge ne devrait l'être. Combats comme un Ancien alors que tu n'es qu'un néonate, accomplis des exploits physiques impossibles. Le prix ? Ta vitae brûle vite : 3 points par tour de maintien, te laissant affaibli et affamé quand l'effet se dissipe. Mais ces moments de puissance surnaturelle peuvent faire la différence entre la victoire et la destruction."
      },
      {
        level: 4,
        name: "Vol de Vitae",
        bloodCost: 3,
        duration: "instant",
        description: "Tends la main vers une victime visible et invoque le sortilège. Son sang répond à ton appel, jaillissant de ses yeux, son nez, sa bouche, même à travers sa peau. La vitae vole à travers l'air en un jet écarlate pour se déverser dans ta bouche ouverte, ou dans un calice que tu tiens. C'est violent, spectaculaire, terrifiant : la victime se vide littéralement sous tes yeux tandis que tu te nourris à distance. Pas besoin de toucher, pas besoin de mordre. Le sang vient à toi. Les mortels meurent en quelques secondes, les vampires entrent en torpeur, vidés de leur vitae."
      },
      {
        level: 5,
        name: "Chaudron de Sang",
        bloodCost: 9,
        duration: "instant",
        description: "Le sort le plus meurtrier de la Thaumaturgie. Fixe ta victime et prononce la formule. Son sang atteint le point d'ébullition instantanément. De l'intérieur, le corps explose : le sang bout, la chair se déchire, les os se fissurent sous la pression. Les mortels éclatent littéralement, leurs veines explosant dans une fontaine de sang et de vapeur. Les vampires hurlent et s'effondrent, leur corps se consumant de l'intérieur en dégâts aggravés massifs. Même les Anciens craignent ce pouvoir. Un seul mot, un seul geste, et ton ennemi se transforme en torche vivante de sang bouillonnant."
      }
    ]
  },

  vicissitude: {
    id: "vicissitude",
    name: "Vicissitude",
    description: "Chair et os sont ton argile, la forme humaine juste une suggestion. Sculpte la viande vivante selon ta vision tordue.",
    powers: [
      {
        level: 1,
        name: "Modelage Mineur",
        bloodCost: 1,
        duration: "permanent",
        description: "Touche ton visage et la chair répond, malléable sous tes doigts comme de la cire chaude. Change la forme de ton nez, la couleur de tes yeux, la structure de ta mâchoire. Deviens plus beau, plus ordinaire, ou grotesque selon tes besoins. Les changements sont permanents jusqu'à ce que tu les modifies à nouveau. Efface les cicatrices, change ton apparence pour échapper aux poursuivants, ou crée un déguisement parfait. La transformation est lente, méthodique, presque artistique. Les Tzimisce voient cela comme de la sculpture vivante, l'expression ultime de la domination sur la chair."
      },
      {
        level: 2,
        name: "Sculpture de Chair",
        bloodCost: 1,
        duration: "permanent",
        description: "Pose tes mains sur la peau nue de quelqu'un d'autre et modèle sa chair comme de l'argile. Déforme son visage, allonge ses membres, crée des bosses et des creux. Les victimes non consentantes hurlent pendant que tu les remodèles, sentant leur chair se tordre et se reformer. Tu peux créer de la beauté ou de l'horreur : embellir un serviteur fidèle, ou transformer un ennemi en aberration défigurée. Les changements sont permanents. Les Tzimisce punissent souvent les traîtres en les transformant en monstruosités, des avertissements vivants pour les autres."
      },
      {
        level: 3,
        name: "Sculpture d'Os",
        bloodCost: 3,
        duration: "permanent",
        description: "Maintenant tu maîtrises le squelette. Fais jaillir des pointes d'os de tes mains comme des lames, crée des plaques osseuses sous ta peau comme une armure naturelle, déforme les os de tes victimes pour les paralyser ou les déformer de façon grotesque. Tu peux façonner des armes vivantes : des griffes d'os en spirale, des cornes sur ton crâne, des épines le long de ta colonne vertébrale. Ou torture tes ennemis en faisant pousser leurs os dans de mauvaises directions, créant des angles impossibles qui déchirent leur chair de l'intérieur."
      },
      {
        level: 4,
        name: "Forme Horrible",
        bloodCost: 3,
        duration: "scene",
        description: "Libère le monstre en toi. Ton corps se tord dans une transformation agonisante : tu grandis jusqu'à 2m50, ta peau devient noire et cireuse, des plaques d'os jaillissent pour former une armure naturelle, tes doigts s'allongent en griffes dentelées, ta mâchoire se déforme en gueule pleine de crocs. Tu deviens la Bête incarnée, une créature de cauchemar conçue pour le carnage. Ta force et ta résistance augmentent drastiquement. Les mortels fuient en hurlant, même les vampires reculent. Tu es devenu le monstre que les enfants craignent dans le noir."
      },
      {
        level: 5,
        name: "Forme de Sang",
        bloodCost: 9,
        duration: "scene",
        description: "Dissous complètement ton corps en une flaque de vitae sentiente, une mare de sang qui pense et bouge. Tu t'étales sur le sol, te coules sous les portes, à travers les grilles, dans les fissures. Sous cette forme, tu es presque invulnérable aux dégâts physiques : les balles font juste des éclaboussures, les lames te traversent sans effet. Tu peux t'étaler pour couvrir une large zone, ou te concentrer en un petit point. Engloutis un adversaire, le noyant dans ta substance, ou infiltre-toi dans des lieux impossibles. Seuls le feu et le soleil peuvent te blesser sous cette forme - et le soleil reste mortel, évaporant ta vitae comme l'eau d'une flaque. Tu es devenu l'essence même de la monstruosité vampirique."
      },
      {
        level: 6,
        name: "Maraudeur Chiroptère",
        bloodCost: 3,
        duration: "scene",
        description: "Tu ne te transformes pas en chauve-souris, mais en un homme-chauve-souris grotesque et létal. Tes os se creusent, des ailes membraneuses poussent de tes flancs, tes sens deviennent sonar. Tu es le prédateur aérien parfait, capable de voler à vitesse transsonique et de décapiter une proie au passage."
      },
      {
        level: 7,
        name: "Cocon",
        bloodCost: 5,
        duration: "prolonged",
        description: "Tu sécrètes des fluides qui durcissent pour former une coque blanche impénétrable autour de toi. À l'intérieur, tu es en sécurité absolue, protégé même du soleil ou du feu pendant un temps. C'est l'ultime refuge pour guérir, hiberner, ou survivre à une explosion nucléaire."
      }
    ]
  },

  necromancy: {
    id: "necromancy",
    name: "Nécromancie : La Voie des Os",
    description: "Les morts sont des outils. La chair est une ressource. L'âme est une pile.",
    powers: [
      {
        level: 1,
        name: "Tremens",
        bloodCost: 0,
        duration: "instant",
        description: "Tu murmures aux cadavres et ils tressaillent. Tu peux faire bouger un corps inanimé un court instant : une main qui se serre, des yeux qui s'ouvrent brusquement, un doigt qui pointe. Suffisant pour terrifier des intrus ou faire lâcher un objet à un mort que l'on fouille."
      },
      {
        level: 2,
        name: "Balais de l'Apprenti",
        bloodCost: 1,
        duration: "scene",
        description: "Tu insuffles une animation basique dans un cadavre. Il se lève et peut effectuer des tâches simples : creuser, porter des caisses, marcher devant pour déclencher les pièges. Il n'a aucune intelligence, ne sait pas se battre, mais il obéira jusqu'à ce qu'il tombe en poussière. La main d'œuvre parfaite."
      },
      {
        level: 3,
        name: "Hordes Chancelantes",
        bloodCost: 1,
        duration: "permanent",
        description: "Tu deviens un véritable seigneur des morts. Tu peux lever des cadavres pour le combat. Ils sont lents et stupides, mais ils gardent la force qu'ils avaient de leur vivant. Lève un soldat d'élite, et tu auras un tueur ; lève un enfant, et tu auras une distraction. Ils n'ont ni peur ni douleur et avanceront sous les balles pour déchirer tes ennemis. Une armée jetable qui ne pose jamais de questions."
      },
      {
        level: 4,
        name: "Vol d'Âme",
        bloodCost: 1,
        duration: "scene",
        description: "Ton pouvoir s'étend aux vivants. Tu peux, par un effort de volonté, arracher l'âme d'un mortel de son corps. Le corps s'effondre comme une poupée de chiffon, vivant mais vide, tandis que l'esprit se retrouve projeté hors de sa chair, errant sans défense, à la merci des spectres... ou de toi."
      },
      {
        level: 5,
        name: "Possession Démoniaque",
        bloodCost: 3,
        duration: "permanent",
        description: "L'art ultime. Tu prends une âme errante (ou la tienne) et tu l'enfonces de force dans un cadavre frais. Le corps se réveille, non pas comme un zombie stupide, mais avec toute l'intelligence et la rapidité de l'esprit qui l'habite. Tu crées un serviteur parfait : l'agilité et l'esprit d'un vivant dans un corps mort qui ne craint pas la douleur."
      }
    ]
  },

  quietus: {
    id: "quietus",
    name: "Quietus",
    description: "Tu es l'assassin silencieux, juge et bourreau. Ton sang est poison, ta présence est la mort qui ne fait aucun bruit.",
    powers: [
      {
        level: 1,
        name: "Silence de la Mort",
        bloodCost: 1,
        duration: "scene",
        description: "Active ce pouvoir et une bulle de silence absolu t'enveloppe. Aucun son ne peut entrer ou sortir : tes pas sont inaudibles, tes armes ne font aucun bruit, les cris de tes victimes sont étouffés avant même de quitter leur gorge. Tue en plein milieu d'une foule sans que personne n'entende, brise une fenêtre sans un tintement, tire une arme sans détonation. Les autres te voient bouger les lèvres sans entendre un mot. C'est l'arme parfaite de l'assassin : dans le silence, tu es mortel, fantôme parmi les vivants."
      },
      {
        level: 2,
        name: "Toucher du Scorpion",
        bloodCost: 1,
        duration: "prolonged",
        description: "Concentre ta vitae et transforme-la en poison mortel. Quelques gouttes de ton sang suffisent : enduis une lame, verse-le dans un verre, ou mêle-le à de la nourriture. Quand la victime absorbe le poison, son corps se paralyse progressivement, ses muscles se figent, sa respiration devient laborieuse. Les mortels s'effondrent, incapables de bouger. Les vampires luttent, mais leur corps trahit aussi. Le poison dure plusieurs heures, laissant la victime consciente mais totalement impuissante. Parfait pour capturer quelqu'un vivant ou le laisser mourant mais conscient de son sort."
      },
      {
        level: 3,
        name: "Appel de Dagon",
        bloodCost: 3,
        duration: "concentration",
        description: "Fixe ta victime et invoque le pouvoir. Son sang se rebelle, remontant dans sa gorge comme une marée rouge. Elle s'étouffe sur son propre sang, crachant, suffoquant, incapable de respirer. Les mortels se noient de l'intérieur en quelques minutes atroces. Les vampires toussent de la vitae, affaiblis et paniqués. C'est silencieux, horrible, et terriblement efficace. La victime meurt sans une marque extérieure, juste du sang coulant de sa bouche et son nez. L'arme parfaite pour un meurtre qui ressemble à une mort naturelle."
      },
      {
        level: 4,
        name: "Caresse de Baal",
        bloodCost: 3,
        duration: "instant",
        description: "Ton sang devient acide corrosif au contact de l'air. Ouvre une veine et ton sang jaillit, brûlant tout ce qu'il touche comme de l'acide concentré. La peau se dissout, le métal se corrode, le bois fume et se décompose. Asperge un ennemi et regarde sa chair se consumer. Utilise-le pour détruire des preuves, dissoudre des serrures, ou torturer des victimes. Même les autres vampires hurlent quand ton sang acide les brûle, infligeant des dégâts aggravés qui ne guérissent pas facilement. Mais attention : chaque utilisation te coûte de la précieuse vitae."
      },
      {
        level: 5,
        name: "Goût de la Mort",
        bloodCost: 9,
        duration: "instant",
        description: "Le pouvoir ultime du Quietus. Crache ton sang comme un serpent crache son venin. Un jet d'acide écarlate jaillit de ta bouche, traversant plusieurs mètres pour frapper ta cible. Tout ce que le jet touche se consume : chair, os, vêtements, métal. Les victimes hurlent pendant que l'acide les dévore vivantes, leur corps se dissolvant en fumée toxique. C'est spectaculaire, brutal, définitif. Les Assamites utilisent ce pouvoir comme jugement final, une exécution qui ne laisse presque rien de la victime. Ton sang est devenu l'incarnation de la mort elle-même."
      },
      {
        level: 6,
        name: "Ondes du Cœur",
        bloodCost: 9,
        duration: "instant",
        description: "Tu manipules le flux sanguin pour provoquer des émotions violentes ou des arrêts cardiaques à distance. En synchronisant ta vitae avec celle de ta cible, tu peux faire exploser son cœur dans sa poitrine ou la submerger d'une panique physiologique incontrôlable."
      }
    ]
  },

  serpentis: {
    id: "serpentis",
    name: "Serpentis",
    description: "Le serpent du jardin coule dans tes veines. Tentation, transformation, et l'impossible don d'échapper à la mort du pieu.",
    powers: [
      {
        level: 1,
        name: "Regard Hypnotique",
        bloodCost: 1,
        duration: "scene",
        description: "Fixe quelqu'un dans les yeux. Tes pupilles deviennent verticales, reptiliennes, captivantes. La victime est paralysée, incapable de détourner le regard, son esprit pris dans un piège hypnotique. Elle reste debout, consciente mais totalement sans défense, fascinée par le prédateur qu'elle voit en toi. Tu peux bouger autour d'elle, lui parler, même la toucher sans briser le charme. Le contact visuel rompu, elle cligne des yeux, désorientée. Parfait pour neutraliser un adversaire sans violence, ou pour t'approcher d'une proie sans alarme."
      },
      {
        level: 2,
        name: "Langue du Serpent",
        bloodCost: 0,
        duration: "scene",
        description: "Ta langue s'allonge hors de ta bouche, devenant un appendice fourchu de près d'un mètre, couvert d'écailles et étonnamment fort. Utilise-la comme un bras supplémentaire : saisis des objets hors de portée, fouette-la comme un fouet pour frapper ou désarmer, ou goûte l'air pour suivre une piste comme un serpent. Tu peux aussi l'utiliser pendant le baiser, ta langue serpentine glissant dans la plaie pour aspirer le sang plus efficacement. C'est perturbant, alien, et terriblement pratique. La langue se rétracte instantanément quand tu le désires."
      },
      {
        level: 3,
        name: "Peau de Vipère",
        bloodCost: 0,
        duration: "scene",
        description: "Ta peau se transforme, développant des écailles dures et brillantes comme celles d'un python. Ces écailles forment une armure naturelle qui dévie les lames, ralentit les balles, absorbe les coups. Ta peau devient difficile à percer, résistante aux coupures. Les écailles peuvent être de n'importe quelle couleur : vert sombre, noir brillant, même des motifs complexes. Tu peux choisir de ne transformer qu'une partie de ton corps ou de te couvrir entièrement. Sous cette forme, tu ressembles à un hybride homme-reptile, beau et terrible à la fois."
      },
      {
        level: 4,
        name: "Forme du Cobra",
        bloodCost: 3,
        duration: "scene",
        description: "Ton corps se liquéfie et se reforme en un serpent massif de 3 à 4 mètres de long : un cobra royal, un python, ou une vipère géante. Tu gardes ton intelligence et ta conscience, mais gains les sens du serpent : vision thermique, détection des vibrations, et bien sûr des crocs venimeux. Glisse-toi dans des espaces impossibles, grimpe les murs avec aisance, ou frappe avec une vitesse surhumaine. Ton venin est mortel pour les mortels, paralysant pour les vampires. Tu peux aussi mordre pour te nourrir sous cette forme, ton morsure serpentine étant plus discrète qu'une morsure humaine."
      },
      {
        level: 5,
        name: "Cœur des Ténèbres",
        bloodCost: 9,
        duration: "permanent",
        description: "Le rituel le plus étrange du Serpentis. Plonge ta main dans ta propre poitrine et arrache ton cœur. Il bat toujours dans ta paume, noir et luisant. Tu peux le cacher n'importe où : enterré, dans un coffre, au fond d'un lac. Tant que ton cœur est séparé de ton corps, tu es immunisé au pieu dans la poitrine - il n'y a rien à embrocher. Tu deviens extrêmement difficile à détruire définitivement. Mais attention : si quelqu'un trouve ton cœur caché et le détruit, tu meurs instantanément, où que tu sois. Ce pouvoir est la liberté ultime, ou la vulnérabilité ultime, selon qui détient ton cœur."
      },
      {
        level: 6,
        name: "Obsession",
        bloodCost: 9,
        duration: "prolonged",
        description: "Tu deviens l'unique objet de désir et de pensée de ta victime. Elle ne peut plus manger, dormir ou penser à autre chose qu'à toi. Cette obsession divine la consume, la poussant à tout sacrifier pour un regard de ta part. C'est une dévotion qui mène à la folie et à la mort."
      },
      {
        level: 7,
        name: "Forme de l'Orage",
        bloodCost: 9,
        duration: "scene",
        description: "Ton corps se dissout non pas en brume, mais en nuage d'orage sombre et crépitant. Tu deviens une tempête localisée, capable de lancer des éclairs, de générer des vents violents et de te mouvoir à la vitesse de la foudre. Tu es intouchable et dévastateur."
      }
    ]
  },

  dementation: {
    id: "dementation",
    name: "Aliénation",
    description: "La folie est contagieuse, et tu es le vecteur. Dans ton sillage, les esprits se brisent comme du verre.",
    powers: [
      {
        level: 1,
        name: "Passion",
        bloodCost: 1,
        duration: "prolonged",
        description: "Touche quelqu'un ou parle-lui brièvement, et tords le cadran de ses émotions. Amplifie sa colère jusqu'à la rage, sa tristesse jusqu'au désespoir, sa joie jusqu'à l'euphorie maniaque, ou sa peur jusqu'à la terreur paralysante. L'émotion choisie submerge toute raison : le garde en colère abandonne son poste pour régler ses comptes, le rival déprimé rentre chez lui en pleurant, l'informateur nerveux panique et fuit. L'effet dure plusieurs heures, le laissant confus quant à la raison de ses actions. C'est subtil, mais dévastateur pour l'équilibre mental."
      },
      {
        level: 2,
        name: "Hantise",
        bloodCost: 1,
        duration: "prolonged",
        description: "Plonge ton regard dans le sien et implante une phobie ou une obsession dans les profondeurs de son esprit. Crée une peur irrationnelle : phobie des espaces clos, terreur des oiseaux, conviction que les miroirs cachent quelque chose de terrible. Ou implante une obsession : compter compulsivement, vérifier les serrures sans fin, paranoïa que tout le monde complote contre lui. La victime sait que c'est irrationnel, mais ne peut pas s'en empêcher. La hantise dure des semaines ou des mois, rongeant lentement la santé mentale. Un outil parfait pour détruire quelqu'un sans le toucher."
      },
      {
        level: 3,
        name: "Yeux du Chaos",
        bloodCost: 0,
        duration: "scene",
        description: "Ta folie devient une lentille qui révèle les patterns cachés de l'univers. Regarde une scène et tu vois les connections invisibles : cette personne va trahir dans dix minutes, ce fil tenu fera tomber tout l'édifice, cette parole déclenchera la violence. Tu perçois l'ordre dans le chaos, les failles dans les plans, les faiblesses cachées. Anticipe les comportements, trouve l'incohérence dans un mensonge, vois la solution que la logique ne peut pas trouver. Mais attention : voir trop de patterns mène à la vraie folie. Les Malkaviens appellent ça 'la sagesse du fou'."
      },
      {
        level: 4,
        name: "Voix de la Folie",
        bloodCost: 3,
        duration: "prolonged",
        description: "Parle à quelqu'un et laisse ta démence s'infiltrer dans tes mots comme un virus. Quelques phrases suffisent, prononcées dans un murmure ou un cri : 'Les murs ont des yeux', 'Ils viennent tous pour toi', 'Tu n'es pas réel'. L'esprit de la victime s'effondre instantanément. Elle sombre dans une folie complète : hallucinations, paranoïa délirante, catatonie, ou violence irrationnelle. Mortels et vampires sont affectés. L'effet dure quelques heures, la laissant ravagée et traumatisée. Certains ne s'en remettent jamais complètement."
      },
      {
        level: 5,
        name: "Démence Totale",
        bloodCost: 9,
        duration: "permanent",
        description: "Le pouvoir ultime de l'Aliénation. Touche quelqu'un et fracture définitivement son esprit en milliers de fragments. Sa psyché se brise comme un miroir, créant une psychose permanente et profonde. La victime développe des personnalités multiples, des hallucinations constantes, une dissociation complète de la réalité. Elle ne guérira jamais, même avec des années de thérapie. Les mortels finissent internés, les vampires deviennent dangereux et imprévisibles. C'est un destin pire que la mort : une éternité prisonnière d'un esprit brisé. Les Malkaviens utilisent ce pouvoir rarement, car c'est partager leur propre malédiction avec un autre."
      },
      {
        level: 6,
        name: "Malaise Persistant",
        bloodCost: 9,
        duration: "permanent",
        description: "Tu ne te contentes pas de provoquer une émotion passagère, tu infectes l'âme. La victime développe une maladie mentale permanente : dépression suicidaire, manie furieuse, schizophrénie. Aucun traitement ne peut la guérir. Tu as brisé quelque chose de fondamental en elle."
      },
      {
        level: 7,
        name: "Restructuration",
        bloodCost: 9,
        duration: "permanent",
        description: "Tu peux réécrire la personnalité de quelqu'un comme on réécrit un livre. Change ses convictions, ses amours, sa nature profonde. Transforme un saint en tueur en série, ou un lâche en héros, juste en tordant les connexions de son esprit. La victime devient une personne entièrement nouvelle, selon ton design."
      }
    ]
  },

  chimerstry: {
    id: "chimerstry",
    name: "Chimérie",
    description: "La réalité est malléable pour ceux qui savent voir. Tisse des mensonges si convaincants que le monde lui-même y croit.",
    powers: [
      {
        level: 1,
        name: "Ignis Fatuus",
        bloodCost: 1,
        duration: "scene",
        description: "Crée une illusion simple affectant un seul sens. Fais apparaître une image : un visage dans la foule, un mur où il n'y a qu'un couloir, une silhouette menaçante dans l'ombre. Ou crée un son : des pas derrière quelqu'un, une voix appelant au secours, le clic d'une arme qu'on arme. Ou même une odeur : fumée d'incendie, parfum distinctif, odeur de cadavre. L'illusion est statique, comme une photographie ou un enregistrement en boucle, mais parfaitement convaincante pour le sens ciblé. Crée des distractions, sème la confusion, ou fais croire à une menace inexistante."
      },
      {
        level: 2,
        name: "Fata Morgana",
        bloodCost: 1,
        duration: "scene",
        description: "Maintenant tes illusions sont complètes : vue, son, odeur, même le toucher superficiel. Crée un mur solide en apparence, une personne convaincante qui respire et dégage de la chaleur, un feu qui crépite et sent la fumée. Les victimes peuvent toucher tes illusions et sentir de la résistance (mais pas de poids réel). Fais apparaître un ennemi pour détourner l'attention, crée un obstacle pour bloquer une poursuite, ou conjure un alibi visuel. L'illusion reste statique, mais elle est si détaillée que la tromper tous les sens à la fois."
      },
      {
        level: 3,
        name: "Apparition",
        bloodCost: 3,
        duration: "scene",
        description: "Tes illusions prennent vie. Elles bougent, réagissent, interagissent de manière autonome selon des paramètres que tu définis. Crée un garde illusoire qui patrouille, un double de toi-même qui marche dans une direction pendant que tu files dans une autre, un monstre qui poursuit tes ennemis. Les illusions suivent des routines simples ou répondent à des déclencheurs : attaquer celui qui entre, fuir si on lui tire dessus, converser de manière basique. Elles semblent vivantes, pensantes, réelles. Seul un examen très attentif ou des sens surnaturels peuvent révéler la supercherie."
      },
      {
        level: 4,
        name: "Permanence",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tes illusions persistent maintenant sans que tu aies besoin de te concentrer. Crée une scène complète - un bureau luxueux, un mur de briques cachant un passage secret, un cadavre sanglant - et elle reste en place pendant des heures ou des jours, même quand tu es parti. Tu peux créer des repaires illusoires, des preuves de crimes qui n'ont jamais eu lieu, des personnes qui continuent leur vie apparente. Les illusions ne disparaissent que si tu le décides, si quelqu'un les détruit (révélant le vide dessous), ou après plusieurs jours. Tu peux maintenir plusieurs illusions permanentes simultanément."
      },
      {
        level: 5,
        name: "Réalité Illusoire",
        bloodCost: 9,
        duration: "scene",
        description: "La frontière entre illusion et réalité s'efface. Tes créations deviennent horriblement réelles pour ceux qui y croient. Le feu illusoire brûle vraiment, la balle illusoire blesse vraiment, le mur illusoire arrête vraiment - mais seulement pour ceux qui sont convaincus. Si tu crois que le feu te consume, ton corps développe de vraies brûlures psychosomatiques. Si tu crois que l'assassin t'a poignardé, tu saignes. Les dégâts sont réels, potentiellement mortels. Mais si quelqu'un réalise la supercherie, l'illusion perd son pouvoir sur lui. C'est la réalité façonnée par la croyance, le mensonge ultime qui devient vérité."
      },
      {
        level: 6,
        name: "Maîtrise du Fatuus",
        bloodCost: 9,
        duration: "prolonged",
        description: "Tes illusions n'ont plus besoin d'entretien. Tu les poses dans le monde et elles y restent, évoluant et changeant dynamiquement sans ton attention constante. Tu peux peupler un château vide de serviteurs illusoires qui vivront leur fausse vie éternellement."
      }
    ]
  },

  flight: {
    id: "flight",
    name: "Vol",
    description: "Tes ailes ne sont pas décoratives. Tu apprends à maîtriser cette anatomie monstrueuse pour conquérir le ciel.",
    powers: [
      {
        level: 1,
        name: "Plume",
        bloodCost: 0,
        duration: "permanent",
        description: "Tes ailes sont encore faibles pour le vol réel, mais tu sais instinctivement les utiliser pour freiner une chute. Peu importe la hauteur, tu atterris avec la légèreté d'une plume, sans bruit et sans dégâts. Tu peux aussi faire des bonds prodigieux, tes ailes te donnant une portance supplémentaire."
      },
      {
        level: 2,
        name: "Planer",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu as appris à lire les courants d'air invisibles. Lance-toi d'un point élevé et tu peux planer sur de longues distances, silencieux comme une chouette. Tu ne peux pas encore gagner de l'altitude, mais tu peux traverser la ville de toit en toit sans jamais toucher le sol."
      },
      {
        level: 3,
        name: "Ailes de Nuit",
        bloodCost: 1,
        duration: "scene",
        description: "Tes muscles dorsaux sont enfin assez puissants. Tu peux décoller du sol par ta seule force et voler réellement. Ton vol est peut-être lourd et bruyant au début, mais le ciel t'appartient désormais. Tu peux faire du surplace, effectuer des virages serrés, et fondre sur tes proies depuis les airs."
      },
      {
        level: 4,
        name: "Vol Supersonique",
        bloodCost: 1,
        duration: "scene",
        description: "Tu ne voles plus, tu files. Tu deviens un missile vivant, capable d'atteindre des vitesses qui rivalisent avec les véhicules modernes. Le vent hurle à tes oreilles, la ville défile floue sous tes yeux. Idéal pour les interceptions, les fuites éclairs, ou pour frapper avec une énergie cinétique dévastatrice."
      },
      {
        level: 5,
        name: "Maître du Ciel",
        bloodCost: 3,
        duration: "scene",
        description: "Les lois de l'aérodynamisme ne s'appliquent plus à toi. Vole par tempête majeure, porte des charges lourdes (comme un autre vampire en armure) sans ralentir, effectue des manœuvres impossibles à angle droit. Tu es le prédateur ultime des cieux, plus agile qu'un oiseau, plus rapide qu'une chauve-souris."
      }
    ]
  },

  visceratika: {
    id: "visceratika",
    name: "Visceratika",
    description: "Tu es la sentinelle de la pierre. Tu ne fais qu'un avec le bâtiment que tu protèges, partageant sa solidité et ses secrets.",
    powers: [
      {
        level: 1,
        name: "Peau de Caméléon",
        bloodCost: 1,
        duration: "scene",
        description: "En restant immobile contre une surface minérale (pierre, brique, béton), ta peau en adopte instantanément la couleur et la texture. Tu deviens quasiment invisible, une simple protubérance architecturale. Tant que tu ne bouges pas, il faut des sens surnaturels pour te distinguer de la pierre. La cachette parfaite pour une embuscade ou une surveillance."
      },
      {
        level: 2,
        name: "Cœur de Pierre",
        bloodCost: 1,
        duration: "scene",
        description: "Tu entres en communion avec le bâtiment. En touchant un mur, tu perçois tout ce qui se passe à l'intérieur de la structure : les pas dans les couloirs, les portes qui s'ouvrent, les battements de cœur des intrus. Le bâtiment devient une extension de ton propre corps sensoriel. Tu sais exactement où se trouve l'ennemi dans 'ton' territoire."
      },
      {
        level: 3,
        name: "Lien avec la Montagne",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu peux fusionner physiquement avec la pierre. Comme le pouvoir de Protéisme avec la terre, mais avec la roche ou le béton. Tu t'enfonces dans un mur ou un sol et y disparais. C'est le refuge ultime pour passer la journée ou échapper à un combat qui tourne mal. Tu es conscient de ton environnement immédiat, mais intouchable tant que la pierre n'est pas détruite."
      },
      {
        level: 4,
        name: "Armure de la Terre",
        bloodCost: 3,
        duration: "scene",
        description: "Ta peau ne fait pas que ressembler à la pierre, elle en acquiert la dureté. Tu deviens une statue vivante. Ta résistance aux dégâts augmente considérablement, surtout contre le feu qui glisse sur toi comme sur du granit. Contrairement à la Force d'Âme, cette protection est visible : ta peau devient grise et craquelée, tes mouvements produisent un bruit de frottement minéral."
      },
      {
        level: 5,
        name: "Couler dans la Montagne",
        bloodCost: 3,
        duration: "scene",
        description: "La pierre n'est plus un obstacle. Tu peux traverser les murs, les plafonds et les sols en pierre ou béton comme s'ils étaient de la fumée. Tu marches à travers les défenses d'un bunker, tu traverses un immeuble de part en part en ligne droite. Tu peux même emmener quelqu'un avec toi si tu le tiens, ou tirer un ennemi à moitié dans un mur et le laisser là, solidifié."
      },
      {
        level: 6,
        name: "Cœur de Roche",
        bloodCost: 9,
        duration: "scene",
        description: "Ton corps devient dur comme le granit. Ce n'est plus seulement une armure extérieure, c'est une transmutation de ta chair en pierre vivante. Les dégâts contondants et tranchants sont divises par deux (arrondi à l'inférieur) avant même de calculer l'encaissement."
      },
      {
        level: 7,
        name: "Nager dans la Montagne",
        bloodCost: 9,
        duration: "scene",
        description: "Tu ne fais pas que traverser la pierre, tu y nages avec aisance et rapidité, totalement indétectable. Tu peux rester immergé indéfiniment, te déplacer à ta vitesse de course, et surprendre tes ennemis en surgissant du sol ou du plafond. Tant que tu es dans la pierre, tu es immunisé à presque toutes les attaques."
      }
    ]
  },

  thanatosis: {
    id: "thanatosis",
    name: "Thanatosis",
    description: "La mort n'est pas une fin, c'est une arme.",
    powers: [
      {
        level: 1,
        name: "Rides de la Sorcière",
        bloodCost: 0,
        duration: "scene",
        description: "Ta chair morte est comme de la pâte à modeler. Tu peux creuser des rides, créer des cicatrices, ou étirer ta peau pour changer de visage. Tu peux aussi créer des poches secrètes dans ton propre corps, glissant un objet sous un pli de peau qui se referme sans trace. Le déguisement grotesque parfait."
      },
      {
        level: 2,
        name: "Putrescence",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu forces le cycle naturel de la décomposition sur autrui. D'un simple contact ou regard concentré, la chair de ta victime commence à se gâter. La peau se couvre de pustules, les muscles s'atrophient, l'odeur devient insupportable. La victime perd sa beauté et sa force, rongée par une pourriture accélérée qui la fait souffrir le martyre."
      },
      {
        level: 3,
        name: "Cendres aux Cendres",
        bloodCost: 1,
        duration: "scene",
        description: "Pour échapper au danger, tu peux t'effondrer sur toi-même, te transformant instantanément en un tas de cendres ou de poussière visqueuse. Sous cette forme, tu es immobile mais invulnérable aux balles, aux couteaux et au feu. Tu peux rester ainsi des heures, tas de poussière conscient, attendant que la menace passe. Attention aux vents violents qui pourraient te disperser."
      },
      {
        level: 4,
        name: "Flétrissement",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu touches un membre et tu lui voles sa vitalité. Saisis un bras, et il se dessèche instantanément comme celui d'une momie millénaire, la peau collée à l'os, inutile. Touche une jambe, et elle se recroqueville, rendant la victime infirme. C'est une mutilation mystique terrifiante qui transforme les guerriers en vieillards impotents en quelques secondes."
      },
      {
        level: 5,
        name: "Nécrose",
        bloodCost: 3,
        duration: "instant",
        description: "Tu ordonnes à la mort de prendre ce qui lui appartient. En touchant une victime, tu provoques une décomposition massive et brutale de la zone. La chair noircit et tombe en lambeaux, l'os se désagrège. Ce n'est pas une mort instantanée propre, c'est une gangrène foudroyante qui dévore un torse ou arrache un visage, laissant la victime hurler dans une agonie absolue."
      }
    ]
  },

  melpominee: {
    id: "melpominee",
    name: "Melpominée",
    description: "La musique n'adoucit pas les mœurs, elle les contrôle.",
    powers: [
      {
        level: 1,
        name: "La Voix Manquante",
        bloodCost: 0,
        duration: "scene",
        description: "Tu deviens le ventriloque ultime. Tu peux projeter ta voix pour qu'elle semble venir de n'importe où : d'un coin sombre, de derrière une porte, ou même de la gorge de quelqu'un d'autre. Une phrase chuchotée à l'oreille d'un garde depuis l'autre bout de la pièce, un ordre crié par le capitaine qui n'a pourtant pas ouvert la bouche. La confusion est ton premier instrument."
      },
      {
        level: 2,
        name: "Le Murmure Fantôme",
        bloodCost: 1,
        duration: "scene",
        description: "La matière n'arrête plus tes paroles. Tu peux parler à travers les murs de pierre, chuchoter à une personne spécifique au milieu d'une foule bruyante sans que personne d'autre n'entende, ou tenir trois conversations différentes simultanément. Ta voix ignore les obstacles physiques pour atteindre directement l'oreille de ta cible."
      },
      {
        level: 3,
        name: "Madrigal",
        bloodCost: 1,
        duration: "scene",
        description: "Ton chant tisse des émotions pures. Tu ne manipules pas l'esprit, tu touches l'âme. Une mélodie mélancolique peut faire pleurer une armée, un hymne guerrier transformer des lâches en berserkers. L'émotion que tu chantes devient la réalité de tous ceux qui t'écoutent, balayant leur propre état d'esprit comme un fétu de paille."
      },
      {
        level: 4,
        name: "Le Chant de la Sirène",
        bloodCost: 1,
        duration: "scene",
        description: "Ta voix capture l'esprit. Tant que tu chantes, ceux qui t'écoutent sont piégés dans une transe hypnotique, incapables de détacher leur attention de toi. Ils oublient le danger, le devoir, la soif. Ils sont spectateurs de ta performance, marionnettes suspendues à tes lèvres, prêts à se laisser mourir de faim plutôt que de manquer une note."
      },
      {
        level: 5,
        name: "Virtuose",
        bloodCost: 3,
        duration: "instant",
        description: "Ta voix atteint des fréquences qui déchirent la réalité. Tu peux chanter une note si pure et si puissante qu'elle devient une arme physique. Brise les os d'un homme à dix mètres, fais éclater le verre d'un immeuble entier, ou liquéfie les organes internes d'un ennemi par simple résonance. Tu es un orchestre de destruction, ta voix est un canon."
      },
      {
        level: 6,
        name: "Crescendo Brisé",
        bloodCost: 9,
        duration: "instant",
        description: "Un cri sonique dévastateur capable de briser la pierre et de liquéfier les os. Les dégâts sont massifs et couvrent une large zone conique devant le vampire. Les objets fragiles explosent instantanément."
      },
      {
        level: 7,
        name: "Écho Persistant",
        bloodCost: 9,
        duration: "prolonged",
        description: "Ton chant continue de résonner et d'affecter la zone longtemps après ton départ ou ton silence. L'effet émotionnel ou surnaturel de ta dernière chanson imprègne les lieux, affectant quiconque y entre pendant des heures."
      }
    ]
  },

  daimoinon: {
    id: "daimoinon",
    name: "Daimoinon",
    description: "La tentation est une arme, la corruption un art.",
    powers: [
      {
        level: 1,
        name: "Perception du Péché",
        bloodCost: 0,
        duration: "scene",
        description: "Ton regard perce l'âme d'autrui pour y dénicher la souillure. En te concentrant sur une personne, tu entends murmurer ses vices cachés, ses hontes secrètes, ses désirs inavouables. Tu sais instinctivement sur quel bouton appuyer pour la corrompre ou la briser. Il n'y a pas de saint, seulement des pécheurs qui s'ignorent."
      },
      {
        level: 2,
        name: "Peur du Vide",
        bloodCost: 1,
        duration: "instant",
        description: "Tu ouvres une fraction de seconde la porte de ton esprit vers les Abysses. Ceux qui croisent ton regard à cet instant voient l'horreur du néant infini, la vérité glaciale de l'enfer qui les attend. La terreur est si pure qu'elle paralyse, figeant le cœur des mortels et faisant reculer d'effroi même les vampires les plus anciens."
      },
      {
        level: 3,
        name: "Flammes de l'Enfer",
        bloodCost: 1,
        duration: "instant",
        description: "Tu invoques le feu maudit qui brûle au fond de ton âme. Des flammes d'un vert maladif ou d'un noir profond jaillissent de tes mains. Ce feu ne produit aucune chaleur naturelle mais consume la chair et l'esprit avec une voracité terrifiante, laissant des cicatrices que le temps peine à effacer. C'est le feu de la géhenne, répondant à ton appel."
      },
      {
        level: 4,
        name: "Psychomachia",
        bloodCost: 3,
        duration: "scene",
        description: "Tu donnes forme aux cauchemars. En puisant dans l'esprit de ta victime, tu forces ses peurs les plus intimes à se matérialiser dans le monde réel. Son reflet sort du miroir pour l'étrangler, les ombres prennent la forme de son père abusif. La victime affronte ses propres démons, littéralement, tandis que tu observes le spectacle."
      },
      {
        level: 5,
        name: "Résonance Infernale",
        bloodCost: 3,
        duration: "scene",
        description: "Tu deviens un diapason pour la corruption pure. Tu émettes une onde de choc spirituelle qui brise les volontés autour de toi. Les pieux deviennent cruels, les courageux lâches, les fidèles traîtres. L'atmosphère s'alourdit d'une pression insoutenable, et les esprits les plus faibles s'effondrent en hurlant ou cèdent à leurs pulsions les plus viles instantanément."
      },
      {
        level: 6,
        name: "Investiture Infernale",
        bloodCost: 9,
        duration: "permanent",
        description: "Un pacte sombre ou une harmonie parfaite avec tes démons intérieurs transforme ton corps. Tu gagnes des traits démoniaques permanents : des ailes membraneuses fonctionnelles, une peau écailleuse résistante au feu, ou des griffes brûlantes. Tu es devenu un avatar de l'enfer sur terre."
      }
    ]
  }
};

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
  giovanni: ["auspex", "fortitude", "necromancy"],
  setites: ["obfuscate", "presence", "serpentis"],
  assamites: ["celerity", "obfuscate", "quietus"],
  ravnos: ["animalism", "chimerstry", "fortitude"],
  gargoyles: ["flight", "fortitude", "potence", "visceratika"],
  samedi: ["fortitude", "obfuscate", "thanatosis"],
  daughters_of_cacophony: ["fortitude", "melpominee", "presence"],
  baali: ["daimoinon", "obfuscate", "presence"],
  // Caïn - Le Père des Vampires (MJ only) - Accès à TOUTES les disciplines
  cain: [
    "animalism", "auspex", "celerity", "chimerstry", "daimoinon",
    "dementation", "dominate", "flight", "fortitude", "melpominee",
    "necromancy", "obfuscate", "obtenebration", "potence", "presence",
    "protean", "quietus", "serpentis", "thaumaturgy", "thanatosis",
    "vicissitude", "visceratika"
  ]
};

// Niveau maximum de discipline selon la Puissance du Sang
export const MAX_DISCIPLINE_LEVEL = {
  1: 1,  // BP 1: accès au niveau 1
  2: 2,  // BP 2: accès aux niveaux 1-2
  3: 3,  // BP 3: accès aux niveaux 1-3
  4: 4,  // BP 4: accès aux niveaux 1-4
  5: 5,  // BP 5: accès aux niveaux 1-5
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10
};

/**
 * Récupère les disciplines disponibles pour un clan et un niveau de BP
 */
export function getAvailableDisciplines(clan, bloodPotency) {
  const clanLower = clan?.toLowerCase();

  // Safe validation check
  if (!CLAN_DISCIPLINES || !DISCIPLINES) {
    console.warn('CLAN_DISCIPLINES or DISCIPLINES missing');
    return [];
  }

  const clanDisciplineIds = CLAN_DISCIPLINES[clanLower] || [];

  // Determine Max Level
  let maxLevel = 1; // Default safe fallback

  if (bloodPotency) {
    if (bloodPotency > 10) {
      maxLevel = 10; // Cap at 10 (Methuselah/Antediluvian max standard)
    } else if (MAX_DISCIPLINE_LEVEL[bloodPotency]) {
      maxLevel = MAX_DISCIPLINE_LEVEL[bloodPotency];
    }
    // If bloodPotency is valid but not in map (e.g. 0 or negative), it stays 1 (safe minimum)
  }

  return clanDisciplineIds.map(disciplineId => {
    const discipline = DISCIPLINES[disciplineId];
    if (!discipline) return null;

    // Logic change: If maxLevel is high (Elder), we want to show all available powers up to that level.
    // However, if maxLevel is low (neonate), we STILL want to show 5 powers (some locked).
    // The previous logic filtered `power.level <= maxLevel`.
    // The new logic should filter `power.level <= Math.max(5, maxLevel)` to ensure at least 5 are returned.
    const visibleMax = maxLevel;

    return {
      ...discipline,
      powers: discipline.powers.filter(power => power.level <= visibleMax),
      maxLevel: maxLevel
    };
  }).filter(Boolean);
}

/**
 * Récupère toutes les disciplines (pour affichage admin/référence)
 */
export function getAllDisciplines() {
  if (!DISCIPLINES) {
    console.warn('DISCIPLINES object is missing!');
    return [];
  }
  return Object.values(DISCIPLINES);
}
