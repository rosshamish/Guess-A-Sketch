import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import ErrorMessage, { errorCodes } from '/imports/ui/components/ErrorMessage.jsx';

storiesOf('Error Messages', module)
  .add('errorCodes.host.room', () => ( <ErrorMessage code={errorCodes.host.noRoom} />) )
  .add('errorCodes.host.noRound', () => <ErrorMessage code={errorCodes.host.noRound} />)
  .add('errorCodes.host.illegalRoomState', () => <ErrorMessage code={errorCodes.host.illegalRoomState} />)
  .add('errorCodes.host.illegalRoundState', () => <ErrorMessage code={errorCodes.host.illegalRoundState} />)

  .add('errorCodes.participant.room', () => <ErrorMessage code={errorCodes.participant.noRoom} />)
  .add('errorCodes.participant.noRound', () => <ErrorMessage code={errorCodes.participant.noRound} />)
  .add('errorCodes.participant.illegalRoomState', () => <ErrorMessage code={errorCodes.participant.illegalRoomState} />)
  .add('errorCodes.participant.illegalRoundState', () => <ErrorMessage code={errorCodes.participant.illegalRoundState} />)

  .add('errorCodes.roomList.undefinedRooms', () => <ErrorMessage code={errorCodes.participant.undefinedRooms} />)
  .add('errorCodes.roomList.noPlayer', () => <ErrorMessage code={errorCodes.participant.noPlayer} />)

  // TODO trigger errormessages in UI components and compare them to the expected ErrorMessage
;
