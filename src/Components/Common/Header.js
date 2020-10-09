import React from "react";
import Login from '../Login.js';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header class="site-header" style={{position: "fixed",zIndex:"1000"}}>
      <a href="#main-content" class="skip">Skip to main content</a>
      <div class="site-header-desktop" style={{position: "relative", width: "100vw"}}>
        <div class="site-header-desktop-primary" data-header-sticky>
          <div class="container">
            <div class="site-logo">
            <Link to='/' className="site-logo__btn">
                <img class="site-logo__expanded" src="/assets/images/MiniBarLogo_bluewhite.png" alt="Protein Bar & Kitchen Home" />
            </Link>
            </div>
            <nav class="site-nav" >
              <ul class="site-nav-menu" data-menu-type="desktop">
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/restaurants/">Locations</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/menu/">Menu</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/about/">Story</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/catering/">Catering</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/rewards/">Rewards</a>
                </li>
                  <Login />
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div class="site-header-mobi">
        <div class="site-logo">
        <Link to='/' className="site-logo__btn">
            <img class="site-logo__expanded" src="/assets/images/MiniBarLogo_bluewhite.png" alt="Protein Bar & Kitchen Home" />
        </Link>
        </div>
        <button type="button" class="nav-toggle-btn" aria-controls="SiteHeaderMobilePanel" aria-expanded="false">
          <span class="sr-only">Toggle Navigation</span>
          <span class="nav-toggle-btn__line"></span>
          <span class="nav-toggle-btn__line"></span>
          <span class="nav-toggle-btn__line"></span>
        </button>
        <div id="SiteHeaderMobilePanel" class="site-header-mobi-panel" role="dialog" aria-modal="true" aria-label="Navigation Menu Modal">
          <div class="site-header-mobi-panel__inner">
            <nav class="site-nav" aria-label="Navigation Menu">
              <ul class="site-nav-menu" data-menu-type="mobile">
                <li>
                  <Login />
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/restaurants/">Locations</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/menu/">Menu</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/about/">Story</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/catering/">Catering</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/rewards/">Rewards</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/press/">Press</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/franchise/">Franchise</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/pro-team/">Pro-Team</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://www.theproteinbar.com/contact/">Contact</a>
                </li>
                <li>
                  <a class="site-nav-link " target="_blank" href="https://login.estratex.com/Jobs/Protein%20Bar" target="_blank" rel="noopener">Careers</a>
                </li>
                <li>
                  <Login />
                </li>
              </ul>
            </nav>
            <div class="site-social site-social--bordered">
              <ul class="social-accounts">
                <li><a href="https://www.facebook.com/proteinbar/?utm_uptracs=null" target="_blank" rel="noopener" data-bb-track="button" data-bb-track-on="click" data-bb-track-category="Social Icons" data-bb-track-action="Click"
                    data-bb-track-label="Facebook, Header"><span class="fa fa-facebook" aria-hidden="true"></span><span class="sr-only">Facebook</span></a></li>
                <li><a href="https://twitter.com/theproteinbar?utm_uptracs=null" target="_blank" rel="noopener" data-bb-track="button" data-bb-track-on="click" data-bb-track-category="Social Icons" data-bb-track-action="Click"
                    data-bb-track-label="Twitter, Header"><span class="fa fa-twitter" aria-hidden="true"></span><span class="sr-only">Twitter</span></a></li>
                <li><a href="https://www.instagram.com/theproteinbar/?hl=en&utm_uptracs=null" target="_blank" rel="noopener" data-bb-track="button" data-bb-track-on="click" data-bb-track-category="Social Icons" data-bb-track-action="Click"
                    data-bb-track-label="Instagram, Header"><span class="fa fa-instagram" aria-hidden="true"></span><span class="sr-only">Instagram</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
