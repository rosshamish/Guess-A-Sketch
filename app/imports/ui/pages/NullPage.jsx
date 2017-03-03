import BaseComponent from '../components/BaseComponent.jsx';

class NullPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <h4>Null Page, placeholder, lorem ipsum, etc etc</h4>
    );
  }
}

export default BaseComponent;