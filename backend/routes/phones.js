const express = require("express");
const multer = require("multer");
const axios = require("axios");

const Phone = require("../models/phone");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.get("/:id", (req, res, next) => {

  function getCics() {
    return axios.get("http://192.168.48.127:19890/catalog/items/"+req.params.id);
  }  
  function getDb2() {
    return axios.get("http://192.168.48.127:19890/catalog_device_dimensions/devices/"+req.params.id);
  }
  function getDvm() {
    return axios.get("http://192.168.48.127:19890/catalog_shipping/itemShipping?ITEMID="+req.params.id, {headers: {Authorization: 'Basic YmtlbGxlcjpwYXNzdzByZA=='}});
  }
  function getMongo(){
    return Phone.findOne({itemID: req.params.id}).lean().exec();
  }

  Promise.all([getCics(), getDb2(), getDvm(), getMongo()])
  .then(function (results) {
    const cicsItem = results[0].data.cics_single_resp.inquire_single.single_item;
    const db2Item = results[1].data['ResultSet Output'][0];
    const dvmItem = results[2].data.Records[0];
    const respMongo = results[3];

    const mergedPhone = {...cicsItem, ...db2Item, ...dvmItem, ...respMongo};

    res.status(200).json(mergedPhone);
  }).catch(errors => {
    console.log("error:" + errors);
  })
})

router.get("", (req, res, next) => {

  function getCics() {
    return axios.get('http://192.168.48.127:19890/catalog/items?startItemID=0010');
  }  
  function getMongo(){
    return Phone.find().lean().exec();
  }
  
  Promise.all([getCics(), getMongo()])
    .then(function (results) {
      const cicsItems = results[0].data.cics_cat_resp.inquire_request.cat_item;
      const respMongo = results[1];

      const mergedPhones = cicsItems.map((item, i) => Object.assign({}, item, respMongo[i]));

      res.status(200).json({
        message: "Phones fetched successfully!",
        phones: mergedPhones
      });
    }).catch(errors => {
      console.log("error:" + errors);
    })
});


router.post(
  "",
  multer({
    storage: storage
  }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      itemID: 10
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

router.put(
  "/:id",
  multer({
    storage: storage
  }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({
      _id: req.params.id
    }, post).then(result => {
      res.status(200).json({
        message: "Update successful!"
      });
    });
  }
);

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted!"
    });
  });
});

module.exports = router;
