// SRS 3.2.2.3 : Display Image Collage

import React from 'react';
import { _ } from 'underscore';

import ErrorMessage, { errorCodes } from './ErrorMessage.jsx';
import BaseComponent from './BaseComponent.jsx';
import SketchImage from './SketchImage.jsx';
import SketchRating from './SketchRating.jsx';
import StackGrid from "react-stack-grid";
import { easings } from "react-stack-grid";
import {
  Button,
  Header,
  Segment,
  Form,
  Container,
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
      getSketchScore,
    } = this.props;

    if (!round) {
      return <ErrorMessage code={errorCodes.host.noRound} />;
    }

    sketches.sort(
      function (a, b) {
        if (getSketchScore(a) < getSketchScore(b)) return 1;
        if (getSketchScore(b) < getSketchScore(a)) return -1;
        return 0;
      }
    );

    const SketchComponents = _.map(sketches, (sketch) => {
      return (
        <Container
          key={sketch._id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <SketchImage sketch={sketch} useFrame={false} />
        <SketchRating rating={getSketchScore(sketch)} />
        </Container>
      );
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
          <StackGrid columnWidth={"25%"}>
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
  sketches: React.PropTypes.array,
  isLastRound: React.PropTypes.func,
  onNextRound: React.PropTypes.func,
  getSketchScore: React.PropTypes.func,
};
