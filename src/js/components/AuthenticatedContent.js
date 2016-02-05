import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Loader from './ui/Loader';
import LoginActions from '../actions/LoginActions';
import PlansActions from '../actions/PlansActions';

import NavBar from './NavBar';
import Footer from './Footer';
import NotificationsToaster from './notifications/NotificationsToaster';

export default class AuthenticatedContent extends React.Component {
  componentDidMount() {
    // TODO(jtomasek): remove this when we start fetching plans in LoginActions on successful login
    PlansActions.listPlans();
  }

  logoutUser() {
    this.props.dispatch(LoginActions.logoutUser());
  }

  render() {
    return (
      <div>
        <Loader loaded={!this.props.authInProgress}
                content="Authenticating ..."
                global>
          <header>
            <NavBar user={this.props.user}
                    onLogout={this.logoutUser.bind(this)}/>
          </header>
          <div className="wrapper-fixed-body container-fluid">
            {this.props.children}
          </div>
          <Footer/>
        </Loader>
        <NotificationsToaster />
      </div>
    );
  }
}
AuthenticatedContent.propTypes = {
  authInProgress: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node,
  dispatch: React.PropTypes.func.isRequired,
  user: ImmutablePropTypes.map
};

function mapStateToProps(state) {
  return {
    authInProgress: state.login.get('authInProgress'),
    user: state.login.getIn(['keystoneAccess', 'user'])
  };
}

export default connect(mapStateToProps)(AuthenticatedContent);
