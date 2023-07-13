//Thomas Catonet
//VERSION 1.0
import React from 'react';
import  { Toaster } from 'react-hot-toast';

import '../../style/App.css';
import '../../style/message.css';

import CustomTitle from '../../components/title/CustomTitle';
import NavbarHome from '../../components/navbar/NavbarHome';


export default function HomeView() {

  return (
    <>
      <NavbarHome />

      <div>
        <Toaster />
          <form className="popup">
            <CustomTitle title='Home' />
          </form>
      </div>
    </>
  );
}
