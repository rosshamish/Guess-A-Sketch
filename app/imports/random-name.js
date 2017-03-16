
// Attribution: Adjective + noun corpus
// Url: https://jsfiddle.net/katowulf/3gtDf/
// Accessed: March 7, 2017
adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "corpulent", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "friable", "fulsome", "garrulous", "guileless", "gustatory", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnome", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "mermaid", "barnacle", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice", "ukulele", "kazoo", "banjo", "singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "balloon", "mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "artist", "model", "musician", "penciller", "producer", "scenographer", "decorator", "silversmith", "teacher", "mechanic", "beader", "bobbin", "clerk", "attendant", "foreman", "mechanic", "miller", "moldmaker", "patternmaker", "operator", "plumber", "sawfiler", "foreman", "soaper", "sengineer", "wheelwright", "woodworkers"];

// E.g. AdamantUnicorn
export function randomName() {
  return (
    capitalizeFirstLetter(pickRandom(adjectives)) +
    '-' +
    capitalizeFirstLetter(pickRandom(nouns))
  );
}

// Attribution: Pick a random element from a list
// Url: https://jsfiddle.net/katowulf/3gtDf/
// Accessed: March 7, 2017
function pickRandom(list) {
  const i = Math.floor(Math.random() * list.length);
  return list[i];
}

// Attribution: capitalize first letter of a string
// URL: http://stackoverflow.com/a/1026087
// Accessed: March 7, 2017
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
