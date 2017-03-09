import React from 'react';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';
import BaseComponent from '../../components/BaseComponent.jsx';

import { PLAYER } from '/imports/api/session';


export default class LoginPage extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      nickname: null,
      color: null,
    };

    // Attribution: Adjective + noun corpus
    // Url: https://jsfiddle.net/katowulf/3gtDf/
    // Accessed: March 7, 2017
    this.adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "corpulent", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "friable", "fulsome", "garrulous", "guileless", "gustatory", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
    this.nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnome", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "mermaid", "barnacle", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice", "ukulele", "kazoo", "banjo", "singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "balloon", "mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "artist", "model", "musician", "penciller", "producer", "scenographer", "decorator", "silversmith", "teacher", "mechanic", "beader", "bobbin", "clerk", "attendant", "foreman", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "operator", "plumber", "sawfiler", "foreman", "soaper", "sengineer", "wheelwright", "woodworkers"];

    this._randomName = this._randomName.bind(this);

    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    if (this.state.nickname === null) {
      this.setState({ nickname: this._randomName() });
    }
    if (this.state.color === null) {
      this.setState({ color: 'red'})
    }
  }

  onNicknameChange(event) {
    this.setState({ nickname: event.target.value });
  }

  onColorChange(event) {
    this.setState({ color: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault(); // Don't reload the page

    if (!this.state.nickname) {
      console.error('Join room request denied by client. Nickname is required!');
      return;
    }
    if (!this.state.color) {
      console.error('Join room request denied by client. Color is required!');
      return;
    }

    Session.set(PLAYER, {
      name: this.state.nickname,
      color: this.state.color,
    });

    browserHistory.push('/join');
  }

  render() {
    const {
    } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        Nickname:
        <input
          type="text"
          name="nickname"
          value={this.state.nickname}
          onChange={this.onNicknameChange}
        />
        <br />
        Color:
        <select value={this.state.color} onChange={this.onColorChange}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>
        <br />
        <button type="submit">Play</button>
      </form>
    );
  }

  // ---------------
  // Private methods
  // ---------------

  // Attribution: Pick a random element from a list
  // Url: https://jsfiddle.net/katowulf/3gtDf/
  // Accessed: March 7, 2017
  _pickRandom(list) {
    const i = Math.floor(Math.random() * list.length);
    return list[i];
  }

  // Attribution: capitalize first letter of a string
  // URL: http://stackoverflow.com/a/1026087
  // Accessed: March 7, 2017
  _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // E.g. AdamantUnicorn
  _randomName() {
    return (
      this._capitalizeFirstLetter(this._pickRandom(this.adjectives)) +
      '-' +
      this._capitalizeFirstLetter(this._pickRandom(this.nouns))
    );
  };
}

LoginPage.propTypes = {
  room: React.PropTypes.object,
};
