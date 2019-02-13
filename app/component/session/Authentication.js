import PropTypes from 'prop-types';
import React from 'react';

import { withFirebase } from '../firebase';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      const { state, props } = this;
      return <Component {...props} authUser={state.authUser} />;
    }
  }

  WithAuthentication.propTypes = {
    firebase: PropTypes.object.isRequired,
  };

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
