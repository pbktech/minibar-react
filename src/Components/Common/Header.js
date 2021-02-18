import React from 'react';
import Login from '../Login.js';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends React.Component {
  render() {
    const domain = window.location.hostname;

    let url = '';

    let headerImage = '';

    if (this.props.delivery.url) {
      url = this.props.delivery.url;
    } else {
      url = this.props.delivery.service;
    }
    if (window.location.pathname === '/group' || domain === 'https://pbkgrouporder.com' || domain === 'https://www.pbkgrouporder.com') {
      headerImage = 'PBK-Logo_Primary_Full-Color.png';
    } else {
      headerImage = 'MiniBarLogo_bluewhite.png';
    }
    const linkURL = this.props.delivery.service ? '/order/' + this.props.delivery.link + '/' + url : '/';

    console.log(window.location.hostname);

    return (
      <header className="site-header" style={{ position: 'fixed', zIndex: '1000' }}>
        <a href="#main-content" className="skip">Skip to main content</a>
        <div className="site-header-desktop" style={{ position: 'relative', width: '100vw' }}>
          <div className="site-header-desktop-primary" data-header-sticky>
            <div className="container">
              <div className="site-logo">
                <Link to={linkURL} className="site-logo__btn">
                  <img className="site-logo__expanded" src={'/assets/images/' + headerImage} alt="Protein Bar & Kitchen Home" />
                </Link>
              </div>
              <nav className="site-nav" style={{ position: 'absolute', right: '3em', top: '3em' }}>
                <ul className="site-nav-menu" data-menu-type="desktop">
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/restaurants/">Locations</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/menu/">Menu</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/about/">Story</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/catering/">Catering</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/rewards/">Rewards</a>
                  </li>
                  <Login />
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="site-header-mobi" style={{ width: '100vw' }}>
          <div className="site-logo">
            <Link to={linkURL} className="site-logo__btn">
              <img className="site-logo__expanded" src="/assets/images/MiniBarLogo_bluewhite.png" alt="Protein Bar & Kitchen Home" />
            </Link>
          </div>
          <button type="button" className="nav-toggle-btn" aria-controls="SiteHeaderMobilePanel" aria-expanded="false">
            <span className="sr-only">Toggle Navigation</span>
            <span className="nav-toggle-btn__line" />
            <span className="nav-toggle-btn__line" />
            <span className="nav-toggle-btn__line" />
          </button>
          <div id="SiteHeaderMobilePanel" className="site-header-mobi-panel" role="dialog" aria-modal="true" aria-label="Navigation Menu Modal">
            <div className="site-header-mobi-panel__inner">
              <nav className="site-nav" aria-label="Navigation Menu">
                <ul className="site-nav-menu" data-menu-type="mobile">
                  <Login />
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/restaurants/">Locations</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/menu/">Menu</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/about/">Story</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/catering/">Catering</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/rewards/">Rewards</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/press/">Press</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/franchise/">Franchise</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/pro-team/">Pro-Team</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://www.theproteinbar.com/contact/">Contact</a>
                  </li>
                  <li>
                    <a className="site-nav-link " target="_blank" rel="noopener noreferrer" href="https://login.estratex.com/Jobs/Protein%20Bar">Careers</a>
                  </li>
                  <li>
                    <Login />
                  </li>
                </ul>
              </nav>
              <div className="site-social site-social--bordered">
                <ul className="social-accounts">
                  <li><a href="https://www.facebook.com/proteinbar/?utm_uptracs=null" target="_blank" rel="noopener noreferrer" data-bb-track="button" data-bb-track-on="click" data-bb-track-category="Social Icons" data-bb-track-action="Click" data-bb-track-label="Facebook, Header"><span
                    className="fa fa-facebook" aria-hidden="true" /><span className="sr-only">Facebook</span></a></li>
                  <li><a href="https://twitter.com/theproteinbar?utm_uptracs=null" target="_blank" rel="noopener noreferrer" data-bb-track="button" data-bb-track-on="click" data-bb-track-category="Social Icons" data-bb-track-action="Click" data-bb-track-label="Twitter, Header"><span
                    className="fa fa-twitter" aria-hidden="true" /><span className="sr-only">Twitter</span></a></li>
                  <li><a href="https://www.instagram.com/theproteinbar/?hl=en&utm_uptracs=null" target="_blank" rel="noopener noreferrer" data-bb-track="button" data-bb-track-on="click" data-bb-track-category="Social Icons" data-bb-track-action="Click" data-bb-track-label="Instagram, Header"><span
                    className="fa fa-instagram" aria-hidden="true" /><span className="sr-only">Instagram</span></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const mapState = (state) => {
  return {
    delivery: state.delivery,
  };
};

Header.propTypes = {
  delivery: PropTypes.object.isRequired,
};

export default connect(mapState)(Header);
