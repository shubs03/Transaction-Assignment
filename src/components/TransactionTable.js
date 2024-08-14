
// import React, { useState, useEffect } from 'react';
// import { getTransactions } from '../api';

// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from 'chart.js';

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// const TransactionTable = () => {
//   const [month, setMonth] = useState('March');
//   const [search, setSearch] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [statistics, setStatistics] = useState({
//     totalSaleAmount: 0,
//     totalSoldItems: 0,
//     totalNotSoldItems: 0,
//   });
//   const [priceRangeData, setPriceRangeData] = useState([]);

//   console.log(search);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await getTransactions(month, search, currentPage);
//         const data = response?.data?.transactions;
//         const transactionsData = data?.transactions || [];
//         const totalPages = Math.ceil((data?.total || 0) / (data?.perPage || 10));

//         setTransactions(transactionsData);
//         setTotalPages(totalPages);
        

//         const statisticsResponse = await getTransactions(month);
//         const staticData = statisticsResponse?.data?.statistics;
//         setStatistics(staticData);

//         const priceRangeResponse = await getTransactions(month, search, currentPage);
//         const priceRangeDistribution = priceRangeResponse.data.priceRangeDistribution;
//         setPriceRangeData(priceRangeDistribution);
//       } catch (error) {
//         console.error('Error fetching transactions:', error.message);
//       }
//     };
    
//     fetchTransactions();
//   }, [month, search, currentPage]);

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleMonthChange = (e) => {
//     setMonth(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const chartData = {
//     labels: priceRangeData.map((range) => range.range),
//     datasets: [
//       {
//         label: 'Number of Items',
//         data: priceRangeData.map((range) => range.count),
//         backgroundColor: 'rgba(54, 162, 235, 0.5)', // Change to a more vibrant color
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };
    
//   return (
//     <div className="p-16  bg-[#000000] min-h-screen text-white">
//       <div className="text-center max-w-[1000px] items-center mx-auto flex flex-col font-semibold mb-20 gap-8 text-gray-300">
//        <span className= " bg-clip-text text-transparent  bg-gradient-to-r from-[#7575ff] via-[#9a6fb0] to-[#7a4193] font-extrabold text-5xl "> Transactions Dashboard </span>
//         <p className='bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 text-3xl' >Effortlessly manage and analyze sales data with our sleek, responsive dashboard. Navigate transactions and uncover insights with ease for better decision-making</p>
//       </div>

//       <div className="flex justify-between w-[1300px] mx-auto  items-center  mb-10">
//         <select
//           value={month}
//           onChange={handleMonthChange}
//           className="px-4 py-3 mb-4 ml-6  w-[150px] sm:mb-0 border border-gray-600 rounded-lg bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           {[
//             'January',
//             'February',
//             'March',
//             'April',
//             'May',
//             'June',
//             'July',
//             'August',
//             'September',
//             'October',
//             'November',
//             'December',
//           ].map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           value={search}
//           onChange={handleSearchChange}
//           placeholder="Search by title/description/price"
//           className="p-3 ml-9 border w-[250px] border-gray-600 rounded-lg bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//       </div>

//       <div className="mb-8 bg-gradient-to-b max-w-[700px] mx-auto flex flex-col justify-center items-center from-[#434343] p-6 rounded-lg shadow-md shadow-zinc-900 border border-solid border-neutral-600">
//         <h2 className="text-4xl font-semibold mb-4 text-gray-300">
//           Transaction Statistics for {month}
//         </h2>
//         <div className="text-lg text-gray-300">
//           Total Sale Amount:{' '}
//           <span className="font-bold text-blue-400">
//             ${statistics.totalSaleAmount.toFixed(2)}
//           </span>
//         </div>
//         <div className="text-lg text-gray-300">
//           Total Sold Items:{' '}
//           <span className="font-bold text-blue-400">
//             {statistics.totalSoldItems}
//           </span>
//         </div>
//         <div className="text-lg text-gray-300">
//           Total Not Sold Items:{' '}
//           <span className="font-bold text-blue-400">
//             {statistics.totalNotSoldItems}
//           </span>
//         </div>
//       </div>
           
//             <h2 className=" bg-clip-text text-transparent bg-gradient-to-r from-[#7878fc] via-[#a1a1ff] to-[#d1d1ff] text-4xl my-14 text-center font-bold"> Monthly Transactions Overview</h2>

