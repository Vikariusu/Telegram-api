require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
console.log(process.env.STRIPE_API_KEY)
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { uuid } = require("uuidv4");
const Telegram = require("./models/Telegram");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const telegramsRoute = require('./routes/telegrams');

// Middleware
app.use('/telegrams', telegramsRoute);

// ROUTES
app.get('/', (req, res) => {
    res.send('We are on home');
});

app.post("/checkout", async (req, res) => {
  console.log("Request:", req.body);
  
  let error;
  let status;
  try {
    // added telegram
    const { product, token, telegram } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotency_key = uuid();
    const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: 'Purchased the telegram',
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        idempotency_key,
      }
    );
    console.log("Charge:", { charge });
    console.log("Charge ID -", charge.id);

    // Save to DB
    const newTelegram = new Telegram({
      message: telegram.message,
      paymentId: charge.id,
      shippingAddress: charge.shipping
    });

      await newTelegram.save();


    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});

mongoose.set('useUnifiedTopology', true);

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true },
  () => console.log('Connected to DB!')
);

// Listen to the server
app.listen(process.env.PORT || 3000);