
// Attribution: Adjective + noun corpus
// Url: https://jsfiddle.net/katowulf/3gtDf/
// Accessed: March 7, 2017
const adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "corpulent", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "friable", "fulsome", "garrulous", "guileless", "gustatory", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
const nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnome", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "mermaid", "barnacle", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice", "ukulele", "kazoo", "banjo", "singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "balloon", "mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "artist", "model", "musician", "penciller", "producer", "scenographer", "decorator", "silversmith", "teacher", "mechanic", "beader", "bobbin", "clerk", "attendant", "foreman", "mechanic", "miller", "moldmaker", "patternmaker", "operator", "plumber", "sawfiler", "foreman", "soaper", "sengineer", "wheelwright", "woodworkers"];

// Attribution: Famous painter names corpus
// Title: "A List of The 50 Greatest Paintings in the History of Art."
// Url: http://www.historyofpainters.com/paintings.htm
// Accessed: March 25, 2017

// Attribution: Famous musical artists corpus
// Title: "Artist 100"
// Url: http://www.billboard.com/charts/artist-100
// Accessed: March 29, 2017

// Attribution: Most important painters corpus
// Title: "Most Important Painters"
// Url: http://www.theartwolf.com/articles/most-important-painters.htm
// Accessed: March 29, 2017
const artists = [
  'Pieter Bruegel the Elder',
  'Joachim Patinir',
  'Ivan Konstantinovich Aivazovsky',
  'Fra Angelico',
  'Jean Leon Gerome',
  'Robert Campin',
  'Hieronymus Bosch',
  'John Singleton Copley',
  'Alessandro Botticelli',
  'Henry Ossawa Tanner',
  'Caravaggio',
  'Paul Cézanne',
  'Antonio Allegri da Correggio',
  'Gustave Courbet',
  'Lucas Cranach the Elder',
  'Bernardo Daddi',
  'Jacques-Louis David',
  'Thomas Eakins',
  'Piero della Francesca',
  'Domenico Di Michelino',
  'Albrecht Dürer',
  'Jean Fouquet',
  'Thomas Gainsborough',
  'Paul Gauguin',
  'Giorgione',
  'Giotto',
  'Georges Seurat',
  'Vincent van Gogh',
  'Claude Monet',
  'Francisco Goya',
  'Keith Haring',
  'Andy Warhol',
  'Kanye West',
  'Beyonce',
  'Drake', 
  'Ed Sheeran',
  'Bruno Mars',
  'Adele',
  'Taylor Swift',
  'Ariana Grande',
  'Lady Gaga',
  'Chuck Berry',
  'Justin Timberlake',
  'John Legend',
  'Pablo Picasso',
  'Paul Cezanne',
  'Rembrandt',
  'Jean-Michel Basquiat',
  'Edvard Munch',
  'Francis Bacon',
  'Frida Kahlo',
  'Salvador Dali',
];

// Attribution: List of most visited art museums corpus
// Title: "List of most visited art museums"
// Url: https://en.wikipedia.org/wiki/List_of_most_visited_art_museums
// Accessed: March 29, 2017
const museums = [
  'Louvre',
  'Metropolitan Museum of Art',
  'Tate Modern',
  'Musée d\'Orsay',
  'Dalí Theatre and Museum',
  'Guggenheim Museum',
  'National Gallery of Art',
];

// Attribution: Pick a random element from a list
// Url: https://jsfiddle.net/katowulf/3gtDf/
// Accessed: March 7, 2017
export function pickRandom(list) {
  const i = Math.floor(Math.random() * list.length);
  return list[i];
}


// E.g. Adamant Unicorn
export function randomName() {
  return (
    capitalizeFirstLetter(pickRandom(adjectives)) +
    ' ' +
    capitalizeFirstLetter(pickRandom(nouns))
  );
}

export function randomArtistName() {
  return pickRandom(artists);
}

export function randomMuseumName() {
  return pickRandom(museums);
}

// Attribution: capitalize first letter of a string
// URL: http://stackoverflow.com/a/1026087
// Accessed: March 7, 2017
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
