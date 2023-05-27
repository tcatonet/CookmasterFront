//Thomas Catonet
//VERSION 1.0

import React from 'react';
import SubscribeView from './SubscribeView';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51LeLwrFcX5N52aWT3r53a8PNzL7vGRKoCpL6wYuAWqjjFSBbSeA0ckqyUWbyTO0Umt8rhyVWXmtieAOh4LGHl1Oy00eC5VuOnN'
);

export default function PageSubscribe() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <SubscribeView />
      </Elements>
    </>
  );
}
