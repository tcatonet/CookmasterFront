//Thomas Catonet
//VERSION 1.0
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
//import { Stripe } from '@stripe/stripe-js';
import Cookies from 'universal-cookie';

import '../../style/style.css';

import NavbarAccountAction from '../../components/navbar/NavbarAccountAction';
//import toast, { Toaster } from 'react-hot-toast';
import Axios from '../../axios_config';
import Loader from '../../components/loader/Loader';
import { ACCOUNT } from '../../components/navbar/Root';
import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';
import CustomTitle from '../../components/title/CustomTitle';
import CustomError from '../../components/error/CustomError';
import tradContent from '../../assets/traduction/dictionary';
import { expressionEmail } from '../../assets/regex/regex';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    marginBottom: 30
  }
});

export default function SubscribeView() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [city, setCity] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [street, setStreet] = React.useState('');

  const [firstNameError, setFirstNameError] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [cityError, setCityError] = React.useState('');
  const [countryError, setCountryError] = React.useState('');
  const [streetError, setStreetError] = React.useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [showFirstForm, setShowFirstForm] = React.useState(true);

  const [language, setLanguage] = React.useState('');

  let navigate = useNavigate();
  const stripe = useStripe();
  const classes = useStyles();
  const elements = useElements();

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '25px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  useEffect(() => {
    const cookies = new Cookies();
    const languageCookie = cookies.get('language');
    setLanguage(languageCookie);
  },[setLanguage]);

  /* const user = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };*/

  function testPaymentForm() {
    var error = false;
    setCityError('');
    setStreetError('');
    setCountryError('');

    if (city === '') {
      setCityError(tradContent['cityErrorNone'][language]);
      error = true;
    }

    if (street === '') {
      setStreetError(tradContent['streetErrorNone'][language]);
      error = true;
    }

    if (country === '') {
      setCountryError(tradContent['countryErrorNone'][language]);
      error = true;
    }

    if (city.length > 100) {
      setCityError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (street.length > 100) {
      setStreetError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (country.length > 100) {
      setCountryError(tradContent['inputErrorToLong'][language]);
      error = true;
    }
    /*  if(!cardDetails?.complete){
         setCardDetailsError("Your cards data mustn't be null");
         error = true;
     }*/
    return error;
  }

  function testUserDataForm() {
    var error = false;
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');

    if (!expressionEmail.test(String(email).toLowerCase()) && email !== '') {
      setEmailError(tradContent['emailErrorFormat'][language]);
      error = true;
    }

    if (firstName === '') {
      setFirstNameError(tradContent['firstNameErrorNone'][language]);
      error = true;
    }

    if (lastName === '') {
      setLastNameError(tradContent['lastNameErrorNone'][language]);
      error = true;
    }

    if (email === '') {
      setEmailError(tradContent['emailErrorNone'][language]);
      error = true;
    }

    if (firstName.length > 100) {
      setFirstNameError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (lastName.length > 100) {
      setLastNameError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    if (email.length > 100) {
      setEmailError(tradContent['inputErrorToLong'][language]);
      error = true;
    }

    return error;
  }

  function cancelBillingForm() {
    setShowFirstForm(true);
  }

  function checkout() {
    if (!testUserDataForm()) {
      setShowFirstForm(false);
    }
  }

  const handleSubmitSub = async () => {
    if (testPaymentForm()) {
      return;
    }
    setShowLoader(true);
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const res = await Axios.post('/create-subscription', {
      customerEmail: email,
      customerName: firstName + lastName,
      customerCity: city,
      customerCountry: country,
      customerStreet: street
    });
    const resAxios = res.data;
    /*
    const options = {
      clientSecret: resAxios.clientSecret,
      appearance: {}
    };
    */
    await stripe
      .confirmCardPayment(resAxios.clientSecret, {
        payment_method: {
          card: cardElement
          //billing_details: billing_details
        }
      })
      .then(function (result) {
        if (result.error) {
          setShowLoader(false);
          alert(tradContent['paymentFail'][language]);
        } else {
          setShowLoader(false);
          alert(tradContent['paymentSuccess'][language]);
          navigate(ACCOUNT);
        }
      });
  };

  return (
    <div>
      <NavbarAccountAction />
      {showLoader ? <Loader /> : null}

      {showFirstForm && !showLoader ? (
        <form className="popup">
          <CustomTitle title={tradContent['personalInfoTitle'][language]} />

          <CustomInput
            name={tradContent['firstNameLabel'][language]}
            type="firstName"
            value={firstName}
            onPress={(e) => setFirstName(e.target.value)}
          />
          <CustomError error={firstNameError} />

          <CustomInput
            name={tradContent['lastNameLabel'][language]}
            type="lastName"
            value={lastName}
            onPress={(e) => setLastName(e.target.value)}
          />
          <CustomError error={lastNameError} />

          <CustomInput
            name={tradContent['emailLabel'][language]}
            type="email"
            value={email}
            onPress={(e) => setEmail(e.target.value)}
          />
          <CustomError error={emailError} />

          <CustomButton text={tradContent['checkoutBp'][language]} onPress={checkout} />
        </form>
      ) : null}

      {!showFirstForm ? (
        <form className="popup">
          <CustomTitle title={tradContent['billingTitle'][language]} />

          <CustomInput
            name={tradContent['cityLabel'][language]}
            type="city"
            value={city}
            onPress={(e) => setCity(e.target.value)}
          />
          <CustomError error={cityError} />

          <CustomInput
            name={tradContent['countryLabel'][language]}
            type="country"
            value={country}
            onPress={(e) => setCountry(e.target.value)}
          />
          <CustomError error={countryError} />

          <CustomInput
            name={tradContent['streetLabel'][language]}
            type="street"
            value={street}
            onPress={(e) => setStreet(e.target.value)}
          />
          <CustomError error={streetError} />

          <CardContent className={classes.content}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </CardContent>

          <CustomButton text={tradContent['payBp'][language]} onPress={handleSubmitSub} />
          <CustomButton text={tradContent['cancelBp'][language]} onPress={cancelBillingForm} />

          <div id="payment-element"></div>
        </form>
      ) : null}
    </div>
  );
}
