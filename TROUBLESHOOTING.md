# 🔧 Résolution des problèmes

## 🚫 Aucune commande slash n'apparaît

Si tu ne vois aucune commande slash (`/vampire`, `/lycan`) dans Discord :

### Solution 1 : Redémarrer le bot normalement

```bash
# Arrêter le bot (Ctrl+C si en mode manuel)
# Puis relancer
python main.py
```

Les logs devraient afficher :
```
Cog chargé: cogs.vampire
Cog chargé: cogs.werewolf
Cog chargé: cogs.general
X commande(s) synchronisée(s)
```

### Solution 2 : Forcer la synchronisation

Si le redémarrage ne suffit pas, utilise le script de synchronisation :

```bash
python sync_commands.py
```

Ce script va :
1. ✅ Vider toutes les anciennes commandes
2. ✅ Recharger les cogs
3. ✅ Synchroniser les nouvelles commandes
4. ✅ Afficher la liste des commandes synchronisées

**Attends 1-5 minutes** après l'exécution pour que Discord mette à jour son cache.

### Solution 3 : Réinviter le bot (dernier recours)

Si rien ne fonctionne, le bot manque peut-être de permissions :

1. **Générer un nouveau lien d'invitation** avec les scopes :
   - `bot`
   - `applications.commands`

2. **Permissions requises** :
   - Gérer les rôles
   - Gérer les surnoms
   - Lire/Envoyer des messages
   - Utiliser des commandes slash

3. **Réinviter le bot** avec ce nouveau lien

---

## 📋 Liste des commandes disponibles

### Commandes Slash (pour tous)
- `/vampire` - Panneau vampire (rôle Vampire requis)
- `/lycan` - Panneau loup-garou (rôle Loup-garou requis)

### Commandes Admin (préfixe `!`)
- `!reset @joueur` - Réinitialise le personnage d'un joueur

---

## 🔍 Vérifier les commandes synchronisées

Pour voir quelles commandes sont actuellement synchronisées :

```python
# Dans le bot Discord, tape :
/
# Discord devrait afficher toutes les commandes slash disponibles
```

Si tu vois d'anciennes commandes (comme `/reset`), c'est que Discord a mis en cache les anciennes commandes. Utilise `sync_commands.py` pour forcer le nettoyage.

---

## 📝 Logs utiles

Vérifie le fichier `bot.log` pour voir les erreurs :

```bash
tail -f bot.log
```

Erreurs courantes :
- `CommandNotFound` → La commande n'existe plus (normal après suppression)
- `MissingPermissions` → Le bot manque de permissions
- `Erreur lors de la synchronisation` → Problème de connexion Discord

---

## 🆘 Aide supplémentaire

Si le problème persiste :
1. Vérifie que le bot a bien les permissions `applications.commands`
2. Vérifie que le token est correct dans `.env`
3. Regarde les logs pour les erreurs spécifiques
4. Attends 1 heure (cache Discord maximum)
