import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class RoomItem extends BaseComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { room } = this.props;
        let code = this.props.room.substr(this.props.room.length - 4);
        return (
            <div className="room">
              I am a room, with id {code}
            </div>
        );
    }
}

RoomItem.propTypes = {
    room: React.PropTypes.object,
};
