const createPaymentIntent = async (req, res, next) => {
    const stripe = require("stripe")(
        "sk_test_51NGMdQFUpR2M3acGyKydVd3HKugHmD2QzgLZ7TTMaHtFttry97RxQ4h7Ni8kF9QBu9ShujXkBfymSiW3g02kvb7M00OBpkwbm2"
      );
    
      const { amount, email, token, uid,} = req.body;
      
        console.log("hi")
        //! create a customer
      stripe.customers
        .create({
          email: email,
          source: token.id,
          name: token.card.name,
        })
        .then((customer) => {
          return stripe.charges.create({
            amount: parseFloat(amount) * 100,
            description: `Payment for USD ${amount}`,
            currency: "USD",
            customer: customer.id,
          });
        })
        .then(async (charge) => {
            try {
                return res.status(200).json(charge)    
            } catch (error) {
                console.log(error)
                return res.status(400).json(error)
            }



        })
        .catch(async(err) =>{
            return res.status(400).json(err)
        });
};


const defaultPage = (_req, res)=>{
  res.send("beeb-beeb-boop");
}


module.exports = {
createPaymentIntent,
defaultPage
};