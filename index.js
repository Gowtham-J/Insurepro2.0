const data = require("./csvjson.json");

const moment = require("moment");

// Helper function to get month-year format
const getMonthYear = (date) => moment(date).format("YYYY-MM");

// Total sales of the store
const totalSales = data.reduce((acc, item) => acc + item["Total Price"], 0);
console.log(`Total Sales: $${totalSales}`);

// Month-wise sales totals
const monthWiseSales = data.reduce((acc, item) => {
  const monthYear = getMonthYear(item["Date"]);
  if (!acc[monthYear]) acc[monthYear] = 0;
  acc[monthYear] += item["Total Price"];
  return acc;
}, {});

console.log("Month-wise Sales Totals:");
for (const [month, total] of Object.entries(monthWiseSales)) {
  console.log(`${month}: $${total}`);
}

// Most popular quantity sold in each month
const monthWiseQuantity = data.reduce((acc, item) => {
  const monthYear = getMonthYear(item["Date"]);
  if (!acc[monthYear]) acc[monthYear] = {};
  if (!acc[monthYear][item["SKU"]]) acc[monthYear][item["SKU"]] = 0;
  acc[monthYear][item["SKU"]] += item["Quantity"];
  return acc;
}, {});

const mostPopularItems = {};
for (const [month, items] of Object.entries(monthWiseQuantity)) {
  mostPopularItems[month] = Object.entries(items).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];
}

console.log("Most Popular Items per Month:");
for (const [month, item] of Object.entries(mostPopularItems)) {
  console.log(`${month}: ${item}`);
}

// Items generating most revenue in each month
const monthWiseRevenue = data.reduce((acc, item) => {
  const monthYear = getMonthYear(item["Date"]);
  if (!acc[monthYear]) acc[monthYear] = {};
  if (!acc[monthYear][item["SKU"]]) acc[monthYear][item["SKU"]] = 0;
  acc[monthYear][item["SKU"]] += item["Total Price"];
  return acc;
}, {});

const mostRevenueItems = {};
for (const [month, items] of Object.entries(monthWiseRevenue)) {
  mostRevenueItems[month] = Object.entries(items).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];
}

console.log("Items Generating Most Revenue per Month:");
for (const [month, item] of Object.entries(mostRevenueItems)) {
  console.log(`${month}: ${item}`);
}

// For the most popular item, find min, max, and average number of orders each month
const orderCounts = data.reduce((acc, item) => {
  const monthYear = getMonthYear(item["Date"]);
  const itemSKU = item["SKU"];
  if (!acc[monthYear]) acc[monthYear] = {};
  if (!acc[monthYear][itemSKU]) acc[monthYear][itemSKU] = [];
  acc[monthYear][itemSKU].push(item["Quantity"]);
  return acc;
}, {});

const popularItemOrderStats = {};
for (const [month, items] of Object.entries(orderCounts)) {
  const popularItem = mostPopularItems[month];
  if (items[popularItem]) {
    const quantities = items[popularItem];
    const minOrders = Math.min(...quantities);
    const maxOrders = Math.max(...quantities);
    const avgOrders =
      quantities.reduce((sum, qty) => sum + qty, 0) / quantities.length;
    popularItemOrderStats[month] = { minOrders, maxOrders, avgOrders };
  }
}

console.log("Most Popular Item Order Stats per Month:");
for (const [month, stats] of Object.entries(popularItemOrderStats)) {
  console.log(
    `${month}: Min Orders: ${stats.minOrders}, Max Orders: ${
      stats.maxOrders
    }, Avg Orders: ${stats.avgOrders.toFixed(2)}`
  );
}
