import format from 'string-format';

import React from 'react';
import { Session } from 'meteor/session';
import { browserHistory } from 'react-router';
import BaseComponent from '../../components/BaseComponent.jsx';
import RoomItem from '../../components/RoomItem.jsx';
import NoRooms from '../../components/NoRooms.jsx';

import { joinRoom } from '/imports/api/methods';
import { PLAYER } from '/imports/api/session';

export default class RoomListPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    // Attribution: Adjective + noun corpus
    // Url: https://jsfiddle.net/katowulf/3gtDf/
    // Accessed: March 7, 2017
    this.adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "corpulent", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "friable", "fulsome", "garrulous", "guileless", "gustatory", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
    this.nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnome", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "mermaid", "barnacle", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice", "ukulele", "kazoo", "banjo", "singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "balloon", "mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "artist", "model", "musician", "penciller", "producer", "scenographer", "decorator", "silversmith", "teacher", "mechanic", "beader", "bobbin", "clerk", "attendant", "foreman", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "operator", "plumber", "sawfiler", "foreman", "soaper", "sengineer", "wheelwright", "woodworkers"];

    this._pickRandom = this._pickRandom.bind(this);
    this._capitalizeFirstLetter = this._capitalizeFirstLetter.bind(this);
    this._randomName = this._randomName.bind(this);

    // this.onRoomClickHandler = this.onRoomClickHandler.bind(this);
  }

  onRoomClickHandler(room, event) {
    event.preventDefault();

    // Use a random name
    // TODO: get this from a login page, like we said we would in the SRS
    const player = {
      name: this._randomName(),
      color: 'red', // TODO support color
    };
    Session.set(PLAYER, player);

    const didJoinRoom = joinRoom.call({
      room_id: room._id,
      player: player,
    });

    if (didJoinRoom) {
      browserHistory.push('/play');
    } else {
      console.error('Failed to join room. Check room status!');
    }
  }

  render() {
    const {
      loading,
      rooms,
      noRooms
    } = this.props;

    if (noRooms) {
      return <NoRooms />
    } else if (loading) {
      return <h3>Loading...</h3>;
    } else {
      if (!rooms) {
        console.error('Can\'t display room list: rooms is undefined');
        return <ErrorMessage />
      }

      const page = this;
      let children = rooms.map(function(room,index) {
        return (
          <RoomItem
            key={room._id}
            onClick={page.onRoomClickHandler.bind(page, room)}
            room={room}
          />
        );
      });
      return <div className="room-list">{children}</div>
    }
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

RoomListPage.propTypes = {
  loading: React.PropTypes.bool,
  rooms: React.PropTypes.array,
  noRooms: React.PropTypes.bool,
};