//       <table className="min-w-full bg-gradient-to-b max-w-[1200px] mx-auto  from-[#434343] to-[#000000] border border-solid border-neutral-600  shadow-zinc-900 rounded-xl shadow-md mb-8">
//         <thead className="bg-[#232526]">
//           <tr>
//             <th className="py-3 px-4 border-b  border-solid border-neutral-600 text-left font-semibold text-white">
//               Title
//             </th>
//             <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">
//               Description
//             </th>
//             <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">
//               Price
//             </th>
//             <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">
//               Category
//             </th>
//             <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">
//               Date of Sale
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.length ? (
//             transactions.map((transaction) => (
//               <tr
//                 key={transaction.id}
//                 className="hover:bg-gray-700 transition duration-200"
//               >
//                 <td className="py-3 px-4 border-b border-solid border-neutral-600  text-gray-300">
//                   {transaction.title}
//                 </td>
//                 <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">
//                   {transaction.description}
//                 </td>
//                 <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">
//                   ${transaction.price.toFixed(2)}
//                 </td>
//                 <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">
//                   {transaction.category}
//                 </td>
//                 <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">
//                   {new Date(transaction.dateOfSale).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan="4"
//                 className="py-3 px-4 border-b border-solid border-neutral-600 text-center text-gray-500"
//               >
//                 No transactions found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <div className="flex justify-between items-center mb-8">
//         <button
//           onClick={handlePreviousPage}
//           disabled={currentPage === 1}
//           className="px-6 py-3 ml-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:bg-gray-400 transition duration-200"
//         >
//           Previous
//         </button>
//         <span className="text-lg font-semibold text-gray-300">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           className="px-6 py-3 bg-gradient-to-r mr-5 from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:bg-gray-400 transition duration-200"
//         >
//           Next
//         </button>
//       </div>

//         <h2 className='bg-clip-text text-transparent tracking-normal bg-gradient-to-r from-[#7575ff] via-[#9a6fb0] to-[#7a4193] text-5xl my-14 text-center font-bold'>Monthly Transaction Price Range Analysis</h2>

//       <div className="mb-10  max-w-[1200px] mx-auto bg-gradient-to-b from-[#282828] to-[#000000] border border-solid border-neutral-600 shadow-md shadow-stone-800 p-6 rounded-lg ">
//         <h2 className="text-2xl font-semibold mb-4 text-white">
//           Price Range Distribution for {month}
//         </h2>
//         <div className="relative h-64">
//           <Bar
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false, // Ensure the chart is smaller
//               plugins: {
//                 legend: {
//                   position: 'top',
//                   labels: {
//                     color: '#E2E8F0', // Customize legend text color
//                   },
//                 },
//                 tooltip: {
//                   callbacks: {
//                     label: (context) => `${context.label}: ${context.raw} items`,
//                   },
//                 },
//               },
//               scales: {
//                 x: {
//                   title: {
//                     display: true,
//                     text: 'Price Range',
//                     color: '#E2E8F0',
//                   },
//                   ticks: {
//                     color: '#E2E8F0', // Customize x-axis label color
//                   },
//                 },
//                 y: {
//                   title: {
//                     display: true,
//                     text: 'Number of Items',
//                     color: '#E2E8F0',
//                   },
//                   ticks: {
//                     color: '#E2E8F0', // Customize y-axis label color
//                   },
//                   beginAtZero: true,
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionTable;

import React, { useState, useEffect } from 'react';
import { getTransactions } from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const TransactionTable = () => {
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [priceRangeData, setPriceRangeData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions(month, search, currentPage);
        const data = response?.data?.transactions;
        const transactionsData = data?.transactions || [];
        const totalPages = Math.ceil((data?.total || 0) / (data?.perPage || 10));

        setTransactions(transactionsData);
        setTotalPages(totalPages);

        const statisticsResponse = await getTransactions(month);
        const staticData = statisticsResponse?.data?.statistics;
        setStatistics(staticData);

        const priceRangeResponse = await getTransactions(month, search, currentPage);
        const priceRangeDistribution = priceRangeResponse.data.priceRangeDistribution;
        setPriceRangeData(priceRangeDistribution);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchTransactions();
  }, [month, search, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const chartData = {
    labels: priceRangeData.map((range) => range.range),
    datasets: [
      {
        label: 'Number of Items',
        data: priceRangeData.map((range) => range.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-8 sm:p-12 lg:p-16 bg-[#000000] min-h-screen text-white">
      <div className="text-center max-w-[90%] lg:max-w-[1000px] mx-auto flex flex-col font-semibold mb-16 sm:mb-20 gap-8 text-gray-300">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7575ff] via-[#9a6fb0] to-[#7a4193] font-extrabold text-3xl sm:text-5xl">
           Transaction Dashboard 
        </span>
        <p className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 text-xl sm:text-3xl">
        Effortlessly manage and analyze sales data with our sleek, responsive dashboard. Navigate transactions and uncover insights with ease for better decision-making
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center w-[90%] lg:w-[1200px] mx-auto mb-8 sm:mb-10 gap-4 sm:gap-0">
        <select
          value={month}
          onChange={handleMonthChange}
          className="px-4 py-3 mb-4 sm:mb-0 w-full sm:w-[150px] border border-gray-600 rounded-lg bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title/description/price"
          className="p-3 w-full sm:w-[250px] border border-gray-600 rounded-lg bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-8 bg-gradient-to-b from-[#434343] to-[#000000] max-w-[90%] lg:max-w-[700px] mx-auto flex flex-col justify-center items-center p-6 rounded-lg shadow-md shadow-zinc-900 border border-solid border-neutral-600">
        <h2 className="text-2xl sm:text-4xl font-semibold mb-4 text-gray-300">
          Transaction Statistics for {month}
        </h2>
        <div className="text-base sm:text-lg text-gray-300">
          Total Sale Amount: <span className="font-bold text-blue-400">${statistics.totalSaleAmount.toFixed(2)}</span>
        </div>
        <div className="text-base sm:text-lg text-gray-300">
          Total Sold Items: <span className="font-bold text-blue-400">{statistics.totalSoldItems}</span>
        </div>
        <div className="text-base sm:text-lg text-gray-300">
          Total Not Sold Items: <span className="font-bold text-blue-400">{statistics.totalNotSoldItems}</span>
        </div>
      </div>

      <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-[#7878fc] via-[#a1a1ff] to-[#d1d1ff] text-2xl sm:text-4xl my-10 sm:my-14 text-center font-bold">
        Monthly Transactions Overview
      </h2>

     <div className=' overflow-x-auto'>
      <table className="min-w-full bg-gradient-to-b max-w-[90%] overflow-ellipsis lg:max-w-[1200px] mx-auto from-[#434343] to-[#000000] border border-solid border-neutral-600 shadow-md rounded-xl mb-8">
        <thead className="bg-[#232526]">
          <tr>
            <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">Title</th>
            <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">Description</th>
            <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">Price</th>
            <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">Category</th>
            <th className="py-3 px-4 border-b border-solid border-neutral-600 text-left font-semibold text-white">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length ? (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-700 transition duration-200">
                <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">{transaction.title}</td>
                <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">{transaction.description}</td>
                <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">${transaction.price.toFixed(2)}</td>
                <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">{transaction.category}</td>
                <td className="py-3 px-4 border-b border-solid border-neutral-600 text-gray-300">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-3 px-4 border-b border-solid border-neutral-600 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table></div>

      <div className="flex justify-between flex-col gap-7 sm:flex-row items-center max-w-[90%] lg:max-w-[1200px] mx-auto mb-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-300 text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <h2 className='bg-clip-text text-transparent tracking-normal bg-gradient-to-r from-[#7575ff] via-[#9a6fb0] to-[#7a4193] text-5xl my-14 text-center font-bold'>Monthly Transaction Price Range Analysis</h2>

      <div className="mb-10 max-w-[90%] lg:max-w-[1200px] mx-auto bg-gradient-to-b from-[#282828] to-[#000000] border border-solid border-neutral-600 shadow-md shadow-stone-800 p-6 rounded-lg">
  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
    Price Range Distribution for {month}
  </h2>
  <div className="relative h-48 sm:h-64 lg:h-96">
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false, // Ensure the chart scales with the container
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#E2E8F0', // Customize legend text color
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} items`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Price Range',
              color: '#E2E8F0',
            },
            ticks: {
              color: '#E2E8F0', // Customize x-axis label color
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Items',
              color: '#E2E8F0',
            },
            ticks: {
              color: '#E2E8F0', // Customize y-axis label color
            },
            beginAtZero: true,
          },
        },
      }}
    />
  </div>
</div>

      
    </div>
  );
};

export default TransactionTable;