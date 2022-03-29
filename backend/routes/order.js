const express = require("express");
const axios = require("axios");

const router = express.Router();

//  http requests to /api/order gets routed here
router.post("", (req, res, next) => {

  try {
    let order= {
      cics_order_req: {
        placeOrder: {
          itemID: req.body.itemID,
          orderQuantity: req.body.orderQuantity
        }
      }
    }
    const response = await axios.post("http://192.168.48.127:19890/catalog/order", order);
    res.status(200).json(response.data.cics_order_resp);

  } catch (error) {
        console.log("error:" + error);
  }
});


module.exports = router;
