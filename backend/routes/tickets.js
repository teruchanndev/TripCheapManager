const express = require("express");
const multer = require("multer");

const Ticket = require("../models/ticket");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg' 
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid){
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const ticket = new Ticket({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    price: req.body.price,
    percent: req.body.percent,
    category: req.body.category,
    categoryService: req.body.categoryService,
    price_reduce: req.body.price_reduce,
    city: req.body.city,
    imagePath: url + '/images/' + req.file.filename

  });
  ticket.save().then(createTicket => {
    res.status(201).json({
      message: "Ticket added successfully",
      ticket: {
        ...createTicket,
        id: createTicket._id
      }
    });
  });
});

router.put("/:id", (req, res, next) => {
  const ticket = new Ticket({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    price: req.body.price,
    percent: req.body.percent,
    category: req.body.category,
    categoryService: req.body.categoryService,
    price_reduce: req.body.price_reduce,
    city: req.body.city
  });
  Ticket.updateOne({ _id: req.params.id }, ticket).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});

router.get("", (req, res, next) => {
  Ticket.find().then(documents => {
    res.status(200).json({
      message: "Tickets fetched successfully!",
      ticket: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Ticket.findById(req.params.id).then(ticket => {
    if (ticket) {
      res.status(200).json(ticket);
    } else {
      res.status(404).json({ message: "Ticket not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Ticket.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Ticket deleted!" });
  });
});

module.exports = router;
