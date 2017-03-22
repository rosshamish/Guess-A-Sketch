import React from 'react';
import { _ } from 'underscore';

import BaseComponent from './BaseComponent.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import SketchImage from './SketchImage.jsx';
import StackGrid from "react-stack-grid";
import {
  Button,
  Header,
  Container,
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

    return (
      <Container>
        <Header as='h1'>Sketches From This Round</Header>
        <Form 
          onSubmit={(event) => {
            event.preventDefault();
            onNextRound(room);
          }}
        >
          <Button>
            { 
              isLastRound(round, room) ?
              'End Game' :
              'Next Round' 
            }
          </Button>
        </Form>
        <StackGrid columnWidth={150}>
          {SketchComponents}
        </StackGrid>
      </Container>
    );
  }
}

HostRoundResults.propTypes = {
  room: React.PropTypes.object,
  round: React.PropTypes.object,
  isLastRound: React.PropTypes.func,
  onNextRound: React.PropTypes.func,
};
