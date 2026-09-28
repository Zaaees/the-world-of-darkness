const tensions = {
  brujah: 'une injustice et votre colère', gangrel: 'votre liberté et votre besoin de refuge',
  malkavian: 'vos perceptions singulières et la confiance des autres', nosferatu: 'le secret et le besoin de liens',
  toreador: 'votre passion et ce qu’elle risque de vous coûter', tremere: 'la connaissance et les exigences de votre mentor',
  ventrue: 'votre ambition et votre responsabilité envers autrui', lasombra: 'le pouvoir et le prix de son exercice',
  tzimisce: 'votre idée de la perfection et les limites des autres', ravnos: 'la liberté et la confiance que l’on vous accorde',
  setites: 'un désir et une règle que vous remettez en question', giovanni: 'vos liens de famille et votre autonomie',
  assamites: 'votre idée de la justice et vos doutes', gargoyles: 'votre indépendance et les attentes de vos créateurs',
  samedi: 'votre apparence et votre désir de rester en relation', daughters_of_cacophony: 'votre voix et le besoin d’être entendu',
  baali: 'la tentation et une limite que vous souhaitez préserver', salubri: 'votre compassion et votre propre survie',
};
export function getOriginQuestions(clan) {
  return [
    'Qui étiez-vous avant l’Étreinte, et quel lien avec cette vie souhaitez-vous garder ? Vous pouvez être récemment étreint.',
    `Comment vivez-vous la tension entre ${tensions[clan] || 'votre héritage et vos choix personnels'} ? Décrivez une situation vécue, une crainte ou un choix à venir.`,
    'Que cherchez-vous lors de votre première nuit dans la ville, et auprès de qui pourriez-vous trouver de l’aide ? Vous pouvez laisser le nom ouvert pour le définir avec un autre joueur ou le MJ.',
  ];
}
