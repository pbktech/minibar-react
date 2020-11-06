import React from 'react';

const HeadSpacer = () => {
  return (
    <div>
      <div className="site-header-spacer-desktop" aria-hidden="true" style={{ height: '93.5px' }}/>
      <div className="site-header-spacer-mobile" aria-hidden="true" style={{ height: '70px' }}/>
    </div>
  );
};

export default HeadSpacer;
