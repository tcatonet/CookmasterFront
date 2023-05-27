import stripe
import os
from flask import Flask, redirect, jsonify, json, request, current_app
from flask_cors import CORS
import stripe

app = Flask(__name__)
cors = CORS(app)

port = 4000
PUBLISHABLE_KEY = "pk_test_51LeLwrFcX5N52aWT3r53a8PNzL7vGRKoCpL6wYuAWqjjFSBbSeA0ckqyUWbyTO0Umt8rhyVWXmtieAOh4LGHl1Oy00eC5VuOnN"
SECRET_KEY = "sk_test_51LeLwrFcX5N52aWTP6kkGlqsY8YglJhesoK5kt6g2BUo355ExndgHBV1KAMbpBEWpU6cHIsxGM0jW28UwFoOhQNu00V7KYb4Gc"
stripe.api_key = 'sk_test_51LeLwrFcX5N52aWTP6kkGlqsY8YglJhesoK5kt6g2BUo355ExndgHBV1KAMbpBEWpU6cHIsxGM0jW28UwFoOhQNu00V7KYb4Gc'
price_id = "price_1LfPLqFcX5N52aWTPd1LdlYg"

@app.route('/code', methods=['POST'])
def sendcode():
    return jsonify(success=True, error='', message='Code sucessefully send'), 200



@app.route('/create-subscription', methods=['POST'])
def create_subscription():

    data = json.loads(request.data)
    print(data)
    customer_email = data['customerEmail']
    customer_name = data['customerName']
    customer_city = data['customerCity']
    customer_country = data['customerCountry']
    customer_street = data['customerStreet']

    customer = stripe.Customer.create(
        email=customer_email,
        name=customer_name,
        address={
          "city": customer_city,
          "country": customer_country,
          "line1": customer_street,

        },
    )

    customer_id = customer["id"]

    try:
        # Create the subscription. Note we're expanding the Subscription's
        # latest invoice and that invoice's payment_intent
        # so we can pass it to the front end to confirm the payment
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{
                'price': price_id,
            }],
            payment_behavior='default_incomplete',
            payment_settings={'save_default_payment_method': 'on_subscription'},
            expand=['latest_invoice.payment_intent'],
        )

        print(subscription)
        return jsonify(subscriptionId=subscription.id, clientSecret=subscription.latest_invoice.payment_intent.client_secret), 200

    except Exception as e:
        return jsonify(error={'message': e.user_message}), 400


@app.route('/webhook', methods=['POST'])
def webhook_received():
    # You can use webhooks to receive information about asynchronous payment events.
    # For more about our webhook events check out https://stripe.com/docs/webhooks.
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    request_data = json.loads(request.data)


@app.route('/authenticate', methods=['POST'])
def authenticate():
	return jsonify(validateAccount= True, success=True, refresh_token='AZERTY', error='', accessCreateProject='true', accessUpdateProject='true', accessDeleteProject='true', accessSubscription='true', accessUpdateAccount='true', subscription='false', accessSubAccount='true'), 200


@app.route('/register', methods=['POST'])
def register():
	return jsonify(success=True, refresh_token='AZERTY', error='', accessCreateProject='true', accessUpdateProject='true', accessDeleteProject='true', accessSubscription='true', accessUpdateAccount='true', subscription='false', accessSubAccount='true'), 200


@app.route('/projects', methods=['GET'])
def projects():
    DATA = [{'name': '1','description': 'toto', 'departement': '91', 'infrastructure': 'habitation'},{'name': '2','description': 'tata','departement': '92', 'infrastructure': 'habitation'},{'name': '3','description': 'tata','departement': '92', 'infrastructure': 'parking'}]

    return jsonify(success=True, refresh_token='AZERTY', error='', projects=DATA), 200

@app.route('/project', methods=['DELETE'])
def projectsDelete():
    data = json.loads(request.data)
    print(data)
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Project sucessefully delete'), 200

@app.route('/project', methods=['PATCH'])
def projectsUpdate():
    data = json.loads(request.data)
    print(data)
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Project sucessefully update'), 200
    
@app.route('/project', methods=['GET'])
def projectGet():
    DATA = {'name': '1','description': 'toto', 'departement': '999', 'infrastructure': 'habitation'}
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Project sucessefully update', project=DATA), 200

@app.route('/project', methods=['POST'])
def projectCreate():
    DATA = {'name': '1','description': 'toto', 'departement': '999', 'infrastructure': 'habitation'}
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Project sucessefully update', project=DATA), 200

@app.route('/account', methods=['GET'])
def accountGet():
    DATA = {'name': '123','email': 'email'}
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Project sucessefully update', user=DATA), 200

@app.route('/account', methods=['DELETE'])
def accountDelete():
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Account sucessefully delete'), 200

@app.route('/account', methods=['PATCH'])
def accountUpdate():
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Account sucessefully update'), 200



@app.route('/subAccount', methods=['GET'])
def subaccountGet():
    DATA = [ {'id': '1','email': 'catonethomas@yahoo.fr','name': 'toto','access': ''},{'id': '2', 'email': 'tutu@uuu.fr', 'name': 'tutu','access': '' }]
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Project sucessefully update', subAccount=DATA), 200

@app.route('/subAccount', methods=['DELETE'])
def subaccountDelete():
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Account sucessefully delete'), 200

@app.route('/subAccount', methods=['PATCH'])
def subaccountUpdate():
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Account sucessefully update'), 200

@app.route('/subAccount', methods=['POST'])
def subaccountCreate():
    return jsonify(success=True, refresh_token='AZERTY', error='', message='Account sucessefully update'), 200

@app.route('/invoices', methods=['GET'])
def invoicesGet():
    DATA =  [{'id': '1', 'title': '12/12/2022 10000 euros','url': "https://invoice.stripe.com/i/acct_1LeLwrFcX5N52aWT/test_YWNjdF8xTGVMd3JGY1g1TjUyYVdULF9NUW5BTlV4d1NrRkdEM2lMQWZSSVhuNGlxWkxkcWJSLDUzNzE1NDQ20200yX2SdATJ?s=db"},{'id': '2','title': '12/11/2022 10 euros','url': "https://invoice.stripe.com/i/acct_1LeLwrFcX5N52aWT/test_YWNjdF8xTGVMd3JGY1g1TjUyYVdULF9NUG1MeVFJenhtbEZzQ2RuMzZPR3ZZeGJOWUJXMnpmLDUzNzE2MDU102000sVZ4KPZ?s=db"}]

    return jsonify(success=True, refresh_token='AZERTY', error='', message='Account sucessefully update', invoices=DATA), 200

@app.route('/cancel-subscription', methods=['POST'])
def cancelSubscription():
    data = json.loads(request.data)
    try:
         # Cancel the subscription by deleting it
        print(data)
        print(data['subscriptionId'])

        deletedSubscription = stripe.Subscription.delete(data['subscriptionId'])
        return jsonify(deletedSubscription)
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 403

if __name__ == '__main__':
      app.run(host='0.0.0.0', port=port)




