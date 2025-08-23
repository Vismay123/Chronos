const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// ✅ Create new order
router.post("/", async (req, res) => {
  try {
    const { items, total, user, paymentMethod } = req.body;

    if (!items || !total || !user || !paymentMethod)
      return res.status(400).json({ message: "Missing required fields" });

    const order = new Order({ items, total, user, paymentMethod });
    await order.save();

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update order status only
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update entire order (status, paymentMethod, etc.)
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body; // e.g., { status, paymentMethod }
    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
