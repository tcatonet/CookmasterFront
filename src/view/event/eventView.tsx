//Thomas Catonet
//VERSION 1.0
import React from 'react';
import  { Toaster } from 'react-hot-toast';

import '../../style/App.css';
import '../../style/message.css';

import CustomTitle from '../../components/title/CustomTitle';
import NavbarEvent from '../../components/navbar/NavbarEvent';


export default function EventView() {

  return (
    <>
      <NavbarEvent />

      <div>
        <Toaster />
          <form className="popup">
            <CustomTitle title='Event' />
          </form>
      </div>
    </>
  );
}
