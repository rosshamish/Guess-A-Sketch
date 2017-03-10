import React from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

import { TIMER } from '/imports/api/session';

export default class Timer extends BaseComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        interval_id = setInterval(() => {
            this.setState(() => {
                Session.set(TIMER, Session.get(TIMER) - 1);
                return {}
            });
        }, 1000);
    }

    shouldComponentUpdate(nextProps) {
        if (Session.get(TIMER) > -1) {
          return true;
        }
        clearInterval(interval_id);
        return false;
    }

    render() {
        const {} = this.props;

        return (
            <div className="timer">
                Timer: {Session.get(TIMER)}
            </div>
        );
    }
}

Timer.propTypes = {};
