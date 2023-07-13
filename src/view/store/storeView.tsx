//Thomas Catonet
//VERSION 1.0
import React from 'react';
import  { Toaster } from 'react-hot-toast';

import '../../style/App.css';
import '../../style/message.css';

import CustomTitle from '../../components/title/CustomTitle';
import NavbarStore from '../../components/navbar/NavbarStore';


export default function StoreView() {

  return (
    <>
      <NavbarStore />

      <div>
        <Toaster />
          <form className="popup">
            <CustomTitle title='Store' />
          </form>
      </div>
    </>
  );
}
