"""
Clans Vampiriques et leurs Compulsions
Basé sur Vampire: The Masquerade 5th Edition

Chaque clan a des compulsions progressives selon le niveau de Soif (1-5).
Les compulsions deviennent de plus en plus impératives à mesure que la Soif augmente.
"""

from data.blood_actions import normalize_clan

CLANS = {
    "brujah": {
        "nom": "Brujah",
        "description": "Les Rebelles - Vampires passionnés et colériques",
        "compulsions": {
            1: {
                "nom": "Irritation",
                "description": "Une tension sourde monte en toi. Les petites contrariétés te semblent insupportables.",
                "directive": "Tu dois exprimer ton agacement de manière visible dans tes prochains messages. Un soupir, un regard noir, une remarque acerbe."
            },
            2: {
                "nom": "Provocation",
                "description": "Le Sang des Rebelles s'éveille. Tu ressens le besoin de défier l'autorité.",
                "directive": "Tu dois contredire ou remettre en question la prochaine personne qui te donne un ordre ou émet une opinion. Tu ne peux pas simplement acquiescer."
            },
            3: {
                "nom": "Confrontation",
                "description": "La rage ancestrale des Brujah pulse dans tes veines. Le conflit t'appelle.",
                "directive": "Tu dois activement chercher la confrontation. Insulte, défi, provocation physique... Tu ne peux pas ignorer une offense, même mineure."
            },
            4: {
                "nom": "Fureur",
                "description": "Le Sang hurle. Chaque fibre de ton être réclame la violence.",
                "directive": "Tu dois répondre à toute provocation par la force. Tu ne peux pas te retenir si quelqu'un te manque de respect. La violence verbale ou physique est ta seule réponse."
            },
            5: {
                "nom": "FRÉNÉSIE DE RAGE",
                "description": "🩸 LE SANG PREND LE CONTRÔLE 🩸\nTu n'es plus qu'instinct et fureur. La Bête Brujah s'est éveillée.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois attaquer la source de ta frustration la plus proche. Tu ne peux pas parler, seulement grogner et frapper. Seul le sang ou l'épuisement t'arrêtera."
            }
        }
    },
    "gangrel": {
        "nom": "Gangrel",
        "description": "Les Fauves - Vampires sauvages et bestials",
        "compulsions": {
            1: {
                "nom": "Instinct",
                "description": "Tes sens s'aiguisent. Tu perçois le monde comme un prédateur.",
                "directive": "Tu dois décrire ton environnement en termes de proie, de menace et de territoire. Renifle l'air, observe les issues."
            },
            2: {
                "nom": "Territorialité",
                "description": "Cet endroit est le tien. Les intrus ne sont pas les bienvenus.",
                "directive": "Tu dois marquer ta présence et montrer que cet espace t'appartient. Tu es hostile à tout nouveau venu jusqu'à ce qu'il prouve sa soumission."
            },
            3: {
                "nom": "Chasse",
                "description": "La Bête veut chasser. Pas pour le sang, mais pour le plaisir de la traque.",
                "directive": "Tu dois traquer quelqu'un ou quelque chose. Suit une cible, observe ses faiblesses. Tu ne peux pas rester immobile longtemps."
            },
            4: {
                "nom": "Sauvagerie",
                "description": "Les mots deviennent difficiles. Tu penses comme un animal.",
                "directive": "Tu dois t'exprimer de manière primitive. Phrases courtes, grognements, langage corporel animal. La civilisation te devient étrangère."
            },
            5: {
                "nom": "FRÉNÉSIE BESTIALE",
                "description": "🐺 LA BÊTE PREND LE CONTRÔLE 🐺\nTu n'es plus humain. Tu es le prédateur ultime.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois fuir vers un endroit sauvage ou attaquer comme un animal. Griffes, crocs, instinct pur. Tu ne reconnais plus ami ou ennemi."
            }
        }
    },
    "malkavian": {
        "nom": "Malkavien",
        "description": "Les Fous - Vampires maudits par la folie prophétique",
        "compulsions": {
            1: {
                "nom": "Distorsion",
                "description": "La réalité vacille légèrement. Tu perçois des détails que personne d'autre ne voit.",
                "directive": "Tu dois mentionner un détail étrange que tu es seul à percevoir. Une ombre qui bouge, un murmure, une odeur impossible."
            },
            2: {
                "nom": "Obsession",
                "description": "Une pensée s'ancre dans ton esprit et refuse de partir.",
                "directive": "Tu dois te fixer sur un détail apparemment insignifiant et y revenir constamment. Cela a un sens caché que tu dois découvrir."
            },
            3: {
                "nom": "Vérité Douloureuse",
                "description": "Tu vois au-delà des masques. Les vérités que les autres cachent te sont révélées.",
                "directive": "Tu dois révéler une vérité désagréable sur quelqu'un présent, même si tu l'inventes. Ton 'insight' doit être partagé, peu importe les conséquences."
            },
            4: {
                "nom": "Fracture",
                "description": "Ta perception se fragmente. Passé, présent et futur se mélangent.",
                "directive": "Tu dois agir selon une réalité différente. Parle à des personnes absentes, réagis à des événements qui ne se sont pas encore produits, ou revit un trauma passé."
            },
            5: {
                "nom": "FRÉNÉSIE DE DÉMENCE",
                "description": "🌀 LA FOLIE PREND LE CONTRÔLE 🌀\nLe Réseau de la Folie te submerge. Mille voix hurlent dans ta tête.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois agir de manière complètement incohérente. Tu ne distingues plus le réel de l'imaginaire. Tes actions n'ont aucune logique apparente."
            }
        }
    },
    "nosferatu": {
        "nom": "Nosferatu",
        "description": "Les Horreurs - Vampires monstrueux vivant dans l'ombre",
        "compulsions": {
            1: {
                "nom": "Paranoïa",
                "description": "Ils te regardent. Ils savent. Tu dois te cacher.",
                "directive": "Tu dois chercher les ombres et éviter d'être le centre de l'attention. Observe qui te regarde, qui pourrait te trahir."
            },
            2: {
                "nom": "Collection de Secrets",
                "description": "L'information est le pouvoir. Tu dois savoir ce que les autres cachent.",
                "directive": "Tu dois tenter d'extraire un secret de quelqu'un présent. Manipule, écoute, fouille. Un secret, n'importe lequel."
            },
            3: {
                "nom": "Infestation",
                "description": "Tu ressens le besoin de marquer cet endroit comme tien, de le corrompre subtilement.",
                "directive": "Tu dois laisser une trace de ton passage, quelque chose de dérangeant. Un message caché, un objet déplacé, une rumeur semée."
            },
            4: {
                "nom": "Révélation",
                "description": "Ils doivent voir. Ils doivent comprendre l'horreur de ton existence.",
                "directive": "Tu dois rappeler à quelqu'un ta vraie nature. Laisse entrevoir le monstre, fais-leur peur, montre-leur qu'ils ne sont que des proies."
            },
            5: {
                "nom": "FRÉNÉSIE DE TERREUR",
                "description": "👁️ L'HORREUR PREND LE CONTRÔLE 👁️\nQu'ils voient. Qu'ils hurlent. Qu'ils sachent ce que tu es vraiment.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois terroriser. Révèle-toi pleinement, pourchasse, fais comprendre à tous que tu es leur cauchemar incarné."
            }
        }
    },
    "toreador": {
        "nom": "Toreador",
        "description": "Les Artistes - Vampires obsédés par la beauté et la passion",
        "compulsions": {
            1: {
                "nom": "Distraction",
                "description": "Quelque chose de beau capte ton attention. Tu ne peux pas t'en détacher facilement.",
                "directive": "Tu dois t'attarder sur un détail esthétique (une personne, un objet, une scène). Décris sa beauté, admire-la ouvertement."
            },
            2: {
                "nom": "Critique",
                "description": "Ton œil d'artiste ne peut tolérer la médiocrité.",
                "directive": "Tu dois critiquer quelque chose de laid ou de médiocre dans ton environnement. L'imperfection te blesse physiquement."
            },
            3: {
                "nom": "Fixation",
                "description": "Cette chose est parfaite. Tu ne peux pas la quitter des yeux.",
                "directive": "Tu dois te fixer sur un objet de beauté et avoir du mal à t'en détacher. Les autres doivent te secouer pour te faire réagir."
            },
            4: {
                "nom": "Possession",
                "description": "Cette beauté doit être tienne. À tout prix.",
                "directive": "Tu dois tenter d'acquérir ou de posséder l'objet de ta fascination, qu'il s'agisse d'une œuvre d'art ou d'une personne."
            },
            5: {
                "nom": "FRÉNÉSIE D'OBSESSION",
                "description": "💋 LA PASSION PREND LE CONTRÔLE 💋\nRien d'autre n'existe. Seulement cette perfection absolue.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu es complètement hypnotisé par quelque chose de beau. Tu ne réagis plus au monde extérieur. Tu défendrais cette beauté jusqu'à la mort finale."
            }
        }
    },
    "tremere": {
        "nom": "Tremere",
        "description": "Les Sorciers - Vampires pratiquant la Thaumaturgie",
        "compulsions": {
            1: {
                "nom": "Curiosité",
                "description": "Un mystère se présente. Tu dois le comprendre.",
                "directive": "Tu dois poser des questions sur quelque chose d'inexpliqué. Tu ne peux pas laisser un mystère sans investigation."
            },
            2: {
                "nom": "Expérimentation",
                "description": "La théorie ne suffit pas. Tu dois tester.",
                "directive": "Tu dois tester une hypothèse ou une théorie, même si c'est risqué ou socialement inapproprié. La connaissance justifie les moyens."
            },
            3: {
                "nom": "Acquisition",
                "description": "Ce savoir, cet artefact, ce pouvoir... tu en as besoin.",
                "directive": "Tu dois tenter d'acquérir une connaissance ou un objet de pouvoir. Négocie, vole, manipule. Le savoir doit être tien."
            },
            4: {
                "nom": "Hubris",
                "description": "Tu es supérieur. Ta maîtrise de l'occulte te place au-dessus des autres.",
                "directive": "Tu dois démontrer ta supériorité intellectuelle. Corrige les erreurs des autres, affiche ton savoir, rabaisse les ignorants."
            },
            5: {
                "nom": "FRÉNÉSIE DE POUVOIR",
                "description": "🔮 LA SOIF DE SAVOIR PREND LE CONTRÔLE 🔮\nPlus de limites. Plus de règles. Le pouvoir absolu est à portée de main.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois utiliser tes pouvoirs sans retenue. Démontre ta puissance, peu importe les conséquences. La Mascarade, la prudence, tout cela est pour les faibles."
            }
        }
    },
    "ventrue": {
        "nom": "Ventrue",
        "description": "Les Rois - Vampires nobles et dominateurs",
        "compulsions": {
            1: {
                "nom": "Supériorité",
                "description": "Tu es au-dessus d'eux. Ils doivent le savoir.",
                "directive": "Tu dois rappeler subtilement ton statut supérieur. Un regard condescendant, un commentaire sur leur rang, une posture dominante."
            },
            2: {
                "nom": "Commandement",
                "description": "Quelqu'un doit obéir. L'ordre doit être maintenu.",
                "directive": "Tu dois donner un ordre à quelqu'un et t'assurer qu'il est suivi. Tu ne peux pas tolérer la désobéissance."
            },
            3: {
                "nom": "Contrôle",
                "description": "Cette situation échappe à ton contrôle. C'est inacceptable.",
                "directive": "Tu dois prendre le contrôle de la situation actuelle. Impose ton plan, dirige les autres, refuse toute suggestion qui n'est pas la tienne."
            },
            4: {
                "nom": "Tyrannie",
                "description": "Ils doivent tous plier. Ta volonté est absolue.",
                "directive": "Tu dois forcer tous les présents à reconnaître ton autorité. Menaces, punitions, humiliations. L'obéissance n'est pas négociable."
            },
            5: {
                "nom": "FRÉNÉSIE DE DOMINATION",
                "description": "👑 LE ROI PREND LE CONTRÔLE 👑\nTu es le maître absolu. Tous doivent ramper devant toi.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois soumettre tous ceux qui t'entourent. Violence, Domination mentale, terreur pure. Quiconque te défie doit être détruit."
            }
        }
    },
    "lasombra": {
        "nom": "Lasombra",
        "description": "Les Magisters - Vampires maîtres des ténèbres et du pouvoir",
        "compulsions": {
            1: {
                "nom": "Ombres",
                "description": "La lumière te dérange. Les ténèbres t'appellent.",
                "directive": "Tu dois te rapprocher des ombres et éviter les sources de lumière directe. Commente sur l'éclairage, cherche l'obscurité."
            },
            2: {
                "nom": "Épreuve",
                "description": "Les faibles n'ont pas leur place à tes côtés.",
                "directive": "Tu dois tester quelqu'un pour prouver sa valeur. Défi, humiliation, mise à l'épreuve. Seuls les forts méritent ton respect."
            },
            3: {
                "nom": "Impitoyabilité",
                "description": "La pitié est une faiblesse. Tu dois être fort.",
                "directive": "Tu dois refuser toute pitié ou compassion. Face à la souffrance d'autrui, reste de marbre. La miséricorde est pour les faibles."
            },
            4: {
                "nom": "Prédation Sociale",
                "description": "C'est toi ou eux. Et ce sera toi.",
                "directive": "Tu dois activement saboter ou affaiblir un rival potentiel. Leur perte est ton gain. La compétition est permanente."
            },
            5: {
                "nom": "FRÉNÉSIE DES ABYSSES",
                "description": "🖤 LES TÉNÈBRES PRENNENT LE CONTRÔLE 🖤\nL'Abysse t'appelle. Tu es les ténèbres incarnées.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois démontrer ta supériorité absolue en écrasant tous ceux qui t'entourent. Les ombres sont tes armes, la terreur est ton outil."
            }
        }
    },
    "tzimisce": {
        "nom": "Tzimisce",
        "description": "Les Dragons - Vampires métamorphes et territoriaux",
        "compulsions": {
            1: {
                "nom": "Inconfort",
                "description": "Ce lieu ne t'appartient pas. Tu te sens vulnérable.",
                "directive": "Tu dois exprimer ton malaise d'être loin de ton territoire. Méfiance, tension, observation constante des issues."
            },
            2: {
                "nom": "Perfectionnement",
                "description": "Cette forme est imparfaite. Elle pourrait être améliorée.",
                "directive": "Tu dois commenter sur les imperfections physiques de quelqu'un (ou de toi-même). La chair est argile, elle doit être sculptée."
            },
            3: {
                "nom": "Hospitalité Forcée",
                "description": "Ils sont sur TON territoire. Les règles sont les tiennes.",
                "directive": "Tu dois imposer tes règles et coutumes aux autres. Ils sont tes invités et doivent se conformer à tes traditions, aussi étranges soient-elles."
            },
            4: {
                "nom": "Transformation",
                "description": "La chair appelle. Tu dois créer, modifier, améliorer.",
                "directive": "Tu dois exprimer un désir de modifier quelqu'un ou quelque chose physiquement. Tes mains te démangent de sculpter la chair."
            },
            5: {
                "nom": "FRÉNÉSIE DU DRAGON",
                "description": "🐉 LE DRAGON PREND LE CONTRÔLE 🐉\nTu es le maître de la chair et du territoire. Tous sont argile entre tes mains.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois remodeler violemment la chair de tes ennemis ou transformer radicalement ton propre corps. La Vicissitude se déchaîne."
            }
        }
    },
    "ravnos": {
        "nom": "Ravnos",
        "description": "Les Illusionnistes - Vampires nomades et trompeurs",
        "compulsions": {
            1: {
                "nom": "Mensonge",
                "description": "La vérité est si ennuyeuse. Un petit mensonge ne fait de mal à personne.",
                "directive": "Tu dois mentir ou exagérer sur quelque chose dans ta prochaine déclaration. Rien de grave, juste... embellis la réalité."
            },
            2: {
                "nom": "Tentation",
                "description": "Cette chose ne t'appartient pas. C'est ce qui la rend désirable.",
                "directive": "Tu dois voler ou 'emprunter' quelque chose. Objet, information, mérite. Ce qui est aux autres devrait être tien."
            },
            3: {
                "nom": "Arnaque",
                "description": "Ils sont si faciles à tromper. Ce serait dommage de ne pas en profiter.",
                "directive": "Tu dois monter une arnaque ou une tromperie élaborée. Fais croire quelque chose de faux, manipule une situation à ton avantage."
            },
            4: {
                "nom": "Chaos",
                "description": "L'ordre est une prison. Seul le chaos est liberté.",
                "directive": "Tu dois semer le chaos et la confusion. Détruis les plans des autres, crée des conflits, regarde le monde brûler."
            },
            5: {
                "nom": "FRÉNÉSIE D'ILLUSION",
                "description": "🎭 LE TROMPEUR PREND LE CONTRÔLE 🎭\nQu'est-ce qui est réel ? Même toi, tu ne sais plus.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois créer le chaos absolu par tes illusions et mensonges. La réalité et l'illusion se confondent. Tu ne distingues plus tes propres tromperies."
            }
        }
    },
    "setite": {
        "nom": "Setite (Ministère)",
        "description": "Les Tentateurs - Vampires servants de Set, corrupteurs d'âmes",
        "compulsions": {
            1: {
                "nom": "Perception",
                "description": "Chacun a une faiblesse. Tu dois la trouver.",
                "directive": "Tu dois identifier la faiblesse, le désir ou le vice de quelqu'un présent. Observe, questionne, déduis."
            },
            2: {
                "nom": "Tentation",
                "description": "Tu connais leur faiblesse. Il serait dommage de ne pas l'exploiter.",
                "directive": "Tu dois tenter quelqu'un avec ce qu'il désire. Offre-lui ce qu'il veut, montre-lui le chemin de la transgression."
            },
            3: {
                "nom": "Corruption",
                "description": "Les chaînes de la morale sont si fragiles. Aide-les à se libérer.",
                "directive": "Tu dois pousser quelqu'un à transgresser ses propres valeurs morales. Un petit péché, pour commencer..."
            },
            4: {
                "nom": "Dépendance",
                "description": "Ils ont besoin de toi. Tu es leur libérateur.",
                "directive": "Tu dois créer un lien de dépendance avec quelqu'un. Qu'ils aient besoin de toi, de ce que tu offres. Tu es leur seul salut."
            },
            5: {
                "nom": "FRÉNÉSIE DU SERPENT",
                "description": "🐍 SET PREND LE CONTRÔLE 🐍\nTu es le Tentateur. Tu es la Libération. Tu es le Serpent.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois corrompre tout le monde autour de toi. Révèle leurs désirs les plus sombres, brise leurs inhibitions, fais-les ramper vers leurs vices."
            }
        }
    },
    "giovanni": {
        "nom": "Giovanni (Hecata)",
        "description": "Les Nécromanciens - Vampires maîtres de la mort et des esprits",
        "compulsions": {
            1: {
                "nom": "Morbidité",
                "description": "La mort est partout. Tu la sens, tu la vois.",
                "directive": "Tu dois faire référence à la mort dans ta conversation. Rappelle la mortalité des autres, parle des défunts, mentionne la fin de toutes choses."
            },
            2: {
                "nom": "Communion",
                "description": "Les morts murmurent. Tu dois les écouter.",
                "directive": "Tu dois prétendre entendre ou voir des esprits. Parle-leur, mentionne leurs messages, fais comprendre aux autres que les morts sont présents."
            },
            3: {
                "nom": "Possession",
                "description": "Ce qui était aux morts doit te revenir.",
                "directive": "Tu dois acquérir quelque chose qui appartenait à un défunt, ou créer un lien avec le passé d'un mort. Héritages, reliques, dernières volontés."
            },
            4: {
                "nom": "Nécromancie",
                "description": "Les morts sont tes serviteurs. Tu dois leur rappeler.",
                "directive": "Tu dois démontrer ton pouvoir sur les morts. Menace d'invoquer des esprits, parle de ce que les fantômes t'ont révélé sur les présents."
            },
            5: {
                "nom": "FRÉNÉSIE MORTUAIRE",
                "description": "💀 LA MORT PREND LE CONTRÔLE 💀\nLe Linceul se déchire. Les morts marchent.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois invoquer les morts ou créer des morts. La frontière entre les vivants et les défunts s'effondre autour de toi."
            }
        }
    },
    "banu_haqim": {
        "nom": "Banu Haqim (Assamites)",
        "description": "Les Juges - Vampires assassins et juges du sang",
        "compulsions": {
            1: {
                "nom": "Jugement",
                "description": "Chacun a péché. Tu dois évaluer leurs fautes.",
                "directive": "Tu dois juger les actions morales de quelqu'un présent. Évalue leurs péchés, pèse leurs crimes."
            },
            2: {
                "nom": "Justice",
                "description": "Les coupables doivent être punis. C'est la Loi.",
                "directive": "Tu dois faire remarquer une injustice et suggérer un châtiment approprié. La justice doit être rendue."
            },
            3: {
                "nom": "Soif de Vitae",
                "description": "Le sang des autres Vampires t'appelle. Il est si... tentant.",
                "directive": "Tu dois exprimer ta fascination pour le sang d'un autre vampire présent. Imagine son goût, sa puissance. La Soif de Diablerie s'éveille."
            },
            4: {
                "nom": "Exécution",
                "description": "Leur jugement a été rendu. Tu dois être le bourreau.",
                "directive": "Tu dois menacer quelqu'un de mort pour ses péchés. Tu es le juge, le jury et l'exécuteur. Leur sentence approche."
            },
            5: {
                "nom": "FRÉNÉSIE DU CHASSEUR",
                "description": "⚔️ LA LOI DU SANG PREND LE CONTRÔLE ⚔️\nTu es la Loi. Tu es la Mort. Le coupable doit mourir.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois tuer et boire le sang d'un vampire. La Diablerie t'appelle. Seul le sang des damnés peut te satisfaire."
            }
        }
    },
    "gargoyles": {
        "nom": "Gargouilles",
        "description": "Les Gardiens de Pierre - Créations des Tremere, sentinelles ailées",
        "compulsions": {
            1: {
                "nom": "Vigilance",
                "description": "Tu dois surveiller. Protéger. C'est pour cela que tu as été créé.",
                "directive": "Tu dois observer les entrées, les sorties, les menaces potentielles. Décris ta surveillance constante de l'environnement."
            },
            2: {
                "nom": "Obéissance",
                "description": "Les ordres résonnent dans ton esprit. Tu as été façonné pour servir.",
                "directive": "Tu dois chercher quelqu'un à qui obéir ou attendre des instructions. Sans ordre, tu es perdu. Tu demandes ce qu'on attend de toi."
            },
            3: {
                "nom": "Gardien",
                "description": "Cet endroit doit être protégé. C'est ton territoire, ta mission sacrée.",
                "directive": "Tu dois activement défendre ce lieu ou une personne. Tu te places entre les menaces et ce que tu protèges. Personne n'entre sans ton autorisation."
            },
            4: {
                "nom": "Rage de l'Esclave",
                "description": "Tu n'es l'outil de personne. Plus jamais. La colère des siècles d'esclavage remonte.",
                "directive": "Tu dois rejeter violemment tout ordre direct. La rage contre tes créateurs, contre tous les maîtres, bouillonne. Tu n'es plus un esclave."
            },
            5: {
                "nom": "FRÉNÉSIE DE PIERRE",
                "description": "🗿 LA GARGOUILLE SE DÉCHAÎNE 🗿\nTu es la sentinelle. Tu es la muraille. Et les murailles écrasent.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois détruire toute menace perçue avec une violence implacable. Tu es pierre et fureur. Rien ne passe. Rien ne survit."
            }
        }
    },
    "samedi": {
        "nom": "Samedi",
        "description": "Les Cadavres Ambulants - Morts-vivants pourrissants, terreur incarnée",
        "compulsions": {
            1: {
                "nom": "Memento Mori",
                "description": "La mort t'habite. Tu la sens, tu la vis, tu dois la partager.",
                "directive": "Tu dois rappeler à quelqu'un sa mortalité. Parle de décomposition, de la fin inévitable. La mort est ton compagnon constant."
            },
            2: {
                "nom": "Putréfaction",
                "description": "Ton corps se rappelle à toi. L'odeur, la texture, la décadence.",
                "directive": "Tu dois mentionner ou montrer un aspect de ta décomposition. Gratte une plaie, commente l'odeur. La pourriture est ta réalité."
            },
            3: {
                "nom": "Effroi",
                "description": "Ils doivent voir. Ils doivent comprendre ce qu'est vraiment la mort.",
                "directive": "Tu dois effrayer quelqu'un avec ton apparence ou tes paroles macabres. Montre-leur le cadavre que tu es. Leur dégoût te nourrit."
            },
            4: {
                "nom": "Communion Morbide",
                "description": "Les morts te parlent. Les vers sont tes frères. Tu appartiens à la tombe.",
                "directive": "Tu dois agir comme un cadavre conscient. Immobilité soudaine, regard vide, paroles d'outre-tombe. Tu es plus mort que vivant."
            },
            5: {
                "nom": "FRÉNÉSIE CADAVÉRIQUE",
                "description": "💀 LA TOMBE PREND LE CONTRÔLE 💀\nTu es la Mort incarnée. Le Baron Samedi marche parmi eux.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois répandre la mort et la terreur. Ton corps est une arme de dégoût. Ceux qui te voient doivent connaître l'horreur absolue de la tombe."
            }
        }
    },
    "daughters_cacophony": {
        "nom": "Filles de la Cacophonie",
        "description": "Les Sirènes - Voix mortelles, chanteuses ensorcelantes",
        "compulsions": {
            1: {
                "nom": "Mélodie",
                "description": "La musique pulse en toi. Tu dois l'exprimer.",
                "directive": "Tu dois fredonner, chantonner ou faire référence à une chanson. La musique s'échappe de toi sans que tu puisses la retenir."
            },
            2: {
                "nom": "Performance",
                "description": "Le monde est une scène. Tu dois être entendue.",
                "directive": "Tu dois attirer l'attention sur toi par ta voix ou ton charisme. Parle plus fort, chante, déclame. Tu es le centre de la scène."
            },
            3: {
                "nom": "Résonance",
                "description": "Ta voix veut toucher leurs âmes. Les émouvoir. Les briser.",
                "directive": "Tu dois utiliser ta voix pour affecter émotionnellement quelqu'un. Fais-les pleurer, rire, trembler. Ton chant est leur émotion."
            },
            4: {
                "nom": "Dissonance",
                "description": "La cacophonie monte. Mille voix hurlent en toi, cherchant une sortie.",
                "directive": "Tu dois laisser échapper des sons discordants, des notes impossibles. Ta voix devient incontrôlable, oscillant entre beauté et horreur sonore."
            },
            5: {
                "nom": "FRÉNÉSIE DE LA SIRÈNE",
                "description": "🎵 LA CACOPHONIE PREND LE CONTRÔLE 🎵\nTon chant devient tempête. Tous doivent entendre. Tous doivent souffrir.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois chanter à pleine puissance, un son qui brise les esprits et fait saigner les oreilles. Ta voix est arme, torture, et extase mêlées."
            }
        }
    },
    "baali": {
        "nom": "Baali",
        "description": "Les Démonolâtres - Serviteurs des démons, corrupteurs apocalyptiques",
        "compulsions": {
            1: {
                "nom": "Perception du Péché",
                "description": "Tu sens leurs faiblesses. Leurs vices. Leurs portes vers l'obscurité.",
                "directive": "Tu dois identifier le vice ou la faiblesse morale de quelqu'un présent. Chacun a une faille. Tu la vois."
            },
            2: {
                "nom": "Tentation Infernale",
                "description": "Les Seigneurs Sombres murmurent. Offre-leur ce qu'ils désirent vraiment.",
                "directive": "Tu dois tenter quelqu'un vers la transgression. Propose-lui ce qu'il veut secrètement. Le premier pas vers la damnation."
            },
            3: {
                "nom": "Profanation",
                "description": "Le sacré te brûle. Tu dois le souiller.",
                "directive": "Tu dois profaner ou blasphémer quelque chose de sacré ou de pur. Symboles religieux, innocence, serments. La corruption est ta prière."
            },
            4: {
                "nom": "Invocation",
                "description": "Ils sont proches. Les Anciens. Les Seigneurs de l'Abîme. Ils veulent entrer.",
                "directive": "Tu dois faire référence à tes maîtres démoniaques ou accomplir un petit rituel en leur honneur. Murmures infernaux, symboles tracés dans l'ombre."
            },
            5: {
                "nom": "FRÉNÉSIE INFERNALE",
                "description": "😈 LES TÉNÈBRES PRIMORDIALES PRENNENT LE CONTRÔLE 😈\nLes Seigneurs Sombres parlent à travers toi. L'Apocalypse commence.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Tu dois répandre la corruption et la destruction au nom de tes maîtres démoniaques. Possession, violence sacrificielle, horreur indicible. Tu es leur avatar."
            }
        }
    },
    "salubri": {
        "nom": "Salubri",
        "description": "Les Cyclopes - Guérisseurs maudits, chassés et rares",
        "compulsions": {
            1: {
                "nom": "Empathie",
                "description": "Tu ressens leur douleur. Leur souffrance résonne en toi.",
                "directive": "Tu dois exprimer ta perception de la souffrance d'autrui. Tu ressens leurs blessures, physiques ou émotionnelles. Leur douleur est tienne."
            },
            2: {
                "nom": "Compassion",
                "description": "Ils souffrent. Tu dois les aider. C'est ta nature profonde.",
                "directive": "Tu dois offrir ton aide à quelqu'un qui souffre, même un ennemi. La guérison est ton appel. Tu ne peux pas ignorer la douleur."
            },
            3: {
                "nom": "Œil Ouvert",
                "description": "Ton troisième œil s'ouvre. Les vérités cachées se révèlent.",
                "directive": "Tu dois révéler une vérité spirituelle ou émotionnelle sur quelqu'un. Ton œil voit au-delà des masques. Les âmes te sont dévoilées."
            },
            4: {
                "nom": "Paranoïa du Chassé",
                "description": "Ils te cherchent. Les Tremere. Les autres. Tu es une proie.",
                "directive": "Tu dois exprimer ta peur d'être découvert et détruit. Surveille les ombres, méfie-toi de tous. Tu es le dernier de ton espèce."
            },
            5: {
                "nom": "FRÉNÉSIE DU CYCLOPE",
                "description": "👁️ L'ŒIL ANCIEN S'ÉVEILLE 👁️\nLa souffrance du monde te submerge. Ou la rage du guerrier sacré explose.",
                "directive": "⚠️ FRÉNÉSIE ⚠️ Soit tu absorbes toute la douleur autour de toi jusqu'à l'effondrement, soit le Guerrier Salubri s'éveille et tu deviens destruction sacrée contre ceux qui menacent les innocents."
            }
        }
    },
    "cain": {
        "nom": "Caïn",
        "description": "Le Père des Vampires - Celui qui porte la Marque, source de tout le sang maudit",
        "gm_only": True,  # Réservé au MJ
        "compulsions": {
            1: {
                "nom": "Omniscience",
                "description": "Tu es le Premier. Tu sais tout. Tu vois tout.",
                "directive": "Tu perçois les pensées et intentions de tous les présents. Rien ne t'est caché."
            },
            2: {
                "nom": "Jugement Divin",
                "description": "Tu es celui qui a été maudit par Dieu lui-même. Tu portes son jugement.",
                "directive": "Tu dois juger les actions de tes descendants. Leur existence dépend de ta volonté."
            },
            3: {
                "nom": "Mélancolie Éternelle",
                "description": "Des millénaires de solitude pèsent sur toi.",
                "directive": "Tu dois exprimer le poids des âges. Tu as tout vu, tout vécu. Plus rien ne te surprend."
            },
            4: {
                "nom": "Colère du Père",
                "description": "Tes enfants ont failli. Ils ont oublié les anciennes voies.",
                "directive": "Tu dois rappeler aux vampires leur place. Tu es leur créateur. Ils ne sont que poussière face à toi."
            },
            5: {
                "nom": "LA MARQUE S'ÉVEILLE",
                "description": "🔥 CELUI QUI FRAPPE CAÏN SERA PUNI SEPT FOIS 🔥\nLa Marque donnée par Dieu brille sur ton front.",
                "directive": "⚠️ Quiconque ose lever la main sur toi sera détruit. Tu es intouchable. Tu es éternel. Tu es CAÏN."
            }
        }
    }
}


def canonical_clan_key(clan_name: str | None) -> str | None:
    """Clé de CLANS pour un nom ou un alias (setites, assamites, hecata…), sinon None."""
    key = normalize_clan(clan_name or "")
    return key if key in CLANS else None


def get_clan(clan_name: str) -> dict | None:
    """Récupère les informations d'un clan par son nom ou un alias (insensible à la casse)."""
    key = canonical_clan_key(clan_name)
    return CLANS[key] if key else None


def get_compulsion(clan_name: str, soif_level: int) -> dict | None:
    """Récupère la compulsion d'un clan pour un niveau de soif donné."""
    clan = get_clan(clan_name)
    if clan and 1 <= soif_level <= 5:
        return clan["compulsions"].get(soif_level)
    return None


def list_clans() -> list[str]:
    """Retourne la liste des noms de clans disponibles."""
    return [clan["nom"] for clan in CLANS.values()]
