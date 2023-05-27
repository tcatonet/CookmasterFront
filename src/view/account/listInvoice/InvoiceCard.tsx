//Thomas Catonet
//VERSION 2.0

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import Cookies from 'universal-cookie';

import CustomButtonInvoice from '../../../components/button/CustomButtonInvoice';
import tradContent from '../../../assets/traduction/dictionary';

const style = {
  width: '25vh',
  color: '#242424',
  backgroundColor: 'white',
  border: '0.1vh solid #242424',
  boxShadow: '0vh 1vh 2vh #222',
  padding: '3vh',
  margin: '1vh'
};

const styleTitle = {
  fontSize: '1.5vh'
};

function InvoiceCard(props: any) {
  const [language, setLanguage] = React.useState('');

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function openInvoice(url: string) {
    window.location.replace(url);
  }

  return (
    <div style={style}>
      <Row>
        <Col>
          <Card.Title style={styleTitle}> {props.title} </Card.Title>
        </Col>
      </Row>

      <CustomButtonInvoice
        text={tradContent['viewInvoiceBp'][language]}
        onPress={() => openInvoice(props.url)}
      />
    </div>
  );
}

export default InvoiceCard;
