/**
 * Disciplines de Vampire: The Masquerade V20, adaptées au jeu narratif (sans jets de dés).
 *
 * Chaque discipline va du niveau 1 au niveau 10 :
 * - niveaux 1 à 5 : un pouvoir par niveau ;
 * - niveaux 6 à 9 : tous les pouvoirs d'ancien que V20 place à ce niveau ;
 *   le personnage qui atteint le niveau les possède tous ;
 * - niveau 10 : pouvoir mythique (absent de V20, créé pour la chronique).
 *
 * Le niveau accessible dépend de la Puissance du Sang (PS N = niveaux 1 à N).
 */

export const DISCIPLINES = {
  animalism: {
    id: "animalism",
    name: "Animalisme",
    description: "Ta Bête reconnaît ses semblables. Les créatures sauvages sentent la prédation dans ton regard et s'y soumettent. Elles ne se laissent pourtant pas pousser contre leur nature : aucun animal ne se jettera dans la mort parce que tu le lui demandes.",
    powers: [
      {
        id: "animalism-1-feral-whispers",
        level: 1,
        name: "Murmures Fauves",
        bloodCost: 0,
        duration: "scene",
        description: "Croise le regard d'un animal et parle-lui comme à un égal. Le chien de garde comprendra ta requête, le rat d'égout te décrira ce qu'il a vu, le corbeau te guidera vers ta proie. Les animaux te répondent par leurs comportements et leurs sons que tu comprends instinctivement. Tu peux demander un service simple ou obtenir des informations sur ce qui se passe dans leur territoire."
      },
      {
        id: "animalism-2-beckoning",
        level: 2,
        name: "L'Appel",
        bloodCost: 1,
        duration: "scene",
        description: "Tu pousses un hurlement, un cri ou un sifflement que seules les bêtes comprennent. Les animaux de l'espèce que tu imites, à portée de ton appel, ressentent le besoin de venir à toi : un seul rat, ou tous les rats du quartier, selon ta force. Ils arrivent bien disposés à ton égard, curieux, prêts à t'écouter. Mais ils ne t'obéissent pas d'office : pour les diriger, il te faut encore leur parler et les convaincre. Parfait pour réunir des espions ou créer une diversion."
      },
      {
        id: "animalism-3-quell-the-beast",
        level: 3,
        name: "Apaiser la Bête",
        bloodCost: 1,
        duration: "scene",
        description: "D'un regard ou d'un contact, tu éteins la Bête d'un mortel. Par la peur ou par une douceur hypnotique, selon ton choix, ses émotions fortes s'effacent : il cesse de lutter, de fuir, de crier, et sombre dans une apathie docile. Il n'a plus la force de résister à quoi que ce soit, ni à toi ni aux autres. Ce pouvoir n'a pas de prise sur les vampires, à une exception près : une voix apaisante peut aider un Caïnite à sortir de la frénésie."
      },
      {
        id: "animalism-4-subsume-the-spirit",
        level: 4,
        name: "Communion Spirituelle",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu plonges ton regard dans celui d'un animal et tu projettes ton esprit dans son corps. Pendant que ta propre chair tombe dans un sommeil inerte, tu vois par les yeux du faucon, tu cours avec le loup, tu te faufiles dans les conduits avec le rat. Plus ta maîtrise est grande, plus tu emportes de tes pouvoirs avec toi. Mais les blessures de l'animal deviennent les tiennes, et s'il meurt avant que tu n'aies regagné ton corps, tu sombres en torpeur."
      },
      {
        id: "animalism-5-drawing-out-the-beast",
        level: 5,
        name: "Libérer la Bête",
        bloodCost: 3,
        duration: "scene",
        description: "Quand ta Bête gronde, tu peux la jeter hors de toi sur une victime à portée de vue. Elle bondit de ta poitrine vers la sienne, et c'est elle qui sombre dans une frénésie furieuse pendant que tu restes étrangement calme et vide. Le pouvoir est dangereux : s'il échoue, ta Bête te revient décuplée et tu entres dans une frénésie pire encore. Et si tu t'éloignes avant qu'elle ne te revienne, tu risques de la perdre pour de bon, et avec elle une part de toi-même."
      },
      {
        id: "animalism-6-animal-succulence",
        level: 6,
        name: "Succulence Animale",
        bloodCost: 0,
        duration: "permanent",
        description: "Le sang des bêtes te nourrit comme jamais. Chaque gorgée de sang animal te rassasie deux fois plus qu'avant, si bien qu'un cerf ou un chien suffisent là où il fallait plusieurs proies. Mais ce festin a un revers cruel : plus tu te nourris de bêtes, plus ta faim de sang humain s'aiguise. Tu ne peux pas vivre éternellement de ce régime, et un jour ta Bête réclamera ce qu'elle désire vraiment."
      },
      {
        id: "animalism-6-shared-soul",
        level: 6,
        name: "Âme Partagée",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu poses la main sur un animal et vos esprits se mêlent. Tu revis ses souvenirs, tu vois ce qu'il a vu cette nuit, tu sens ce qu'il a senti : l'odeur du meurtrier dans la ruelle, le visage de l'homme qui l'a battu. Le lien est complet et mutuel, et il peut être difficile de s'en arracher. Prolonger l'union t'épuise, et chaque communion laisse une trace : un réflexe animal, une manie, un goût nouveau qui ne t'appartient pas."
      },
      {
        id: "animalism-6-species-speech",
        level: 6,
        name: "Langage des Espèces",
        bloodCost: 1,
        duration: "scene",
        description: "Tu ne parles plus à un animal, tu parles à toute une espèce. Tous les chiens du quartier, tous les corbeaux du parc, tous les rats des égouts présents autour de toi t'entendent et t'écoutent en même temps. Tu peux leur donner un ordre commun, et ils agissent comme une meute. Le pouvoir ne touche qu'une espèce à la fois, même si tu peux l'étendre avec effort à une espèce proche."
      },
      {
        id: "animalism-7-conquer-the-beast",
        level: 7,
        name: "Conquérir la Bête",
        bloodCost: 3,
        duration: "scene",
        description: "Tu as dompté le monstre en toi. Tu peux entrer en frénésie à volonté et y garder ta lucidité : tu choisis tes cibles, tu épargnes tes alliés, tu utilises la rage de la Bête avec la précision d'un chirurgien. Et quand une frénésie te saisit malgré toi, tu peux en reprendre les rênes au prix d'un effort constant. Ce contrôle reste fragile : s'il t'échappe, la Bête prend tout, et elle se souviendra de la laisse que tu lui as passée."
      },
      {
        id: "animalism-8-taunt-the-caged-beast",
        level: 8,
        name: "Provoquer la Bête en Cage",
        bloodCost: 3,
        duration: "instant",
        description: "D'un simple toucher, tu réveilles la Bête qui dort chez autrui. Ta cible sent la rage monter, et si sa maîtrise d'elle-même ne suffit pas, elle bascule en frénésie sur-le-champ. Le pouvoir fonctionne même sur les mortels, qui n'ont pas de Bête au sens où l'entendent les Caïnites, mais une colère animale enfouie. Un garde du corps devient soudain un fauve qui se retourne contre son maître."
      },
      {
        id: "animalism-9-unchain-the-beast",
        level: 9,
        name: "Déchaîner la Bête",
        bloodCost: 9,
        duration: "instant",
        description: "D'un regard, tu libères la Bête de ta victime contre son propre corps. La créature enfouie en elle se met à la déchirer de l'intérieur : sa chair se lacère, ses os craquent, ses entrailles se tordent comme sous les griffes d'un fauve. Les blessures sont terribles et ne guérissent qu'avec peine, et plus la Bête de la victime est sauvage, plus le carnage est grand. Ce pouvoir exige une maîtrise absolue : s'il échoue, c'est ta propre Bête qui te déchire."
      },
      {
        id: "animalism-10-army-of-beasts",
        level: 10,
        name: "Armée de Bêtes",
        bloodCost: 10,
        duration: "scene",
        description: "Un cri muet suffit. Chaque animal, du rat d'égout à l'oiseau de proie, du chien errant au loup des collines, sur toute une région, répond à ton appel et t'obéit sans réserve, même au prix de sa vie. Tu ne commandes pas une meute, tu diriges un écosystème entier qui se soulève pour dévorer tes ennemis : les nuées de corbeaux obscurcissent le ciel, les rats submergent les rues, les chiens assiègent les portes. Les Lupins eux-mêmes sentent la Bête de la nature se tourner vers toi. Tant que dure la scène, la nature elle-même part en guerre sur ton ordre."
      }
    ]
  },

  auspex: {
    id: "auspex",
    name: "Auspex",
    description: "Le voile entre les mondes s'efface. Tes sens transcendent la chair pour percevoir ce que les mortels ne verront jamais. À force égale ou supérieure, ton regard perce les voiles de l'Occultation et les mirages de la Chimérie, à condition de les chercher.",
    powers: [
      {
        id: "auspex-1-heightened-senses",
        level: 1,
        name: "Sens Accrus",
        bloodCost: 0,
        duration: "scene",
        description: "Tes sens s'aiguisent bien au-delà de ceux d'un mortel. Tu entends une conversation chuchotée à travers une porte, tu suis une odeur de sang dans la foule, tu lis un visage au fond d'une salle mal éclairée. Parfois, une intuition fulgurante te prévient d'un danger juste avant qu'il ne frappe. Ces sens ne te donnent pas la vision dans le noir absolu, et ils ont leur revers : un flash, une détonation ou une odeur violente peuvent t'aveugler ou t'assourdir pour une heure ou plus. Une beauté saisissante peut aussi te captiver au point de te faire oublier le reste."
      },
      {
        id: "auspex-2-aura-perception",
        level: 2,
        name: "Perception de l'Aura",
        bloodCost: 0,
        duration: "instant",
        description: "Tu fixes quelqu'un quelques instants, et son âme se dévoile en un halo de couleurs. Rouge pour la colère, bleu pour le calme, vert maladif pour l'envie, une pâleur reconnaissable pour un vampire, des éclats étranges pour une goule, un mage ou une créature de la nuit. Tu discernes les émotions dominantes et la nature profonde de celui que tu regardes. Mais une aura n'est pas un détecteur de mensonge : le trouble d'un menteur ressemble beaucoup à celui d'un innocent nerveux. Et tu n'obtiens qu'une lecture nette par personne au cours d'une même scène."
      },
      {
        id: "auspex-3-spirits-touch",
        level: 3,
        name: "Toucher de l'Esprit",
        bloodCost: 3,
        duration: "instant",
        description: "Prends un objet entre tes mains et ferme les yeux. Les émotions et souvenirs qui y sont imprégnés déferlent dans ton esprit en visions fragmentées. Ce couteau ? Tu vois son propriétaire le plonger dans le dos de sa victime. Cette lettre ? Tu ressens le désespoir de celle qui l'a écrite. Plus l'objet est chargé émotionnellement ou ancien, plus les visions sont intenses. Touche un mur et vois le meurtre qui s'y est déroulé il y a dix ans."
      },
      {
        id: "auspex-4-telepathy",
        level: 4,
        name: "Télépathie",
        bloodCost: 3,
        duration: "scene",
        description: "Fixe quelqu'un et plonge dans son esprit. Ses pensées de surface te parviennent comme des murmures : 'Je dois cacher cette lettre', 'Il ment, je le sais', 'Comment sortir d'ici ?'. Tu peux aussi projeter tes propres pensées directement dans sa tête, créant une conversation silencieuse. Avec de l'effort, tu peux fouiller plus profondément, cherchant un souvenir précis, mais l'esprit résiste comme un château fortifié. Les pensées des vampires anciens sont encore plus difficiles à pénétrer."
      },
      {
        id: "auspex-5-psychic-projection",
        level: 5,
        name: "Projection Psychique",
        bloodCost: 9,
        duration: "prolonged",
        description: "Ton esprit quitte ton corps, qui s'effondre comme en torpeur. Sous forme astrale, invisible et intangible, tu traverses les murs, survoles la ville à la vitesse de la pensée et observes le repaire de ton ennemi sans danger pour ta chair. Un cordon d'argent te relie toujours à ton corps. Tu ne peux rien toucher ni déplacer dans le monde physique, et ton corps ne sait pas ce qu'il subit pendant ton absence. Si le cordon est tranché, ton esprit s'échoue sur le plan astral, et le chemin du retour est long, terrifiant, et jamais garanti."
      },
      {
        id: "auspex-6-clairvoyance",
        level: 6,
        name: "Clairvoyance",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu fermes à demi les yeux et tu vois ailleurs. Un lieu que tu connais, un objet familier, une personne dont tu as gardé le souvenir : tu observes ce qui s'y passe comme si tu y étais, tu écoutes la conversation qui s'y tient. Tu restes pourtant conscient de ce qui t'entoure, assis dans ton fauteuil. Le pouvoir ne t'ouvre que ce qui t'est familier : un lieu jamais vu ou un inconnu restent hors de portée. Et pendant que ton esprit regarde au loin, tes gestes ici deviennent maladroits."
      },
      {
        id: "auspex-6-prediction",
        level: 6,
        name: "Prémonition",
        bloodCost: 1,
        duration: "scene",
        description: "Tu effleures en permanence les pensées de surface de ceux qui t'entourent, sans même y penser. En conversation, tu entends la réplique avant qu'elle ne soit prononcée, tu sens l'objection naître dans l'esprit de ton interlocuteur et tu y réponds avant qu'il ne l'ait formulée. Les négociations, les joutes verbales et les interrogatoires tournent naturellement à ton avantage. Un esprit rompu au mensonge et à la dissimulation te laisse pourtant moins de prise."
      },
      {
        id: "auspex-6-telepathic-communication",
        level: 6,
        name: "Communication Télépathique",
        bloodCost: 0,
        duration: "prolonged",
        description: "Tu tisses un réseau silencieux entre plusieurs esprits. Mots, images et sensations circulent entre toi et ceux que tu as liés, même séparés par des centaines de kilomètres. Un allié consentant rejoint le lien sans difficulté ; un esprit réticent doit être forcé, et une volonté forte y parvient mal. Plus ta maîtrise grandit, plus le réseau s'étend en distance et en nombre. Tu deviens le cœur d'une coterie qui pense d'une seule voix."
      },
      {
        id: "auspex-7-karmic-sight",
        level: 7,
        name: "Vision Karmique",
        bloodCost: 3,
        duration: "instant",
        description: "Ton regard plonge sous l'aura, jusqu'à l'âme. Tu lis la Nature profonde de la personne, ce qui la pousse à agir quand personne ne regarde. Tu mesures ce qu'il lui reste d'Humanité, la force de sa volonté et de ses vertus. Tu vois les mains étrangères posées sur son esprit : une Domination, un lien de sang, un pacte. Les esprits les plus forts résistent mieux à cet examen. Tu vois ce qu'elle est et ce qui la tient, pas ce qu'elle fera demain."
      },
      {
        id: "auspex-7-mirror-reflex",
        level: 7,
        name: "Réflexe du Miroir",
        bloodCost: 1,
        duration: "scene",
        description: "En combat, tu lis l'intention de ton adversaire une fraction de seconde avant qu'il ne bouge. Tu sais où ira la lame, vers où il va esquiver, quand il va feinter. Tu deviens son reflet, toujours en avance d'un geste. Le pouvoir ne vaut que contre un adversaire proche, que tu observes et qui combat comme il pense. Contre un être sans esprit, ou qui frappe à l'instinct pur, tes lectures deviennent confuses."
      },
      {
        id: "auspex-8-psychic-assault",
        level: 8,
        name: "Assaut Psychique",
        bloodCost: 9,
        duration: "instant",
        description: "D'un regard ou d'un contact, tu jettes ton esprit contre celui d'un autre comme un bélier contre une porte. Selon la violence de l'assaut et la résistance de ta victime, elle perd sa détermination, s'effondre en saignant des yeux, ou meurt sur le coup, le cerveau consumé. Un vampire tué ainsi tombe en poussière. Une volonté de fer peut tenir le choc, et frapper un être surnaturel t'épuise davantage. Ce pouvoir laisse peu de traces visibles, mais quiconque survit à ta tentative sait exactement qui l'a frappé."
      },
      {
        id: "auspex-9-false-slumber",
        level: 9,
        name: "Faux Sommeil",
        bloodCost: 0,
        duration: "permanent",
        description: "Même plongé dans la torpeur, tu ne dors plus vraiment. Ton esprit s'échappe de ton corps immobile et parcourt le monde comme en projection psychique : il observe, écoute, suit les intrigues de ta descendance pendant des décennies. Tu ne peux pas pour autant te réveiller à volonté. Et ce voyage a un prix : si ton esprit est vaincu sur le plan astral, il lui faut une année entière pour retrouver le chemin de ton corps, et tu en reviens affaibli."
      },
      {
        id: "auspex-10-chorus-of-minds",
        level: 10,
        name: "Le Chœur des Esprits",
        bloodCost: 10,
        duration: "scene",
        description: "Tu ouvres ton esprit à toute une ville. Les pensées de millions d'âmes t'arrivent comme le grondement de la mer, et tu peux à volonté en isoler une seule voix, aussi lointaine soit-elle. Tu sais où se cache celui qui te fuit, qui complote contre toi et à quelle heure, ce que pense le Prince dans son refuge. Aucun mur, aucune distance, aucun voile d'Occultation ne te sépare de ce que tu cherches. Pendant cette scène, tu n'es plus un observateur : tu es la mémoire vivante de la cité."
      }
    ]
  },

  celerity: {
    id: "celerity",
    name: "Célérité",
    description: "Le sang mort dans tes veines pulse d'une énergie explosive. Le monde ralentit autour de toi tandis que tu deviens l'éclair. Cette vitesse ne sert que le corps : elle ne fait pas penser plus vite.",
    powers: [
      {
        id: "celerity-1-feline-grace",
        level: 1,
        name: "Grâce Féline",
        bloodCost: 0,
        duration: "permanent",
        description: "Ton corps réagit avant même que ton esprit ne commande. Plus qu'une vitesse brute, c'est un équilibre parfait et surnaturel. Tu ne trébuches jamais, tu rattrapes un verre qui tombe avant qu'une goutte ne s'en échappe, tu esquives un coup que tu n'avais même pas vu venir. Tu es perpétuellement en état d'alerte physiologique parfaite."
      },
      {
        id: "celerity-2-rapidity",
        level: 2,
        name: "Rapidité",
        bloodCost: 1,
        duration: "scene",
        description: "Tes membres deviennent flous. Ce n'est pas encore courir vite, c'est agir vite. Tu peux dégainer, tirer et rengainer avant qu'un mortel ne cligne des yeux. Tu peux porter trois coups de couteau dans le temps qu'il en faut pour respirer. Pour un observateur, tu sembles avoir simplement sauté une étape dans la réalité."
      },
      {
        id: "celerity-3-fulgurance",
        level: 3,
        name: "Fulgurance",
        bloodCost: 1,
        duration: "instant",
        description: "La distance n'a plus de sens. Tu peux traverser une pièce bondée sans bousculer personne, simplement en passant dans les 'interstices' de leur attention. Tu es ici, et la seconde d'après tu es derrière ton ennemi à l'autre bout de la rue. Tu deviens le cauchemar qui frappe et disparaît avant même que le son de l'impact ne parvienne aux témoins."
      },
      {
        id: "celerity-4-flurry",
        level: 4,
        name: "Rafale",
        bloodCost: 1,
        duration: "scene",
        description: "Ton sang brûle et tes gestes s'enchaînent plus vite que la pensée d'un mortel. Là où un homme frappe une fois, tu frappes, tu esquives, tu désarmes et tu frappes encore. Tu vides un chargeur avant que la première douille ne touche le sol, tu fouilles un bureau entier pendant qu'un garde tourne la tête. Pour les témoins, tu n'es qu'un flou, une rafale de mouvements sans transition. Mais cette vitesse ne vaut que pour le corps : tu ne réfléchis pas plus vite, et tes pouvoirs de l'esprit ne se démultiplient pas. Chaque élan te coûte un peu de vitae."
      },
      {
        id: "celerity-5-slowed-world",
        level: 5,
        name: "Le Monde au Ralenti",
        bloodCost: 1,
        duration: "scene",
        description: "Le monde semble s'engluer autour de toi. Les balles deviennent des traits lents que tu vois venir, les éclats de verre d'une vitre brisée flottent assez longtemps pour que tu passes entre eux. Tu esquives une volée de coups sans en recevoir un seul, tu traverses une fusillade pour arracher l'arme des mains du tireur. Tu restes pourtant soumis à la pesanteur : tu cours vite, mais toujours sur le sol. Et ton corps paie le prix de cette violence : un mur heurté à cette vitesse te brise comme n'importe quel projectile."
      },
      {
        id: "celerity-6-projectile",
        level: 6,
        name: "Projectile",
        bloodCost: 1,
        duration: "instant",
        description: "Tu transmets ta vitesse surnaturelle à ce que tu lances ou tires. Une simple pièce de monnaie traverse une portière, un couteau de lancer s'enfonce jusqu'à la garde dans un torse, la balle de ton revolver frappe avec la violence d'un obus. Le pouvoir ne rend pas le tir plus précis : il faut toujours toucher sa cible, et seul le coup que tu prépares en bénéficie. Toute la vitesse que tu y verses te manque ensuite pour te mouvoir, le temps d'un battement de cœur."
      },
      {
        id: "celerity-7-flower-of-death",
        level: 7,
        name: "Fleur de Mort",
        bloodCost: 3,
        duration: "scene",
        description: "Tu cesses de séparer la vitesse de la frappe. Pour toute la scène, chacun de tes coups au corps à corps porte l'élan de ta Célérité : ton poing, ta lame, ta griffe arrivent avant que l'adversaire ait compris le geste, et frappent avec la force d'un train lancé. Un combat qui devrait durer une minute se termine en un souffle. La floraison ne concerne que le contact : armes à feu et projectiles n'en profitent pas. Et le pouvoir dévore ton sang à une vitesse effrayante."
      },
      {
        id: "celerity-8-zephyr",
        level: 8,
        name: "Zéphyr",
        bloodCost: 3,
        duration: "scene",
        description: "Tu cours si vite que la pesanteur n'a plus prise sur toi. Tu traverses un lac sans y enfoncer le pied, tu remontes la façade d'un immeuble au pas de course, tu passes même un instant sur le plafond d'un couloir. Ceux qui te voient passer ne distinguent qu'une traînée, un coup de vent. Le prix est la concentration : lancé ainsi, tu ne peux pas attaquer, et toute autre action te coûte un effort de volonté qui risque de briser ta course."
      },
      {
        id: "celerity-9-time-dilation",
        level: 9,
        name: "Dilatation Temporelle",
        bloodCost: 9,
        duration: "scene",
        description: "Entre deux battements de cœur d'un mortel, tu vis une scène entière. Tu désarmes une pièce pleine de gardes, tu sors trois personnes d'un immeuble en flammes, tu lis un dossier et le remets en place avant que la porte ne se soit refermée. Pour les autres, tu n'as pas bougé : les choses ont simplement changé autour de toi. Ton corps reste de chair morte : les chocs, les chutes et le feu te blessent comme avant, et la soif qui suit cet effort est terrible."
      },
      {
        id: "celerity-10-outside-time",
        level: 10,
        name: "Hors du Temps",
        bloodCost: 10,
        duration: "scene",
        description: "Tu sors du temps lui-même. Autour de toi, le monde s'arrête : la pluie reste suspendue, les flammes sont figées comme du verre, une balle attend dans l'air à un pas du front de sa cible. Toi seul te meus dans ce silence absolu. Tu peux traverser une ville, déplacer chaque combattant d'une bataille, réécrire une scène entière avant que le temps ne reprenne son cours. Quand il repart, tout ce que tu as changé est devenu vrai d'un seul coup. Seuls les êtres les plus anciens perçoivent qu'un instant leur a été volé."
      }
    ]
  },

  dominate: {
    id: "dominate",
    name: "Domination",
    description: "Ton regard est une chaîne, ta voix un fouet. Les esprits faibles se brisent devant ta volonté comme du verre. Il te faut croiser le regard de ta cible et être compris d'elle. Un sang plus ancien que le tien, d'une génération plus basse, ne plie pas, et nul ordre ne peut forcer quelqu'un à se détruire.",
    powers: [
      {
        id: "dominate-1-command",
        level: 1,
        name: "Commandement",
        bloodCost: 1,
        duration: "instant",
        description: "Regarde quelqu'un dans les yeux et donne-lui un ordre d'un seul mot : 'Fuis !', 'Tombe !', 'Oublie !', 'Parle !'. Ta volonté s'écrase contre la sienne comme un marteau. Il doit obéir immédiatement, incapable de résister à cet impératif qui résonne dans son crâne. L'ordre doit être simple et direct, mais les possibilités sont infinies : faire tomber une arme, avouer un secret, quitter la pièce. Le commandement ne dure qu'un instant, mais cet instant peut tout changer."
      },
      {
        id: "dominate-2-mesmerize",
        level: 2,
        name: "Mesmérisme",
        bloodCost: 1,
        duration: "prolonged",
        description: "Plonge ton regard dans le sien et parle doucement. Tu implantes dans son esprit une suggestion complexe, à accomplir tout de suite ou plus tard, quand une condition se présentera : « Quand tu verras le Prince, tu oublieras ce que tu as vu ce soir. » La victime agit comme si l'idée venait d'elle. Tu ne peux implanter qu'une seule suggestion à la fois chez une même personne, et un ordre trop contraire à sa nature profonde risque d'échouer. Tu crées ainsi des alibis, des taupes, des saboteurs qui ignorent ce qu'ils sont."
      },
      {
        id: "dominate-3-forgetful-mind",
        level: 3,
        name: "L'Esprit Oublieux",
        bloodCost: 3,
        duration: "permanent",
        description: "Les yeux dans les yeux, tu fouilles sa mémoire comme un tiroir. Tu effaces les dernières minutes, la soirée entière, ou des pans de sa vie si tu prends le temps nécessaire. Tu peux aussi réécrire ce qu'elle se rappelle : elle t'a vu ailleurs, c'est son ami qui l'a trahie. Tu peux même rendre un souvenir que quelqu'un d'autre a volé. Un travail bâclé laisse des failles : des fragments du vrai souvenir remontent parfois, dans un rêve, une odeur, un malaise inexplicable."
      },
      {
        id: "dominate-4-conditioning",
        level: 4,
        name: "Conditionnement",
        bloodCost: 3,
        duration: "permanent",
        description: "Séance après séance, nuit après nuit, tu plies une volonté jusqu'à ce qu'elle cède. Ce n'est pas l'œuvre d'un soir : il faut des semaines, parfois des mois. Au terme du travail, le sujet t'obéit sans que tu aies besoin de le regarder, et les autres dominateurs ont beaucoup de mal à le reprendre. Mais cette docilité a un prix : il perd l'initiative, la créativité, et devient un instrument plus qu'un serviteur. Ce n'est pas de l'amour, c'est une habitude. Séparé de toi pendant de longs mois, il retrouve peu à peu sa propre volonté."
      },
      {
        id: "dominate-5-possession",
        level: 5,
        name: "Possession",
        bloodCost: 9,
        duration: "prolonged",
        description: "Tu écrases l'esprit d'un mortel jusqu'à le repousser dans un coin obscur de son propre crâne, puis tu prends sa place. Ton corps de vampire s'effondre, inerte, pendant que tu vis sa vie : tu marches en plein jour, tu goûtes la nourriture, tu entres là où un vampire ne peut pas aller. Le pouvoir n'a pas de prise sur les vampires ni sur les autres créatures, sauf sur une goule qui a bu ton sang. Si le corps que tu habites meurt, ton esprit est rejeté dans ta chair et tu sombres en torpeur."
      },
      {
        id: "dominate-6-chain-the-psyche",
        level: 6,
        name: "Enchaîner la Psyché",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu poses un verrou sur les esprits que tu as soumis. Si ta victime tente de désobéir à tes ordres, ou de retrouver les souvenirs que tu lui as pris, une douleur fulgurante la terrasse et la laisse tremblante, incapable d'agir pendant de longs instants. Le verrou résiste à plusieurs tentatives avant de céder. Une volonté obstinée, prête à souffrir encore et encore, finit pourtant par en venir à bout."
      },
      {
        id: "dominate-6-loyalty",
        level: 6,
        name: "Loyauté",
        bloodCost: 0,
        duration: "permanent",
        description: "Les ordres que tu donnes s'enracinent si profondément qu'aucun autre dominateur ne peut les arracher facilement. Celui qui tente de soumettre l'un de tes sujets se heurte à ta volonté comme à un mur, et l'effort lui coûte cher. Tes serviteurs restent les tiens, même face à un rival puissant. Ce pouvoir protège ton œuvre, mais il ne rend pas tes sujets plus fidèles qu'avant : il empêche seulement les autres de te les voler."
      },
      {
        id: "dominate-6-obedience",
        level: 6,
        name: "Obéissance",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu n'as plus besoin du regard. Un contact de peau à peau suffit désormais à porter tous tes pouvoirs de Domination : une main posée sur une épaule, des doigts qui effleurent un poignet, une poignée de main. Les aveugles, ceux qui baissent les yeux et ceux qui portent des lunettes noires ne t'échappent plus. Il te faut pourtant toucher la peau nue, et ta cible doit toujours comprendre tes ordres."
      },
      {
        id: "dominate-7-mass-manipulation",
        level: 7,
        name: "Manipulation de Masse",
        bloodCost: 3,
        duration: "scene",
        description: "Tu étends un pouvoir de Domination à tout un petit groupe qui croise ton regard. Les gardes d'une porte oublient ensemble ton passage, les témoins d'une scène reçoivent tous le même souvenir. Il te faut croiser leurs regards et t'adresser à eux tous à la fois. Le groupe ne cède que si le plus résistant d'entre eux cède : une seule volonté forte peut briser l'effet pour tous. Tu ne domines pas une armée, mais une salle."
      },
      {
        id: "dominate-7-still-mortal-flesh",
        level: 7,
        name: "Figer la Chair Mortelle",
        bloodCost: 3,
        duration: "instant",
        description: "Tu ne commandes plus seulement l'esprit, mais le corps qui lui obéit sans y penser. D'un regard, tu coupes une fonction involontaire chez ta cible : sa respiration s'arrête, sa vue s'éteint, son ouïe disparaît, son cœur se fige. L'effet ne dure qu'un moment, mais un cœur arrêté assez longtemps tue un mortel. Le pouvoir agit aussi sur les vampires, dont il peut éteindre les sens. Les volontés les plus fortes résistent mieux."
      },
      {
        id: "dominate-8-far-mastery",
        level: 8,
        name: "Maîtrise Lointaine",
        bloodCost: 3,
        duration: "instant",
        description: "La distance ne protège plus ceux que tu connais. Tu concentres ta pensée sur une personne que tu as déjà rencontrée, et tu peux exercer sur elle tous tes pouvoirs de Domination comme si elle se tenait devant toi, où qu'elle soit dans le monde. Elle sent soudain ta présence dans sa tête et ta volonté qui s'impose. Ce pouvoir ne fonctionne que sur quelqu'un que tu connais. Un être surnaturel exige davantage d'effort, et celui qui sait se cacher te laisse plus de mal à le trouver."
      },
      {
        id: "dominate-9-speak-through-the-blood",
        level: 9,
        name: "Parole du Sang",
        bloodCost: 9,
        duration: "prolonged",
        description: "Tu parles, et ta lignée entière t'entend, jusqu'au dernier infant de tes infants, même ceux que tu n'as jamais rencontrés, même ceux qui dorment en torpeur. Tu ne donnes pas d'ordres précis, mais une direction : « Servez la Camarilla », « Détruisez les héritiers de tel clan ». L'ordre n'agit pas en une nuit : il dérive lentement dans leurs esprits pendant des années, comme une vocation, et il peut durer des décennies. Ceux qui ont atteint la Golconde échappent à ta voix."
      },
      {
        id: "dominate-10-sovereign-will",
        level: 10,
        name: "Volonté Souveraine",
        bloodCost: 10,
        duration: "scene",
        description: "Ta volonté devient une loi du monde. Pour une scène, tu peux dominer quiconque entend ta voix, même sans croiser son regard, même un sang plus ancien que le tien, même un ancien qui se croyait hors de portée. Les mortels obéissent avant que tes paroles ne soient finies, les vampires plient le genou en se demandant pourquoi. Une foule entière exécute ton ordre comme un seul corps. Seuls les plus anciens du sang de Caïn conservent une chance de te résister, et ils ne te le pardonneront jamais."
      }
    ]
  },

  fortitude: {
    id: "fortitude",
    name: "Force d'Âme",
    description: "Ton corps mort est plus résistant que l'acier vivant. Balles, lames et flammes se brisent contre ta chair de cadavre. Même le feu et le soleil, qui consument les autres vampires, doivent lutter pour t'entamer.",
    powers: [
      {
        id: "fortitude-1-resilience",
        level: 1,
        name: "Résilience",
        bloodCost: 0,
        duration: "permanent",
        description: "La douleur existe toujours, mais elle est... lointaine. Les coups qui feraient tomber un mortel te font à peine ciller. Une batte de baseball sur l'épaule ? Tu tournes la tête, agacé. Un coup de poing dans le ventre ? Tu expires calmement. Ton corps absorbe les impacts comme un sac de sable, sans broncher, sans reculer. Tu n'es pas encore invulnérable, mais tu es terriblement difficile à faire tomber."
      },
      {
        id: "fortitude-2-endurance",
        level: 2,
        name: "Endurance",
        bloodCost: 0,
        duration: "permanent",
        description: "Les balles entrent, mais elles ne t'arrêtent pas. Le couteau plonge dans ta chair, et tu continues d'avancer. Ce qui tuerait un mortel ne fait que te ralentir légèrement. Tu peux combattre avec une lame plantée dans le ventre, courir avec une balle dans la jambe. Les blessures sont là, visibles, mais elles semblent... optionnelles. Tu décideras de t'en occuper plus tard."
      },
      {
        id: "fortitude-3-resistance",
        level: 3,
        name: "Résistance",
        bloodCost: 0,
        duration: "permanent",
        description: "Même les choses qui devraient te détruire peinent à t'entamer. Le feu te brûle, mais lentement, te laissant le temps de fuir. Les griffes d'un loup-garou déchirent ta chair, mais ne la consument pas comme elles le devraient. Tu peux plonger ta main dans les flammes pour récupérer un objet, traverser un brasier pour t'échapper. La destruction elle-même doit négocier avec toi."
      },
      {
        id: "fortitude-4-unshakable",
        level: 4,
        name: "Inébranlable",
        bloodCost: 0,
        duration: "permanent",
        description: "Ton bras est arraché. Tu te relèves. Ta colonne vertébrale est brisée. Tu rampes vers ton ennemi. La moitié de ton corps est en feu. Tu continues de frapper. La douleur n'est plus qu'un bruit de fond lointain, un concept abstrait qui ne te concerne pas. Ton corps refuse simplement d'abandonner, même quand toute logique dit qu'il devrait s'effondrer. Tu es la chose qui ne reste pas à terre."
      },
      {
        id: "fortitude-5-invulnerability",
        level: 5,
        name: "Invulnérabilité",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu es ce dont les chasseurs de vampires font des cauchemars. Les balles entrent à peine dans ta chair, les lames y laissent des entailles qui se referment avant la fin du combat. Tu traverses un immeuble en flammes en serrant les dents, tu te relèves après avoir été percuté par une voiture. Le soleil lui-même te consume lentement là où il réduirait un autre vampire en cendres en quelques instants, ce qui t'accorde peut-être le temps de fuir. Tu n'es pas immortel : le feu, le soleil et les crocs finissent toujours par passer. Mais tu tiens bien plus longtemps que les autres."
      },
      {
        id: "fortitude-6-personal-armor",
        level: 6,
        name: "Armure Personnelle",
        bloodCost: 3,
        duration: "scene",
        description: "Pour la scène, ta chair durcit comme de l'acier trempé. Les couteaux se brisent sur tes côtes, la batte éclate sur ton épaule, le sabre se fend en deux contre ton cou. Celui qui te frappe à mains nues se blesse lui-même contre ton corps. Mais ne te crois pas intouchable : un coup qui porte te blesse quand même, même si l'arme ne s'en relève pas. Et les armes enchantées ou anciennes peuvent résister à ta peau."
      },
      {
        id: "fortitude-7-shared-strength",
        level: 7,
        name: "Force Partagée",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu poses ton pouce ensanglanté sur le front de quelqu'un et tu lui prêtes ta résistance. Un mortel encaisse soudain les balles comme un ancien, ta goule traverse un incendie sans mourir. La protection dure de quelques instants à une année entière, selon ce que tu y investis, et tu peux la reprendre quand tu le veux. La cible n'a pas besoin d'être consentante. Mais une goutte de ton sang reste visible sur son front tant que dure le don, et tu ne peux jamais prêter plus de force que tu n'en possèdes."
      },
      {
        id: "fortitude-8-adamantine",
        level: 8,
        name: "Adamantin",
        bloodCost: 3,
        duration: "scene",
        description: "Ton armure de chair atteint la perfection. Pour la scène, les armes qui se brisent sur toi ne te laissent plus la moindre marque : la lame éclate, la balle s'écrase, et ta peau reste intacte sous le tissu déchiré. Les témoins voient un homme encaisser une rafale sans même reculer. Cette protection ne vaut que contre les coups et les projectiles : le feu, le soleil et la magie gardent leur prise sur toi."
      },
      {
        id: "fortitude-9-immutable-flesh",
        level: 9,
        name: "Chair Immuable",
        bloodCost: 0,
        duration: "permanent",
        description: "Ton corps a cessé de croire à la blessure ordinaire. Une chute du haut d'une tour, un accident de camion, une rafale de fusil d'assaut : tu te relèves, tu époussettes tes vêtements et tu reprends ta route. La violence des mortels ne t'atteint presque plus. Les griffes des loups, le feu et le soleil te blessent encore, mais lentement, comme une pluie froide plutôt qu'une flamme. Tu pourrais survivre aux premiers rayons de l'aube le temps de trouver un abri."
      },
      {
        id: "fortitude-10-indestructible",
        level: 10,
        name: "Indestructible",
        bloodCost: 10,
        duration: "scene",
        description: "Pour une nuit, la Mort Ultime renonce à toi. Le soleil de midi te brûle sans te consumer, une explosion te laisse debout au centre du cratère, un incendie entier ne parvient qu'à noircir ta peau. Tu marches à travers un bûcher dressé pour toi, tu restes debout face à une armée de chasseurs et tu les regardes épuiser leurs armes. Rien de ce que le monde peut t'opposer ne parvient à te détruire. Quand l'effet retombe, tu es affamé, épuisé, mais toujours là."
      }
    ]
  },

  obfuscate: {
    id: "obfuscate",
    name: "Occultation",
    description: "Tu plies la perception comme d'autres plient la lumière. Les regards glissent sur toi, les esprits t'oublient instantanément. Le voile ne trompe que les esprits proches : une caméra enregistre ton image, même si le garde devant l'écran ne la remarque pas. Les enfants, les animaux et l'Auspex peuvent percer ton masque.",
    powers: [
      {
        id: "obfuscate-1-cloak-of-shadows",
        level: 1,
        name: "Cape d'Ombre",
        bloodCost: 0,
        duration: "scene",
        description: "Fonds-toi dans l'ombre d'un recoin, d'une colonne, d'une alcôve. Reste immobile et tu deviens... rien. Pas invisible : les gens pourraient techniquement te voir si ils regardaient directement, mais leur cerveau refuse d'enregistrer ta présence. Leur regard glisse sur toi comme l'eau sur du verre. Tu es juste un détail sans importance, un morceau du décor, un rien. Bouge trop vite et le charme se brise. Parfait pour écouter des conversations ou attendre le moment parfait pour frapper."
      },
      {
        id: "obfuscate-2-unseen-presence",
        level: 2,
        name: "Présence Invisible",
        bloodCost: 0,
        duration: "scene",
        description: "Maintenant tu peux marcher parmi eux. Traverse une foule, longe un couloir, suis ta cible dans la rue. Les gens te voient subconsciemment et s'écartent sans savoir pourquoi, comme on évite un poteau. Les caméras de surveillance enregistrent ton passage mais l'opérateur qui regarde l'écran ne remarque rien. Tu peux fouiller un bureau pendant que le propriétaire travaille à son bureau, voler des clés dans la poche de quelqu'un, passer devant un garde. Ne fais rien pour attirer l'attention et tu restes invisible."
      },
      {
        id: "obfuscate-3-mask-of-a-thousand-faces",
        level: 3,
        name: "Masque aux Mille Visages",
        bloodCost: 1,
        duration: "scene",
        description: "Au lieu de disparaître, tu montres un autre visage : des traits inventés, une autre corpulence, d'autres vêtements. Tu ne changes pas physiquement, mais tous ceux qui te regardent voient ce que tu veux qu'ils voient. Pour copier quelqu'un de précis, il te faut l'avoir bien observé, et ses proches remarqueront peut-être un détail qui cloche. Paraître plus beau que tu ne l'es demande un effort supplémentaire. Change de visage en un instant pour semer tes poursuivants, ou deviens le garde dont tu as volé l'uniforme."
      },
      {
        id: "obfuscate-4-vanish",
        level: 4,
        name: "Disparition",
        bloodCost: 1,
        duration: "scene",
        description: "En pleine conversation, en pleine course, sous les yeux de ceux qui te fixent : tu disparais. Un instant tu es là, l'instant suivant il n'y a plus que le vide. Les témoins clignent des yeux, désorientés. Les esprits les plus faibles vont plus loin encore : ils oublient jusqu'à ta présence, et ne se rappellent même plus avoir parlé à quelqu'un. Les esprits forts, eux, savent qu'il y avait quelqu'un, même s'ils ne te voient plus. Disparaître ainsi devant une foule reste une provocation dangereuse pour la Mascarade."
      },
      {
        id: "obfuscate-5-cloak-the-gathering",
        level: 5,
        name: "Voile Collectif",
        bloodCost: 3,
        duration: "scene",
        description: "Tu étends ton pouvoir comme un manteau sur ceux qui t'entourent. Tes compagnons proches profitent de ton voile : ils disparaissent avec toi, traversent un hall surveillé ou portent un nouveau visage, selon le pouvoir que tu partages. Plus le groupe est nombreux, plus l'effort est grand. Chacun doit rester discret : si l'un d'eux attaque ou attire l'attention, il se révèle. Et si c'est toi qui te trahis, le voile se déchire pour tout le monde à la fois."
      },
      {
        id: "obfuscate-6-conceal",
        level: 6,
        name: "Dissimulation",
        bloodCost: 1,
        duration: "scene",
        description: "Tu étends ton voile sur un objet inanimé, d'un simple carnet à une maison entière avec tout ce qu'elle contient. Ta voiture devient invisible au barrage, ton refuge n'est plus qu'un terrain vague aux yeux des passants. L'objet doit avoir une signification personnelle pour toi, et tu dois rester assez proche pour maintenir le voile. Ceux qui heurtent l'objet ou entrent dans la maison peuvent briser l'illusion pour eux-mêmes."
      },
      {
        id: "obfuscate-6-mind-blank",
        level: 6,
        name: "Esprit Vide",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu caches tes pensées aussi bien que ton corps. Celui qui tente de lire ton esprit, de sonder tes souvenirs ou d'écouter tes pensées doit d'abord trouver le chemin vers elles, et ce chemin est obscur. Même s'il le trouve, il n'en tire que des fragments. Ce pouvoir protège ton esprit des intrusions, pas ton corps des regards : on te voit toujours, mais personne n'entend ce que tu penses."
      },
      {
        id: "obfuscate-6-soul-mask",
        level: 6,
        name: "Masque de l'Âme",
        bloodCost: 0,
        duration: "permanent",
        description: "Ton aura n'est plus ton aura. Tu choisis les couleurs que verront ceux qui la sondent : celle d'un mortel paisible, d'une goule anxieuse, d'un vampire sans histoire, ou aucune aura du tout. Le masque reste en place sans effort, même quand tu dors. Tu peux apprendre plusieurs masques et passer de l'un à l'autre. C'est le déguisement parfait contre les Tremere et les Malkaviens qui croient tout voir."
      },
      {
        id: "obfuscate-7-cache",
        level: 7,
        name: "Cache",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu n'as plus besoin de rester près de ce que tu caches. Une fois ton voile posé sur toi, un compagnon, un objet ou une maison, tu peux t'éloigner et vaquer à tes affaires : la dissimulation tient d'elle-même jusqu'à l'aube. Ta coterie attend invisible dans un entrepôt pendant que tu négocies à l'autre bout de la ville. Tu dois tout de même rester à une distance raisonnable, et si tu t'éloignes trop, le voile se déchire."
      },
      {
        id: "obfuscate-7-veil-of-blissful-ignorance",
        level: 7,
        name: "Voile de Bienheureuse Ignorance",
        bloodCost: 1,
        duration: "scene",
        description: "D'un toucher, tu jettes ton voile sur quelqu'un qui ne l'a pas demandé. Ta victime devient invisible aux yeux des autres : elle crie, personne ne l'entend ; elle saisit un bras, la personne frissonne sans comprendre. Elle ne peut pas mettre fin à l'effet, qui dure de quelques instants à une nuit entière. Le pouvoir ne fonctionne pas sur celui qui accepte d'être caché : il faut qu'il le subisse."
      },
      {
        id: "obfuscate-8-old-friend",
        level: 8,
        name: "Vieil Ami",
        bloodCost: 3,
        duration: "scene",
        description: "Tu plonges dans l'esprit de ta victime et tu prends les traits de la personne en qui elle a le plus confiance, vivante ou morte : une mère disparue, un mentor, un amant, un vieux camarade d'armes. Elle te voit, t'entend et te parle comme à cet être aimé. Tu ignores toi-même qui elle voit, et tu dois le deviner à ses réactions. Le pouvoir ne trompe qu'une personne à la fois : ceux qui assistent à la scène voient ton vrai visage."
      },
      {
        id: "obfuscate-9-create-name",
        level: 9,
        name: "Créer un Nom",
        bloodCost: 9,
        duration: "permanent",
        description: "Tu ne portes plus un masque, tu deviens quelqu'un d'autre. Sur plusieurs nuits de concentration, tu bâtis une identité complète : un visage, une voix, une aura, une Nature, des pensées de surface cohérentes. Même ceux qui sondent ton âme trouvent la personne que tu as inventée. Seul un Auspex de maître, ou une incohérence dans tes compétences, peut révéler l'imposture. Tu peux vivre des siècles sous ce nom, pendant que ton vrai visage dort dans les mémoires."
      },
      {
        id: "obfuscate-10-oblivion-of-the-world",
        level: 10,
        name: "L'Oubli du Monde",
        bloodCost: 10,
        duration: "permanent",
        description: "Tu effaces ton existence de la mémoire du monde. Ceux qui te connaissaient oublient ton nom et ton visage, les archives qui te mentionnaient se perdent, les photographies montrent une pièce vide. Ton refuge devient un angle mort : les passants ne le voient plus, les cartes l'omettent, ceux qui y entrent oublient pourquoi ils sont venus. Tu peux aussi effacer ainsi un autre être ou un lieu entier. Seuls ceux que tu choisis se souviennent encore."
      }
    ]
  },

  potence: {
    id: "potence",
    name: "Puissance",
    description: "Tes muscles morts contiennent la force de la damnation. Ce qui résiste, tu le brises. Ce qui s'oppose, tu l'écrases. Cette force ne sert que le corps : elle rend tes coups terribles, pas plus adroits.",
    powers: [
      {
        id: "potence-1-vigor",
        level: 1,
        name: "Vigueur",
        bloodCost: 0,
        duration: "permanent",
        description: "Ta poigne est un étau. Tes muscles ne tremblent jamais sous l'effort, ne fatiguent jamais. Tu peux tenir une prise toute la nuit, serrer une main jusqu'à ce que les os craquent sans même forcer. Ce n'est pas encore de la force explosive, c'est une fondation inébranlable : tu es l'ancre que rien ne peut déplacer, le roc contre lequel les vagues se brisent."
      },
      {
        id: "potence-2-prowess",
        level: 2,
        name: "Prouesse",
        bloodCost: 0,
        duration: "permanent",
        description: "Les objets du monde mortel ne sont plus que des jouets fragiles. Tu plies les barreaux comme des branches mortes, tu enfonces les portes comme du carton, tu arraches les serrures avec tes doigts. Là où les autres utilisent des outils, tu n'as besoin que de tes mains. Le métal cède, le bois éclate, la pierre s'effrite sous ta prise."
      },
      {
        id: "potence-3-brutality",
        level: 3,
        name: "Brutalité",
        bloodCost: 0,
        duration: "permanent",
        description: "Chaque coup est une détonation. Un poing qui traverse un torse, une gifle qui brise une nuque, un coup de pied qui envoie un corps voler sur dix mètres. Tu ne frappes plus, tu détruis. Les mortels touchés par ta violence ne se relèvent pas. Les vampires réfléchissent à deux fois avant de croiser ta route. Ton corps est devenu une arme de démolition."
      },
      {
        id: "potence-4-fury",
        level: 4,
        name: "Fureur",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu ne te mesures plus aux hommes, mais aux structures. Renverse une voiture d'une main, arrache un lampadaire du trottoir pour t'en servir comme gourdin, fais s'effondrer un mur porteur d'un coup d'épaule. Tes adversaires ne sont plus seulement les vivants, mais les bâtiments eux-mêmes. Tu es le tremblement de terre qui marche."
      },
      {
        id: "potence-5-titanic-strength",
        level: 5,
        name: "Force Titanesque",
        bloodCost: 0,
        duration: "permanent",
        description: "Les lois de la physique te regardent avec incrédulité. Arrête un camion lancé à pleine vitesse en te plantant sur son chemin. Soulève un pylône électrique comme un javelot. Enfonce tes doigts dans le béton armé comme dans du beurre. Tu appartiens aux légendes maintenant, aux récits des anciens sur les géants et les titans. Ceux qui te voient à l'œuvre ne parlent plus de monstre, mais de dieu."
      },
      {
        id: "potence-6-imprint",
        level: 6,
        name: "Empreinte",
        bloodCost: 1,
        duration: "scene",
        description: "Pour la scène, tes doigts s'enfoncent dans la matière la plus dure comme dans de l'argile. Tu escalades un mur lisse en y creusant tes propres prises, tu laisses l'empreinte de ta main dans la portière d'acier d'une voiture en guise d'avertissement, tu perces une cloison mince pour atteindre ce qui se cache derrière. La profondeur dépend de la matière et de son épaisseur : le béton armé cède moins vite que le bois. Mais la marque reste, et quiconque la voit comprend à quoi il a affaire."
      },
      {
        id: "potence-7-earthshock",
        level: 7,
        name: "Onde Tellurique",
        bloodCost: 3,
        duration: "instant",
        description: "Tu frappes le sol de toutes tes forces, et le coup voyage sous la terre. Il ressort plus loin, sous les pieds de ta cible, en un geyser de pierre et de terre qui la projette en l'air. Esquiver est difficile, car le coup vient d'en dessous. Tu ne peux frapper qu'un endroit que tu vois, et la distance reste limitée. Mal maîtrisé, le coup jaillit au mauvais endroit, et un geste raté peut même t'ensevelir sous les débris que tu as soulevés."
      },
      {
        id: "potence-8-flick",
        level: 8,
        name: "Pichenette",
        bloodCost: 1,
        duration: "instant",
        description: "Tu n'as plus besoin de toucher pour frapper. Un claquement de doigts, un geste du menton, un baiser soufflé : à l'autre bout de la pièce, ou aussi loin que porte ton regard, ta cible encaisse le coup comme si ton poing l'avait atteinte. Toute ta force y passe, et elle suffit à briser une mâchoire ou à projeter un homme contre un mur. Il te faut pourtant un geste, même infime : les mains liées et la tête immobilisée, tu ne peux rien. Et le coup ne porte pas plus loin que ce que tes sens perçoivent."
      },
      {
        id: "potence-9-primal-strength",
        level: 9,
        name: "Force Primordiale",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu portes la force des géants des anciennes légendes. Tu arraches la porte d'une chambre forte de ses gonds, tu soulèves un camion au-dessus de ta tête et tu le lances sur ceux qui te poursuivent, tu traverses le mur porteur d'un immeuble comme une feuille de papier. Au corps à corps, chacun de tes coups frappe comme un bélier. Ta force n'a pas de prix en vitae : elle fait simplement partie de toi. Mais elle se voit, et un tel prodige devant des mortels menace la Mascarade."
      },
      {
        id: "potence-10-earthquake",
        level: 10,
        name: "Séisme",
        bloodCost: 10,
        duration: "instant",
        description: "Tu poses le poing sur le sol, et le quartier entier tremble. Les rues se fendent, les façades s'écroulent, les tunnels du métro s'effondrent sur eux-mêmes, les conduites d'eau éclatent en geysers. Ce n'est plus un coup, c'est un tremblement de terre qui obéit à ta colère. Tu peux viser un bâtiment précis et le raser jusqu'aux fondations, ou laisser la secousse courir sous toute une partie de la ville. Le monde des mortels appellera cela une catastrophe naturelle. Les Caïnites, eux, sauront."
      }
    ]
  },

  presence: {
    id: "presence",
    name: "Présence",
    description: "Ton aura plie les émotions comme un ouragan plie les arbres. Amour, terreur, dévotion : tu es la tempête dans leurs cœurs. Tu dictes ce qu'ils ressentent, pas ce qu'ils font. Une volonté forte peut te résister le temps d'une scène, à condition de renouveler l'effort tant que tu restes là.",
    powers: [
      {
        id: "presence-1-awe",
        level: 1,
        name: "Fascination",
        bloodCost: 1,
        duration: "scene",
        description: "Entre dans une pièce et tous les regards se tournent vers toi. Les conversations s'arrêtent, les gens se rapprochent, les inconnus veulent te plaire et écoutent tes arguments avec une bienveillance qu'ils ne s'expliquent pas. Plus tu y mets d'intensité, plus le cercle de tes admirateurs s'élargit, d'une personne à toute une salle. La fascination ne commande rien : elle rend seulement réceptif. Et elle se brise dès que le danger devient réel, car l'instinct de survie reprend toujours ses droits."
      },
      {
        id: "presence-2-dread-gaze",
        level: 2,
        name: "Regard Terrifiant",
        bloodCost: 0,
        duration: "instant",
        description: "Fixe quelqu'un et libère ta Bête juste assez pour qu'il la voie. Tes yeux deviennent ceux d'un prédateur antédiluvien, ton visage un masque de terreur primordiale. La victime voit sa propre mort dans ton regard et la peur absolue la submerge. Elle fuit en hurlant, se recroqueville en position fœtale, ou se fige complètement, paralysée. Même les vampires peuvent être affectés, leur propre Bête reconnaissant un prédateur supérieur. L'effet est instantané et dévastateur."
      },
      {
        id: "presence-3-entrancement",
        level: 3,
        name: "Envoûtement",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu parles à quelqu'un quelques minutes, et tu tisses autour de lui un réseau d'affection surnaturelle. Il devient ton serviteur dévoué, cherche à te plaire, te rend des services, te couvre. Il garde pourtant sa personnalité et son imagination : il te sert avec intelligence, pas comme un pantin. L'envoûtement est temporaire, d'une heure à une année selon ta force, et le relancer pendant qu'il agit ne sert à rien. Quand il prend fin, ton serviteur se souvient de tout, et certains ne le pardonnent jamais."
      },
      {
        id: "presence-4-summon",
        level: 4,
        name: "Convocation",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu penses à quelqu'un que tu as déjà rencontré, et tu l'appelles. Où qu'il soit, il ressent le besoin irrésistible de venir à toi. Il quitte son travail, son lit, sa ville, et prend le chemin le plus rapide que ses moyens lui permettent. Il sait où te trouver sans savoir pourquoi il vient. L'appel n'éteint pas son instinct de survie : il ne traversera pas un incendie pour toi. Et il s'évanouit à l'aube : s'il n'est pas arrivé, il faut recommencer la nuit suivante."
      },
      {
        id: "presence-5-majesty",
        level: 5,
        name: "Majesté",
        bloodCost: 3,
        duration: "scene",
        description: "Tu revêts une couronne invisible, et ta présence devient écrasante, magnifique et terrible à la fois. Personne n'ose lever la main contre toi, ni même te contredire : les agresseurs baissent leurs armes, les insulteurs ravalent leurs mots, les anciens eux-mêmes hésitent. Il faut un courage hors du commun pour seulement t'affronter du regard. Mais la Majesté se paie plus tard : un Caïnite humilié en public a des siècles pour préparer sa vengeance."
      },
      {
        id: "presence-6-love",
        level: 6,
        name: "Amour",
        bloodCost: 1,
        duration: "scene",
        description: "Tu enflammes le cœur de ta cible d'un amour aussi puissant qu'un lien de sang. Pour la scène, elle t'adore, te protège, accepte tes demandes et se range à tes arguments. Contre toi, elle n'a plus d'arme : elle ne peut pas te mentir, te négocier, te refuser grand-chose. Mais ce n'est qu'une flamme d'un soir. Quand la scène s'achève, l'amour retombe, et la victime garde le souvenir précis de ce qu'elle a ressenti."
      },
      {
        id: "presence-6-paralyzing-glance",
        level: 6,
        name: "Regard Paralysant",
        bloodCost: 1,
        duration: "prolonged",
        description: "Ton regard ne fait pas que terrifier : il fige. Ta victime tombe dans une terreur catatonique, incapable de bouger, de parler ou même de cligner des yeux. Elle reste ainsi de quelques instants à plusieurs nuits, consciente mais prisonnière de sa propre peur. Seule une menace directe contre sa vie peut lui donner la force de s'arracher à cette paralysie."
      },
      {
        id: "presence-6-spark-of-rage",
        level: 6,
        name: "Étincelle de Rage",
        bloodCost: 1,
        duration: "scene",
        description: "Tu attises la colère qui dort en chacun. Autour de toi, les rancunes se réveillent, les mots dépassent la pensée, les vieux amis en viennent aux mains. Une réception élégante tourne en règlement de comptes, un conseil en pugilat. Chez les vampires, la Bête gronde, et certains basculent en frénésie. Le pouvoir est aveugle et contagieux : s'il t'échappe, c'est toi que la rage emporte."
      },
      {
        id: "presence-7-cooperation",
        level: 7,
        name: "Coopération",
        bloodCost: 3,
        duration: "scene",
        description: "Tu imposes l'entente. Pour la scène, un groupe qui se déteste accepte de travailler ensemble, de négocier, d'écouter. Les insultes glissent, les vieilles haines s'apaisent assez pour qu'on s'assoie à la même table. C'est l'arme des conclaves et des conseils impossibles. Mais cette paix est fragile : elle ne survit pas à la scène, et une trahison flagrante la brise sur-le-champ."
      },
      {
        id: "presence-8-ironclad-command",
        level: 8,
        name: "Commandement de Fer",
        bloodCost: 0,
        duration: "permanent",
        description: "Ta présence est devenue une force de la nature. Les mortels ne peuvent plus du tout résister à tes pouvoirs de Présence : leur volonté s'efface devant toi comme une bougie devant le soleil. Les créatures surnaturelles peuvent encore lutter, mais au prix d'un effort épuisant, et rarement pour longtemps. Ce pouvoir ne demande aucun effort : il fait partie de ce que tu es."
      },
      {
        id: "presence-9-pulse-of-the-city",
        level: 9,
        name: "Pouls de la Cité",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu poses ta main sur le cœur d'une ville et tu lui imposes une émotion. Pendant quelques minutes ou une semaine entière, toute la cité ressent ce que tu as choisi : la peur, l'euphorie, la méfiance, le deuil. Les bagarres se multiplient, les fêtes durent jusqu'à l'aube, les gens restent cloîtrés chez eux. Tu dois connaître personnellement cette ville pour la toucher, et les visiteurs comme les créatures surnaturelles en sont moins affectés. Ce pouvoir fonctionne même depuis la torpeur : une cité entière peut sombrer parce qu'un ancien rêve."
      },
      {
        id: "presence-10-divinity",
        level: 10,
        name: "Divinité",
        bloodCost: 10,
        duration: "prolonged",
        description: "Tu deviens un dieu aux yeux de ceux qui te voient. Quiconque perçoit ta présence, en personne, sur un écran ou dans une photographie, ressent une vénération absolue. Des foules entières tombent à genoux, des cultes naissent spontanément autour de ton nom, des nations envisagent de te remettre leur destin. Même les anciens ressentent le besoin de te servir et doivent lutter contre leur propre cœur. L'effet dure tant que tu restes dans la mémoire des fidèles, et il ne s'efface pas en une nuit."
      }
    ]
  },

  protean: {
    id: "protean",
    name: "Protéisme",
    description: "Ta chair est argile, tes os sont fluides. La nature sauvage coule dans tes veines et tu peux prendre les formes de la Bête. Ce pouvoir ne change que toi : tu ne transformes ni autrui ni les objets, et un pieu dans le cœur te fige.",
    powers: [
      {
        id: "protean-1-eyes-of-the-beast",
        level: 1,
        name: "Yeux de la Bête",
        bloodCost: 0,
        duration: "scene",
        description: "Tes yeux s'embrasent d'une lueur rouge sang, comme ceux d'un loup surpris par des phares. L'obscurité totale devient claire comme le jour : tu vois chaque détail dans les égouts, les forêts sans lune, les caves sans fenêtre. Mais ce regard ne se cache pas. Les mortels qui croisent tes yeux dans le noir voient deux braises flotter dans les ténèbres et comprennent qu'ils sont face à un prédateur. Tant que tes yeux brillent, parler, séduire ou rassurer un mortel devient difficile, sauf derrière des lunettes noires."
      },
      {
        id: "protean-2-feral-claws",
        level: 2,
        name: "Griffes de la Bête",
        bloodCost: 1,
        duration: "scene",
        description: "Tes ongles s'allongent et s'épaississent, devenant des griffes d'os noir et brillant, dures comme de l'acier trempé et aiguisées comme des rasoirs. Elles poussent en quelques secondes dans un craquement d'os. Ces griffes ne sont pas de simples armes : elles infligent des blessures aggravées qui ne guérissent pas facilement, déchirant la chair vampirique comme du papier. Lacère un ennemi, déchire une gorge, éviscère d'un geste. Ou utilise-les pour escalader : plante-les dans la pierre, le béton, même l'acier, et grimpe comme une araignée."
      },
      {
        id: "protean-3-earth-meld",
        level: 3,
        name: "Fusion avec la Terre",
        bloodCost: 1,
        duration: "prolonged",
        description: "Agenouille-toi sur la terre nue et laisse-toi couler en elle comme dans une eau sombre. En quelques instants, tu disparais sous le sol, à l'abri du jour et des regards. Tu y dors d'un sommeil proche de la torpeur, conscient seulement des vibrations au-dessus de toi : si quelqu'un creuse jusqu'à toi, tu te réveilles. Il te faut de la vraie terre : le béton, l'asphalte et le carrelage te restent fermés, et tu ne peux pas te déplacer une fois enfoui. Au crépuscule, tu émerges du sol comme un mort quittant sa tombe."
      },
      {
        id: "protean-4-shape-of-the-beast",
        level: 4,
        name: "Forme de la Bête",
        bloodCost: 1,
        duration: "scene",
        description: "Ton corps se tord, les os craquent et la chair coule. En quelques instants de transformation douloureuse, tu deviens un loup massif aux yeux rouges, ou une chauve-souris qui file dans la nuit. Tu gardes ton esprit, mais tu gagnes les sens et les armes de l'animal : la vitesse et les crocs du loup, le vol et l'écholocation de la chauve-souris. Tes vêtements et tes petits objets se fondent dans la transformation. Tu peux rester ainsi jusqu'à l'aube. Sous cette forme, la sorcellerie du sang t'est fermée : ni Thaumaturgie, ni Nécromancie, ni Serpentis, ni Vicissitude."
      },
      {
        id: "protean-5-mist-form",
        level: 5,
        name: "Forme de Brume",
        bloodCost: 3,
        duration: "scene",
        description: "Ton corps se dissout en une brume pâle, à peine visible. Les balles te traversent, les lames ne font que disperser ton essence un instant. Tu glisses sous les portes, à travers les grilles et les fissures, tu flottes au-dessus des obstacles. Le feu, le soleil et les pouvoirs surnaturels peuvent encore t'atteindre, et un vent violent te pousse où il veut. Sous cette forme, tu ne peux ni frapper ni utiliser un pouvoir qui exige ton regard. Tu n'es plus qu'une présence froide qui passe."
      },
      {
        id: "protean-6-earth-control",
        level: 6,
        name: "Maîtrise de la Terre",
        bloodCost: 0,
        duration: "prolonged",
        description: "La terre n'est plus un tombeau, c'est un océan. Une fois fondu dans le sol, tu peux t'y mouvoir au pas d'un homme qui marche, glisser sous un champ, remonter sous les pieds de tes ennemis et en surgir au moment choisi. Tu perçois ce qui t'entoure sous la terre comme un nageur sent l'eau. Le pouvoir ne t'ouvre toujours que la terre nue : une dalle de béton ou une route goudronnée t'arrête comme un mur."
      },
      {
        id: "protean-6-flesh-of-marble",
        level: 6,
        name: "Chair de Marbre",
        bloodCost: 3,
        duration: "scene",
        description: "Pour la scène, ta peau prend la dureté du marbre sans perdre sa souplesse. Les coups perdent l'essentiel de leur force contre toi, les balles s'aplatissent, et tu peux saisir une lame à mains nues pour l'écarter de ta gorge. Cette pierre ne protège que des attaques physiques : le feu, le soleil et les pouvoirs surnaturels la traversent comme si elle n'existait pas."
      },
      {
        id: "protean-7-restore-mortal-visage",
        level: 7,
        name: "Visage Mortel Restauré",
        bloodCost: 3,
        duration: "scene",
        description: "La Bête a marqué ton corps de ses frénésies : poils, crocs, regard de fauve. Par un effort de volonté, tu effaces tout cela et tu retrouves pour une scène le visage que tu avais avant l'Étreinte. Ta famille pourrait te reconnaître, un vieil ami te saluer dans la rue. Ce n'est qu'un masque de chair : tu restes pâle, froid et mort. Et quand la scène s'achève, chaque trace de la Bête revient à sa place."
      },
      {
        id: "protean-7-beasts-wrath",
        level: 7,
        name: "Colère de la Bête",
        bloodCost: 3,
        duration: "scene",
        description: "Tu dépasses le loup et la chauve-souris pour devenir la Bête elle-même : une monstruosité hybride, toute en muscles, en crocs et en griffes. Ta force, ta vitesse et ta résistance explosent, et tes morsures déchirent la chair des vampires. Mais il ne reste rien de toi qui puisse parler, séduire ou négocier : tu ne sais plus qu'effrayer. Et la frénésie rôde au bord de ta conscience, plus proche que jamais."
      },
      {
        id: "protean-7-spectral-body",
        level: 7,
        name: "Corps Spectral",
        bloodCost: 3,
        duration: "prolonged",
        description: "Ton corps reste visible, mais il cesse d'être solide. Pour une nuit, tu traverses les murs, les portes blindées et les barreaux, les balles passent à travers toi sans rien toucher. Le feu et le soleil te mordent moins qu'à l'ordinaire. Cette liberté a son revers : tu ne peux rien saisir, rien frapper, rien porter. Tu es un fantôme de chair, présent partout mais incapable d'agir sur le monde."
      },
      {
        id: "protean-8-purify-impaled-beast",
        level: 8,
        name: "Purifier la Bête Empalée",
        bloodCost: 3,
        duration: "instant",
        description: "Ton corps rejette avec violence tout ce qui lui est étranger. Les balles jaillissent de tes plaies, les éclats de verre sortent de ta chair, et même le pieu enfoncé dans ton cœur est éjecté comme un projectile. C'est la seule réponse connue à la paralysie du bois : il faut pourtant une volonté de fer pour l'accomplir alors que ton corps est figé. Les blessures restent ouvertes : tu as chassé l'intrus, pas réparé les dégâts."
      },
      {
        id: "protean-9-inward-focus",
        level: 9,
        name: "Concentration Intérieure",
        bloodCost: 9,
        duration: "scene",
        description: "Tu retournes toute ta métamorphose vers l'intérieur. Ton corps devient une machine de guerre parfaite : tu agis plusieurs fois là où d'autres agissent une seule, tes coups frappent avec une violence accrue, et les blessures qu'on t'inflige perdent une grande part de leur gravité. Cet état s'ajoute à ta Célérité, ta Force d'Âme et ta Puissance plutôt que de les remplacer. Il dévore ton sang à chaque instant où tu le maintiens."
      },
      {
        id: "protean-10-mythic-form",
        level: 10,
        name: "Forme Mythique",
        bloodCost: 10,
        duration: "scene",
        description: "Ta chair oublie qu'elle a été humaine et prend la forme d'une créature de légende : dragon aux ailes de cuir, griffon, serpent de mer, loup géant des sagas. Tu incarnes le mythe avec tous ses pouvoirs : tu voles sans effort au-dessus des nuages, ton souffle embrase une forêt, tes écailles repoussent les canons et ta seule silhouette fait fuir une ville entière. Tu n'es plus un vampire qui se transforme, mais le monstre de l'ancien monde dont les hommes ont gardé le souvenir terrifié. Quand tu reprends forme humaine, les témoins parleront de cette nuit pendant des générations."
      }
    ]
  },

  obtenebration: {
    id: "obtenebration",
    name: "Obténébration",
    description: "L'Abysse répond à ton appel. Les ténèbres t'obéissent comme des serviteurs, et dans ton ombre quelque chose de terrible attend. Tu vois à travers tes propres ténèbres ; les autres, vampires compris, y sont aveugles. Le feu et le soleil restent tes ennemis.",
    powers: [
      {
        id: "obtenebration-1-shadow-play",
        level: 1,
        name: "Jeu d'Ombres",
        bloodCost: 0,
        duration: "scene",
        description: "Les ombres autour de toi s'animent à ton contact. Fais danser ton ombre sur le mur, étire celle d'un arbre pour couvrir une fenêtre, assombris un coin de la pièce pour te cacher. Les ombres que tu manipules deviennent plus sombres, plus denses, presque palpables. Éteins une lampe sans la toucher en l'enveloppant d'obscurité, fais croire à quelqu'un qu'une silhouette se déplace dans l'ombre, ou crée des zones d'obscurité pour faciliter ta fuite. C'est subtil, mais terriblement efficace pour créer la peur et la confusion."
      },
      {
        id: "obtenebration-2-shroud-of-night",
        level: 2,
        name: "Linceul de la Nuit",
        bloodCost: 1,
        duration: "scene",
        description: "Invoque une sphère de ténèbres absolues qui avale toute lumière. À l'intérieur : obscurité totale, même pour ceux qui peuvent voir dans le noir. Les lampes torches y meurent, les sorts de lumière s'éteignent. Pire encore, le Linceul étouffe le son, transformant les cris en murmures étouffés. Les victimes prisonnières sont aveugles, sourdes, désorientées, paniquées. Toi, tu te déplaces dans ces ténèbres comme chez toi. Crée le chaos dans un combat, couvre ta fuite, ou isole une victime pour l'éliminer sans témoins."
      },
      {
        id: "obtenebration-3-arms-of-the-abyss",
        level: 3,
        name: "Bras des Abysses",
        bloodCost: 1,
        duration: "scene",
        description: "Ton ombre se soulève et des tentacules d'obscurité solide en jaillissent comme des serpents. Ces membres d'ombre sont froids au toucher, solides comme de la chair mais faits de ténèbres vivantes. Ils agrippent, frappent, étranglent selon ta volonté. Emprisonne un adversaire dans une étreinte glaciale, gifle une arme hors d'une main, soulève quelqu'un et projette-le contre un mur. Les tentacules peuvent aussi servir à manipuler des objets à distance. Les victimes paniquent souvent, horrifiées de se faire toucher par l'Abysse elle-même."
      },
      {
        id: "obtenebration-4-black-metamorphosis",
        level: 4,
        name: "Métamorphose Noire",
        bloodCost: 3,
        duration: "scene",
        description: "Tu appelles l'Abysse en toi et ton corps devient un hybride d'ombre et de chair. Ta peau se couvre de ténèbres mouvantes, et quatre tentacules d'obscurité jaillissent de ton dos et de tes flancs. Tu frappes plus souvent et plus fort, tu vois dans le noir absolu, et le simple contact de tes tentacules glace et affaiblit tes adversaires. Ton aspect est terrifiant : les mortels fuient en hurlant, et même les vampires hésitent. Impossible de passer inaperçu sous cette forme."
      },
      {
        id: "obtenebration-5-tenebrous-form",
        level: 5,
        name: "Forme Ténébreuse",
        bloodCost: 3,
        duration: "scene",
        description: "Ton corps se dissout en une flaque d'ombre vivante, sans masse ni épaisseur. Tu glisses le long des murs, coules sous les portes, rampes au plafond, te faufiles par la moindre fissure. Les armes physiques te traversent sans effet. Tu peux envelopper une victime de ton obscurité pour l'aveugler et l'oppresser, mais tu ne peux pas la frapper. Le feu et le soleil te blessent toujours, et une lumière vive te force à fuir vers les ténèbres."
      },
      {
        id: "obtenebration-6-the-darkness-within",
        level: 6,
        name: "Ténèbres Intérieures",
        bloodCost: 3,
        duration: "instant",
        description: "Tu ouvres la bouche et tu vomis une nuée de ténèbres qui s'abat sur ta cible. L'obscurité l'engloutit, se glisse dans ses veines et lui siphonne son sang, goutte après goutte. Une victime robuste peut résister un temps. Quand tu rappelles la nuée, elle te rend une partie du sang volé. Mais ce sang porte la trace de sa victime, et le boire ainsi peut te lier à elle d'un lien de sang."
      },
      {
        id: "obtenebration-6-shadowstep",
        level: 6,
        name: "Pas d'Ombre",
        bloodCost: 1,
        duration: "instant",
        description: "Tu entres dans une ombre et tu ressors d'une autre, toute proche. Tu ne traverses pas l'espace, tu le contournes par l'Abysse : un mur, une porte blindée, même une barrière mystique ne t'arrêtent pas. Le saut reste court, d'une pièce à la suivante ou d'un trottoir à l'autre, et il te faut une ombre au départ comme à l'arrivée. Un saut mal maîtrisé peut te laisser un instant prisonnier de l'Abysse, ce qui est une expérience que personne ne souhaite revivre."
      },
      {
        id: "obtenebration-7-shadow-twin",
        level: 7,
        name: "Jumeau d'Ombre",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu arraches une ombre à son propriétaire et tu lui donnes vie : la tienne, ou celle d'un autre. Elle se dresse, se détache du mur et obéit à tes ordres, espionne, attaque, porte des messages. Elle ne possède qu'une partie des forces de son propriétaire, et retourne à lui au plus tard à l'aube. Si elle est détruite, celui à qui elle appartient perd une grande part de sa volonté, et la terreur du feu le guette."
      },
      {
        id: "obtenebration-8-oubliette",
        level: 8,
        name: "Oubliette",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu refermes les ténèbres autour d'une seule cible comme un poing. Elle se retrouve prisonnière d'une cellule d'obscurité totale, sans air ni lumière. Un mortel y suffoque en quelques minutes. Un vampire y reste suspendu, coupé du monde et de ses Disciplines, jusqu'à ce que tu le libères. Une victime agile peut tenter d'esquiver au moment où le piège se forme. La prison se dissout au premier contact du soleil."
      },
      {
        id: "obtenebration-9-ahrimans-demesne",
        level: 9,
        name: "Domaine d'Ahriman",
        bloodCost: 9,
        duration: "instant",
        description: "Après un long moment de concentration, tu ouvres une main et le néant en jaillit. Un vide d'obscurité absolue s'étend autour de toi sur une large zone, et frappe d'un seul coup tout ce qui s'y trouve, amis comme ennemis. Les vampires y subissent des blessures qui ne guérissent qu'avec peine, et les plus faibles n'en ressortent pas. Puis l'Abysse se retire en emportant les corps de ceux qu'il a tués. Il ne reste rien à enterrer."
      },
      {
        id: "obtenebration-10-eclipse-the-sun",
        level: 10,
        name: "Éclipser le Soleil",
        bloodCost: 10,
        duration: "scene",
        description: "Le rêve ultime du clan Lasombra. Tu craches des ténèbres si massives qu'elles montent au ciel et voilent le soleil lui-même sur toute une région. Le jour devient nuit : les vampires peuvent marcher dehors à midi sous ta protection, et les mortels lèvent les yeux vers un ciel noir qu'aucune science n'explique. Tant que dure la scène, l'astre qui condamne ta race est ton prisonnier. C'est un acte de guerre contre Dieu, et le monde entier en parlera."
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
    description: "La folie est contagieuse, et tu es le vecteur. Dans ton sillage, les esprits se brisent comme du verre. Tu n'implantes pas la démence : tu ouvres une brèche vers ce que ta victime enfouit, et tu laisses tout remonter.",
    powers: [
      {
        id: "dementation-1-passion",
        level: 1,
        name: "Passion",
        bloodCost: 0,
        duration: "prolonged",
        description: "Tu parles à quelqu'un et tu tournes le cadran de ses émotions. Tu ne choisis pas ce qu'il ressent : tu amplifies ou tu éteins ce qui est déjà là. Une pointe d'agacement devient une rage froide, une tristesse discrète un désespoir écrasant, une peur vague une panique. Ou au contraire, la colère du garde retombe et il oublie pourquoi il s'emportait. L'effet dure de quelques instants à plusieurs mois selon ta force, et la victime ne comprend jamais d'où lui vient ce changement."
      },
      {
        id: "dementation-2-the-haunting",
        level: 2,
        name: "La Hantise",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu ouvres une fissure dans les sens de ta victime. Elle aperçoit des silhouettes au coin de l'œil, entend son nom murmuré dans une pièce vide, sent une odeur de pourriture que personne d'autre ne perçoit. Tu choisis le sens touché, et les visions frappent surtout quand elle est seule, la nuit. Elles sont fugaces, jamais assez nettes pour être prouvées, et durent d'une nuit à une année entière. Assez pour lui faire douter de sa propre raison."
      },
      {
        id: "dementation-3-eyes-of-chaos",
        level: 3,
        name: "Yeux du Chaos",
        bloodCost: 0,
        duration: "scene",
        description: "Ta folie devient une lentille qui révèle les motifs cachés du monde. Tu lis la vraie Nature d'une personne derrière le masque qu'elle porte, tu déchiffres un message codé, tu devines la main invisible derrière une suite de coïncidences. Plus tu connais ta cible, plus elle se dévoile. Mais la vérité ne te parvient jamais en clair : elle prend la forme d'images, de symboles, d'allégories qu'il te faut interpréter. Les Malkaviens appellent ça la sagesse du fou."
      },
      {
        id: "dementation-4-voice-of-madness",
        level: 4,
        name: "Voix de la Folie",
        bloodCost: 1,
        duration: "scene",
        description: "Tu élèves la voix, et ta démence se glisse dans tes mots. Ceux qui t'écoutent basculent : certains entrent en frénésie et frappent tout ce qui bouge, d'autres sont saisis d'une terreur aveugle et fuient comme devant le feu. Les mortels n'ont aucune défense. Les vampires peuvent lutter, mais beaucoup cèdent. Le pouvoir n'épargne pas sa source : ta propre Bête entend aussi ces paroles, et tu risques de sombrer avec ton auditoire."
      },
      {
        id: "dementation-5-total-insanity",
        level: 5,
        name: "Démence Totale",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tu captes toute l'attention de ta victime, et tu fais remonter d'un coup tout ce que son esprit enfouissait. Elle sombre dans une folie multiple : délires, obsessions, paranoïa, crises de terreur, voix qui lui parlent. L'effet dure de quelques instants à une année entière selon ta force. Une victime à la volonté solide peut s'en libérer plus tôt en luttant de toutes ses forces. Ceux qui en reviennent ne sont plus tout à fait les mêmes."
      },
      {
        id: "dementation-6-lingering-malaise",
        level: 6,
        name: "Malaise Persistant",
        bloodCost: 3,
        duration: "permanent",
        description: "Il te suffit d'une conversation pour planter une graine qui ne mourra jamais. Tu choisis un trouble précis, et tu le décris à ta victime en parlant avec elle : une phobie, une obsession, une paranoïa, une voix. Ce trouble s'installe pour toujours. Les thérapies, les années, la volonté ne l'effacent pas. La victime se défend mieux si son esprit est solide. Tu ne peux accomplir ce travail qu'une fois par nuit, et il exige un vrai échange, pas un simple regard."
      },
      {
        id: "dementation-6-shattered-mirror",
        level: 6,
        name: "Miroir Brisé",
        bloodCost: 0,
        duration: "prolonged",
        description: "Tu croises le regard de ta victime et tu lui renvoies ta propre folie. Tous tes troubles, tes obsessions et tes failles mentales passent dans son esprit, comme un reflet dans un miroir fêlé. Elle se met à compter les fissures du plafond, à entendre tes voix, à trembler de tes peurs. L'effet dure d'une heure à une année. Une victime très lucide peut lutter, mais elle connaîtra désormais, de l'intérieur, ce que tu endures chaque nuit."
      },
      {
        id: "dementation-7-restructure",
        level: 7,
        name: "Restructuration",
        bloodCost: 3,
        duration: "permanent",
        description: "Tu plonges ton regard dans le sien et tu réécris le fondement de sa personnalité : sa Nature. Le loyal devient traître, le lâche devient fanatique, le rebelle devient conformiste. Le changement est permanent, et la victime le vit comme une évidence : elle a toujours été ainsi. Un esprit maître de lui résiste mieux. Et l'opération est dangereuse : si elle t'échappe, c'est toi qui prends la Nature de ta victime."
      },
      {
        id: "dementation-8-personal-scourge",
        level: 8,
        name: "Fléau Personnel",
        bloodCost: 3,
        duration: "scene",
        description: "D'un toucher ou d'un regard, tu retournes la volonté de ta victime contre son propre corps. Plus elle est déterminée, plus elle souffre : sa force mentale devient la lame qui la déchire de l'intérieur. Pendant ce temps, elle est incapable d'agir, tordue par une douleur que rien ne soulage. Ni la résistance physique ni la Force d'Âme ne la protègent : seule la force de son âme limite les dégâts."
      },
      {
        id: "dementation-9-lunatic-eruption",
        level: 9,
        name: "Éruption Lunatique",
        bloodCost: 9,
        duration: "scene",
        description: "Tu deviens une bombe psychique. Ta folie déferle autour de toi, sur un pâté de maisons ou une métropole entière selon ta puissance. Jusqu'à l'aube, les mortels s'émeutent, pillent, se battent dans les rues ; les vampires tombent en frénésie de faim. Les esprits les plus maîtres d'eux-mêmes résistent, mais la ville se souviendra de cette nuit comme d'une épidémie de démence."
      },
      {
        id: "dementation-10-awakening-of-malkav",
        level: 10,
        name: "L'Éveil de Malkav",
        bloodCost: 10,
        duration: "prolonged",
        description: "Tu ouvres l'esprit d'une ville entière à la folie de ton fondateur. Pendant des nuits, la réalité commune se fissure : les habitants voient la même vision, entendent les mêmes voix, croient ensemble à des vérités nouvelles et terribles. Les lois, les institutions, les croyances se réécrivent selon la logique de la démence que tu as libérée. Ce qui était raisonnable devient absurde, et l'absurde devient la règle. Quand la marée se retire, la ville n'est plus jamais tout à fait la même."
      }
    ]
  },

  chimerstry: {
    id: "chimerstry",
    name: "Chimérie",
    description: "La réalité est malléable pour ceux qui savent voir. Tisse des mensonges si convaincants que le monde lui-même y croit. Tes illusions trompent les sens comme les caméras, mais elles tombent dès qu'on prouve leur fausseté, et un Auspex assez puissant peut les percer s'il les cherche.",
    powers: [
      {
        id: "chimerstry-1-ignis-fatuus",
        level: 1,
        name: "Ignis Fatuus",
        bloodCost: 1,
        duration: "scene",
        description: "Crée une illusion simple affectant un seul sens. Fais apparaître une image : un visage dans la foule, un mur où il n'y a qu'un couloir, une silhouette menaçante dans l'ombre. Ou crée un son : des pas derrière quelqu'un, une voix appelant au secours, le clic d'une arme qu'on arme. Ou même une odeur : fumée d'incendie, parfum distinctif, odeur de cadavre. L'illusion est statique, comme une photographie ou un enregistrement en boucle, mais parfaitement convaincante pour le sens ciblé. Crée des distractions, sème la confusion, ou fais croire à une menace inexistante."
      },
      {
        id: "chimerstry-2-fata-morgana",
        level: 2,
        name: "Fata Morgana",
        bloodCost: 1,
        duration: "scene",
        description: "Tes illusions trompent désormais tous les sens à la fois : un mur de briques qu'on voit, qu'on entend résonner, dont on sent l'odeur de poussière ; un feu qui crépite et dégage de la fumée ; un inconnu qui respire et sent le tabac. L'illusion reste immobile, comme un décor de théâtre, et elle n'a aucune substance : une main tendue passe à travers, et l'illusion se dissipe pour celui qui a compris. Il te faut connaître ce que tu imites pour le rendre convaincant."
      },
      {
        id: "chimerstry-3-apparition",
        level: 3,
        name: "Apparition",
        bloodCost: 1,
        duration: "scene",
        description: "Tes illusions prennent vie. Une silhouette marche, un chien aboie, une foule s'agite, un double de toi s'enfuit dans une direction pendant que tu files dans l'autre. Tant que tu es là pour la diriger, l'illusion se meut comme tu le veux. Une fois que tu t'éloignes, elle ne fait plus que répéter un mouvement simple, comme une boucle : un garde qui fait les cent pas, une ombre qui passe à la fenêtre. Elle ne peut toujours rien toucher."
      },
      {
        id: "chimerstry-4-permanency",
        level: 4,
        name: "Permanence",
        bloodCost: 1,
        duration: "prolonged",
        description: "Tes illusions persistent maintenant sans que tu aies besoin de te concentrer. Crée une scène complète - un bureau luxueux, un mur de briques cachant un passage secret, un cadavre sanglant - et elle reste en place pendant des heures ou des jours, même quand tu es parti. Tu peux créer des repaires illusoires, des preuves de crimes qui n'ont jamais eu lieu, des personnes qui continuent leur vie apparente. Les illusions ne disparaissent que si tu le décides, si quelqu'un les détruit (révélant le vide dessous), ou après plusieurs jours. Tu peux maintenir plusieurs illusions permanentes simultanément."
      },
      {
        id: "chimerstry-5-horrid-reality",
        level: 5,
        name: "Réalité Horrible",
        bloodCost: 3,
        duration: "scene",
        description: "Tu plonges une seule victime dans une hallucination qui n'existe que pour elle, mais à laquelle elle croit de toute son âme. Le feu qu'elle voit la brûle vraiment, la lame imaginaire l'entaille, le mur la retient. Ses blessures sont réelles pour son corps. Le pouvoir ne tue pas : au pire, la victime s'effondre, inconsciente, ou sombre en torpeur. Et si quelqu'un parvient à la convaincre que tout était faux avant la nuit suivante, ses blessures disparaissent."
      },
      {
        id: "chimerstry-6-false-resonance",
        level: 6,
        name: "Fausse Résonance",
        bloodCost: 0,
        duration: "permanent",
        description: "Tes illusions trompent maintenant ceux qui voient au-delà des apparences. Elles portent une aura crédible, des émotions, des pensées simples, si bien que celui qui sonde leur esprit croit trouver un être réel. Un garde illusoire semble s'ennuyer, un ennemi imaginaire déborde de haine. Seuls les sens les plus aiguisés perçoivent encore que quelque chose sonne faux."
      },
      {
        id: "chimerstry-6-fatuus-mastery",
        level: 6,
        name: "Maîtrise du Fatuus",
        bloodCost: 0,
        duration: "permanent",
        description: "Les illusions simples ne te coûtent plus rien. Tu crées des mirages, des décors et des silhouettes animées sans effort, et tu en diriges plusieurs à la fois sans y penser, comme on respire. Tu peux même les maintenir à bonne distance de toi, à plusieurs rues ou plusieurs kilomètres. Tu peux peupler un château vide de serviteurs illusoires qui vaquent à leurs tâches, mais ils restent des images : ils ne touchent rien et tombent si on les démasque."
      },
      {
        id: "chimerstry-6-shared-nightmare",
        level: 6,
        name: "Cauchemar Partagé",
        bloodCost: 3,
        duration: "scene",
        description: "Tu étends ta Réalité Horrible à toute une foule. Chacun voit le même cauchemar et y croit : la salle prend feu, le plafond s'effondre, une créature se jette sur eux. Chacun en subit les blessures selon sa propre crédulité. Les esprits plus forts s'en sortent mieux, et celui qu'on parvient à convaincre que tout était faux guérit de ses plaies. Comme pour une seule victime, le cauchemar ne tue pas : il terrasse."
      },
      {
        id: "chimerstry-7-far-fatuus",
        level: 7,
        name: "Fatuus Lointain",
        bloodCost: 1,
        duration: "scene",
        description: "Tu n'as plus besoin d'être présent pour tromper. Tu projettes tes illusions dans un lieu que tu as déjà vu, ou que tu visualises d'après une photographie ou une description. Une apparition surgit dans le bureau d'un ennemi à l'autre bout de la ville, une fausse alarme retentit dans un entrepôt lointain. Plus le lieu t'est familier, plus l'illusion y sera fidèle. Un lieu connu seulement par une description floue te laisse peu de prise."
      },
      {
        id: "chimerstry-7-suspension-of-disbelief",
        level: 7,
        name: "Suspension d'Incrédulité",
        bloodCost: 1,
        duration: "scene",
        description: "Tu forces les esprits à accepter l'impossible. Un dragon cracheur de feu au milieu d'une gare, un mort qui revient saluer sa veuve : les témoins y croient, malgré l'absurdité. Plus ta force est grande, plus ils sont nombreux à se laisser convaincre. Tu peux aussi faire l'inverse : rendre le réel invraisemblable, et convaincre une foule que l'incendie bien réel n'est qu'un mirage."
      },
      {
        id: "chimerstry-8-synesthesia",
        level: 8,
        name: "Synesthésie",
        bloodCost: 3,
        duration: "prolonged",
        description: "Tu mélanges les sens de ta victime. Elle entend les couleurs, voit les sons, goûte la texture des objets, sent les odeurs comme des caresses. Le monde devient un chaos incompréhensible. Sur une seule personne, l'effet dure d'une semaine à toujours. Sur une foule entière, il est moins profond mais dure jusqu'à l'aube, et transforme une salle de concert ou un marché en asile."
      },
      {
        id: "chimerstry-9-mayaparisatya",
        level: 9,
        name: "Mayaparisatya",
        bloodCost: 9,
        duration: "scene",
        description: "L'illusion devient réelle. Pour une scène, tu altères ou crées vraiment des objets et des êtres : une arme qui ne blesse plus, de la fumée devenue solide, une porte là où il n'y en avait pas. Avec une concentration extrême, tu peux même effacer définitivement un objet de la réalité. Sur un être vivant, tu peux tordre sa chair et la blesser sans recours. Ce pouvoir te coûte une part de ton âme : chaque usage t'épuise profondément."
      },
      {
        id: "chimerstry-10-maya-creation",
        level: 10,
        name: "Création de Maya",
        bloodCost: 10,
        duration: "permanent",
        description: "Tu ne trompes plus le monde : tu le rêves, et il obéit. Tu fais naître un palais sur un terrain vague, une forêt au milieu d'une ville, une créature qui respire, parle et se souvient. Ce que tu crées ainsi devient aussi vrai que la pierre, et ne disparaît plus à l'aube ni quand on le démasque. Les mortels qui y vivent ne savent pas que leur monde est né d'un mensonge. Tu es devenu ce que les Ravnos craignent et vénèrent : un faiseur de réalité."
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
        bloodCost: 0,
        duration: "permanent",
        description: "Tes muscles dorsaux sont enfin assez puissants. Tu peux décoller du sol par ta seule force et voler réellement. Ton vol est peut-être lourd et bruyant au début, mais le ciel t'appartient désormais. Tu peux faire du surplace, effectuer des virages serrés, et fondre sur tes proies depuis les airs."
      },
      {
        level: 4,
        name: "Vol Supersonique",
        bloodCost: 0,
        duration: "permanent",
        description: "Tu ne voles plus, tu files. Tu deviens un missile vivant, capable d'atteindre des vitesses qui rivalisent avec les véhicules modernes. Le vent hurle à tes oreilles, la ville défile floue sous tes yeux. Idéal pour les interceptions, les fuites éclairs, ou pour frapper avec une énergie cinétique dévastatrice."
      },
      {
        level: 5,
        name: "Maître du Ciel",
        bloodCost: 0,
        duration: "permanent",
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
  giovanni: ["dominate", "necromancy", "potence"],
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

// Identifiants de clan stockés sur les fiches (data/clans.py) ou anciens noms V5,
// ramenés aux clés de CLAN_DISCIPLINES.
const CLAN_ALIASES = {
  setite: "setites",
  ministry: "setites",
  banu_haqim: "assamites",
  assamite: "assamites",
  hecata: "giovanni",
  daughters_cacophony: "daughters_of_cacophony",
  gargouilles: "gargoyles",
  malkavien: "malkavian"
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
  const clanKey = clan?.toLowerCase();
  const clanLower = CLAN_ALIASES[clanKey] || clanKey;

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
