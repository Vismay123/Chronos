const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1, min: 1 }
    }
  ],
  total: { type: Number, required: true },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  paymentMethod: { 
    type: String, 
    enum: ["Card", "Cash on Delivery"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
