var express = require("express");
var router = express.Router();
const data = require("./sales.json");

const arrObj = (data) => {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)), // optional: round to 2 decimal places
  }));
};

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/states", (req, res) => {
  const states = [...new Set(data.map((item) => item.State))];
  res.json(states);
});

router.get("/date-range", (req, res) => {
  const state = req.query.state;
  if (!state) return res.status(400).json({ error: "State is required" });

  const filtered = data.filter((item) => item.State === state);
  if (filtered.length === 0)
    return res.status(404).json({ error: "No records found" });

  const dates = filtered.map((item) => new Date(item["Order Date"]));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  res.json({
    minDate: minDate.toISOString().split("T")[0],
    maxDate: maxDate.toISOString().split("T")[0],
  });
});

router.post("/dashboard-data", (req, res) => {
  const { state, fromDate, toDate } = req.body;

  if (!state) {
    return res.status(400).json({ error: "State is required" });
  }

  // Only parse dates if they are provided
  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;

  const filtered = data.filter((item) => {
    if (item.State !== state) return false;

    const orderDate = new Date(item["Order Date"]);

    if (from && isNaN(from.getTime())) return false;
    if (to && isNaN(to.getTime())) return false;

    const matchesFrom = from ? orderDate >= from : true;
    const matchesTo = to ? orderDate <= to : true;

    return matchesFrom && matchesTo;
  });

  const salesByCity = {};
  const salesByProduct = {};
  const salesByCategory = {};
  const salesBySubCategory = {};
  const salesBySegment = {};

  for (const item of filtered) {
    if (!salesByCity[item.City]) salesByCity[item.City] = 0;
    salesByCity[item.City] += item.Sales;

    if (!salesByProduct[item["Product Name"]])
      salesByProduct[item["Product Name"]] = 0;

    salesByProduct[item["Product Name"]] += item.Sales;

    if (!salesByCategory[item.Category]) salesByCategory[item.Category] = 0;
    salesByCategory[item.Category] += item.Sales;

    if (!salesBySubCategory[item["Sub-Category"]])
      salesBySubCategory[item["Sub-Category"]] = 0;
    salesBySubCategory[item["Sub-Category"]] += item.Sales;

    if (!salesBySegment[item.Segment]) salesBySegment[item.Segment] = 0;
    salesBySegment[item.Segment] += item.Sales;
  }

  const totals = filtered.reduce(
    (acc, curr) => {
      acc.sales += curr.Sales;
      acc.quantity += curr.Quantity;
      acc.discount += curr.Discount;
      acc.profit += curr.Profit;
      return acc;
    },
    { sales: 0, quantity: 0, discount: 0, profit: 0 }
  );

  res.json({
    ...totals,
    salesByCity: arrObj(salesByCity),
    salesByProduct: arrObj(salesByProduct),
    salesByCategory: arrObj(salesByCategory),
    salesBySubCategory: arrObj(salesBySubCategory),
    salesBySegment: arrObj(salesBySegment),
  });
});

module.exports = router;
