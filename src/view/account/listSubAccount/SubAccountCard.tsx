//Thomas Catonet
//VERSION 1.0

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../../../style/style.css';

import CustomButtonCard from '../../../components/button/CustomButtonCard';
import tradContent from '../../../assets/traduction/dictionary';
import { SUB_ACCOUNT_UPDATE, SUB_ACCOUNT_DELETE } from '../../../components/navbar/Root';

const styleCard = {
  width: '30vh',
  color: '#242424',
  backgroundColor: 'white',
  border: '0.1vh solid #242424',
  boxShadow: '0vh 1vh 2vh #222',
  padding: '5.5vh',
  margin: '1vh'
};

const styleTitle = {
  marginTop: '0vh',
  marginBottom: '2vh',
  fontSize: '1.5vh'
};

function SubAccountCard(props: any) {
  const [language, setLanguage] = React.useState('');
  let navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  function deleteSubAccount() {
    localStorage.setItem('current_project', props.name);
    navigate(SUB_ACCOUNT_DELETE);
  }

  function updateSubAccount() {
    localStorage.setItem('current_project', props.name);
    navigate(SUB_ACCOUNT_UPDATE);
  }

  return (
    <>
      <div style={styleCard}>
        <Row>
          <Col>
            <Card.Title style={styleTitle} className="titleCard">
              Email: {props.email}
            </Card.Title>
            <Card.Title style={styleTitle} className="titleCard">
              Name: {props.name}
            </Card.Title>
          </Col>
        </Row>

        <CustomButtonCard text={tradContent['updateBp'][language]} onPress={updateSubAccount} />
        <CustomButtonCard text={tradContent['deleteBp'][language]} onPress={deleteSubAccount} />
      </div>
    </>
  );
}

export default SubAccountCard;
