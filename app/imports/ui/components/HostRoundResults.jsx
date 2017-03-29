import React from 'react';
import { _ } from 'underscore';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';
import Timer from './Timer.jsx';
import StackGrid from "react-stack-grid";
import {
  Button,
  Header,
  Segment,
  Form,
} from 'semantic-ui-react';


export default class HostRoundResults extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      room,
      round,
      sketches,
      isLastRound,
      onNextRound,
    } = this.props;

    if (!round) {
      console.error('Round is undefined, cannot render.');
      return <ErrorMessage />;
    }

    const SketchComponents = _.map(sketches, (sketch) => {
      return <div key={sketch._id}><SketchImage key={sketch._id} sketch={sketch} /></div>;
    });

    // TODO check browser compat
    const style = {
      display: 'flex',
      justifyContent: 'center',
    };

    return (
      <Segment.Group style={style}>
        <Segment>
          <Header as='h2'>Sketches from This Round (Prompt: {round.prompt})</Header>
          <Form 
            onSubmit={(event) => {
              event.preventDefault();
              onNextRound(room);
            }}>
            <Button primary>
              { 
                isLastRound(round, room) ?
                'End Game' :
                'Next Round' 
              }
            </Button>
          </Form>
        </Segment>
        <Segment>
          <StackGrid columnWidth={"33.33%"}>
            {SketchComponents}
          </StackGrid>
        </Segment>
      </Segment.Group>
    );
  }
}

HostRoundResults.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
  isLastRound: React.PropTypes.func,
  onNextRound: React.PropTypes.func,
};
