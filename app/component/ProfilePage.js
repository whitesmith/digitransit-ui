import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router';
import PageFooter from './PageFooter';
import { FormattedMessage } from 'react-intl';

const defaultProfile = '/img/hsl-social-share.png';

const ProfilePage = ({}, { config }) => {
  return (
    <div className="page-frame fullscreen momentum-scroll profile">
      <div className="profile__banner">
        <div className="row">
          <div className="columns large-8 large-centered">
            <h1 className="profile__heading">
              <FormattedMessage id="profile" defaultMessage="Profile" />
            </h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="columns large-8 large-centered">
          <div className="media media--middle padding-vertical-normal">
            <div className="media__figure small-2 large-1">
              <img
                src={defaultProfile}
                alt="Profile image"
                className="profile__img"
              />
            </div>
            <div className="media__body">
              <h4 className="profile__name">Name</h4>
              <h5 className="profile__email">Email</h5>
            </div>
          </div>

          <div className="row small-uncollapse padding-vertical-normal">
            <div className="small-12 large-6 columns">
              <button className="button secondary expand">
                <FormattedMessage
                  id="download-personal-data"
                  defaultMessage="Download personal data"
                />
              </button>
            </div>
            <div className="small-12 large-6 columns">
              <button className="button info expand">
                <FormattedMessage
                  id="delete-account"
                  defaultMessage="Delete account"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {};

ProfilePage.contextTypes = {
  config: PropTypes.object.isRequired,
};

export default ProfilePage;
