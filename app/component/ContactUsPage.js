import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { FormattedMessage } from 'react-intl';

const ContactUsPage = ({}, context) => {
  return (
    <div className="page-frame fullscreen momentum-scroll contact-form">
      <form
        action={`https://formspree.io/${context.config.contactEmail}`}
        method="POST"
      >
        <div className="contact-form__banner">
          <div className="row padding-vertical-small">
            <div className="small-12 large-8 large-centered columns">
              <h1>
                <FormattedMessage id="contact-us" defaultMessage="Contact us" />
              </h1>
            </div>
          </div>
        </div>
        <div className="row padding-vertical-small">
          <div className="small-12 large-8 large-centered columns">
            <label htmlFor="name" className="contact-form__label">
              <FormattedMessage id="name" defaultMessage="Name" />
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="off"
              className="contact-form__input"
            />
          </div>
        </div>
        <div className="row padding-vertical-small">
          <div className="small-12 large-8 large-centered columns">
            <label htmlFor="email" className="contact-form__label">
              <FormattedMessage
                id="email-address"
                defaultMessage="Email address"
              />
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="off"
              className="contact-form__input"
            />
          </div>
        </div>
        <div className="row padding-vertical-small">
          <div className="small-12 large-8 large-centered columns">
            <label htmlFor="message" className="contact-form__label">
              <FormattedMessage id="message" defaultMessage="Message" />
            </label>
            <textarea
              id="message"
              name="message"
              className="contact-form__textarea"
              rows="6"
            />
          </div>
        </div>
        <div className="row padding-vertical-small">
          <div className="small-12 large-8 large-centered columns">
            <button type="submit" className="contact-form__submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

ContactUsPage.propTypes = {};

ContactUsPage.contextTypes = {
  config: PropTypes.object.isRequired,
};

export default ContactUsPage;
