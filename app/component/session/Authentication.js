import PropTypes from 'prop-types';
import React from 'react';

import { withFirebase } from '../firebase';
import { getReadMessageIds } from '../../store/localStorage';


const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      const { firebase } = this.props;

      if (!firebase) return;
      
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser == null) {
          if (getReadMessageIds().includes('consent')) {
            firebase.signInAnonymously();
          }
        }
  
        this.setState({ authUser });
      });
    }

    componentWillUnmount() {
      if (this.listener) {
        this.listener();
      }
    }

    render() {
      const { state, props } = this;
      return <Component {...props} authUser={state.authUser} />;
    }
  }

  WithAuthentication.propTypes = {
    firebase: PropTypes.object,
  };

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
