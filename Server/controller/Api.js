const axios = require('axios');
const Product = require("../models/Product");

exports.fetchApi = async (req, res) => {
    try {
        // Fetch the data from the third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;
    
        // Insert the fetched data into the MongoDB collection
        await Product.insertMany(products);
    
        res.send('Database initialized with seed data');
        // console.log("error");
      } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).send('Error initializing database');
      }
}


// Show all Transaction 
exports.listTransactions = async (req, res) => {
  try {
    const { search, page = 1, perPage = 10 } = req.body;

    // Build the query object
    const body = {};

    if (search) {
      body.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive regex search
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total number of documents that match the query
    const total = await Product.countDocuments(body);

    // Fetch data with pagination
    const transactions = await Product.find(body)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    // Send the response
    res.json({
      total,
      page: parseInt(page),
      perPage: parseInt(perPage),
      transactions
    });
  } catch (error) {
    console.error('Error listing transactions:', error);
    res.status(500).send('Server error');
  }
};

// API For Statistics
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).send('Month is required');
    }

    // Convert month name to month number
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;

    // Calculate total sale amount for the selected month
    const totalSaleAmount = await Product.aggregate([
      {
        $match: {
          sold: true,
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price' },
        },
      },
    ]);

    // Calculate total number of sold items for the selected month
    const totalSoldItems = await Product.countDocuments({
      sold: true,
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    // Calculate total number of not sold items for the selected month
    const totalNotSoldItems = await Product.countDocuments({
      sold: false,
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    // Send the response
    res.json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('Server error');
  }
};

exports.getPriceRangeDistribution = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).send('Month is required');
    }

    // Convert month name to month number
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;

    // Define the price ranges
    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity },
    ];

    // Filter by month regardless of year
    const matchMonthQuery = {
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    };

    // Aggregate data to get the count of items in each price range
    const priceRangeData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Product.countDocuments({
          ...matchMonthQuery,
          price: { $gte: range.min, $lte: range.max },
        });
        return { range: range.range, count };
      })
    );

    // Send the response
    res.json(priceRangeData);
  } catch (error) {
    console.error('Error fetching price range distribution:', error);
    res.status(500).send('Server error');
  }
};

//Create an API for pie chart Find unique categories and number of items from that
// category for the selected month regardless of the year.

exports.getCategoryDistribution = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).send('Month is required');
    }

    // Convert month name to month number
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;

    // Filter by month regardless of year
    const matchMonthQuery = {
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    };

    // Aggregate to find unique categories and count the number of items in each category
    const categoryData = await Product.aggregate([
      { $match: matchMonthQuery },
      {
        $group: {
          _id: '$category', // Group by category
          count: { $sum: 1 }, // Count the number of items in each category
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]);

    // Send the response
    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    res.status(500).send('Server error');
  }
};


exports.getCombinedData = async (req, res) => {
  try {
    const { search, page = 1, perPage = 10, month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    // Convert month name to month number
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;

    const body = {};

    // if (search) {
    //   body.$or = [
    //     { title: { $regex: search, $options: 'i' } }, // Case-insensitive regex search
    //     { description: { $regex: search, $options: 'i' } },
    //   ];

    //   // Assuming 'price' is a number, we cannot use regex, so we'll convert it to a string for searching
    //   if (!isNaN(search)) {
    //     body.$or.push({ price: Number(search) });
    //   }
    // }
        
     // Example search query


// Execute the query
// Product.find(query)
//   .then(products => {
//     console.log(products);
//   })
//   .catch(err => {
//     console.error('Error fetching products:', err);
//   });

if (search) {
  const regex = new RegExp(search, 'i'); // Case-insensitive regex for string fields

  body.$or = [
    { title: regex },
    { description: regex },
    { category: regex }
  ];

  // Check if the search query is a valid number and add to query if so
  if (!isNaN(search)) {
    body.$or.push({ price: Number(search) });
  }
}
      

    if (month) {
      body.$expr = { $eq: [{ $month: '$dateOfSale' }, monthNumber] }; // Use $expr to filter by month
    }

    // Get total number of transactions that match the query
    const totalTransactions = await Product.countDocuments(body);
    
    const transactions = await Product.find(body).skip((page - 1) * perPage).limit(parseInt(perPage));

    // Fetch statistics data
    const totalSaleAmount = await Product.aggregate([
      {
        $match: {
          sold: true,
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price' },
        },
      },
    ]);

    const totalSoldItems = await Product.countDocuments({
      sold: true,
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    const totalNotSoldItems = await Product.countDocuments({
      sold: false,
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    // Fetch price range distribution data
    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity },
    ];

    const priceRangeData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Product.countDocuments({
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
          price: { $gte: range.min, $lte: range.max },
        });
        return { range: range.range, count };
      })
    );

    // Fetch category distribution data
    const categoryData = await Product.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
        },
      },
      {
        $group: {
          _id: '$category', // Group by category
          count: { $sum: 1 }, // Count the number of items in each category
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]);

    // Combine all the data
    const combinedData = {
      transactions: {
        total: totalTransactions,
        page: parseInt(page),
        perPage: parseInt(perPage),
        transactions,
      },
      statistics: {
        totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
        totalSoldItems,
        totalNotSoldItems,
      },
      priceRangeDistribution: priceRangeData,
      categoryDistribution: categoryData,
    };

    // Send the response
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
