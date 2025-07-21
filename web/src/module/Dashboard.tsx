import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faCreditCard,
  faBalanceScale,
  faFileInvoiceDollar,
  faBars,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import SalesTable from "../components/SalesTable";
import BarChartUI from "../components/BarChartUI";
import Chart from "../components/PieChart";


const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState({
    state: '',
    minDate: '',
    maxDate: '',
    fromDate: '',
    toDate: ''
  });
  const [data, setData] = useState({
    sales: 0,
    quantity: 0,
    discount: 0,
    profit: 0,
    salesByCity: [],
    salesByProduct: [],
    salesBySubCategory: [],
    salesBySegment: [],
    salesByCategory: []
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const loadState = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/states');
      setStates(data);
      if (data.length) {
        setInputValue({
          state: data[0],
          minDate: '',
          maxDate: '',
          fromDate: '',
          toDate: ''
        });
      }

    } catch (err) {
      setStates([]);
      console.log(err);
    }
  }

  const loadStartEndDates = async (state: string) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/date-range?state=${state}`);
      setInputValue(val => ({
        ...val,
        ...data
      }))
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (inputValue.state) loadStartEndDates(inputValue.state);
  }, [inputValue.state]);

  useEffect(() => {
    loadState();
  }, []);

  const loadDashboardData = async (state: string, fromDate: string, toDate: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`http://localhost:4000/dashboard-data`, { state, fromDate, toDate });
      setData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (inputValue.state) loadDashboardData(inputValue.state, inputValue.fromDate, inputValue.toDate);
  }, [inputValue.state, inputValue.fromDate, inputValue.toDate]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setInputValue(val => ({ ...val, [name]: value }));
  }

  const themeBg = darkMode ? "bg-dark" : "bg-light";
  const themeText = darkMode ? "text-white" : "text-dark";
  const cardClass = `card ${themeBg} ${themeText} p-3`;

  return (
    <div
      className="d-flex flex-column bg-dark"
      style={{
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        className={`d-flex justify-content-between align-items-center p-3 border-bottom border-secondary`}
      >
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faBars} className="me-3" />
          <h4 className="mb-0">Sales Dashboard</h4>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-2">Hello User</span>
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
      </div>

      {/* Body */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`p-3 border-right border-secondary sidebar`}
          style={{ width: "250px" }}
        >
          <ul className="nav flex-column">
            <li className="nav-item mb-3">Sales Overview</li>
            <li className="nav-item mb-3">Stores</li>
            <li className="nav-item mb-3">Notifications</li>
            <li className="nav-item mb-3">Settings</li>
            <li className="nav-item" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </li>
          </ul>
        </div>

        <div className="flex-grow-1 p-4" style={{
          backgroundColor: darkMode ? "#212121" : "#f8f9fa",
          color: darkMode ? "#fff" : "#000",
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Sales Overview</h3>
            <div className="d-flex gap-2 align-items-end">
              <div>
                <label htmlFor="state" className="form-label">
                  Select a state
                </label>
                <select
                  name="state"
                  className={`form-select ${themeBg} ${themeText}`}
                  value={inputValue.state}
                  onChange={handleChange}
                >
                  {states.map(item => <option value={item} key={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="fromDate" className="form-label">
                  Select From date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  className={`form-control ${themeBg} ${themeText}`}
                  onChange={handleChange}
                  value={inputValue.fromDate}
                  min={inputValue.minDate}
                  max={inputValue.maxDate}
                />
              </div>
              <div>
                <label htmlFor="toDate" className="form-label">
                  Select To date
                </label>
                <input
                  type="date"
                  name="toDate"
                  className={`form-control ${themeBg} ${themeText}`}
                  onChange={handleChange}
                  value={inputValue.toDate}
                  min={inputValue.fromDate ? inputValue.fromDate : inputValue.minDate}
                  max={inputValue.maxDate}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="row" style={{height: '800px'}}>
              <div className="col-md-12 pt-5 text-center">
                Loading...
              </div>
            </div>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className={`d-flex flex-row align-items-center gap-3 ${cardClass}`}>
                    <FontAwesomeIcon icon={faIndianRupeeSign} size="2x" />
                    <div>
                      <h6 className="mb-1">Total Sales</h6>
                      <h4 className="mb-0">${Math.round(data.sales)}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className={`d-flex flex-row align-items-center gap-3 ${cardClass}`}>
                    <FontAwesomeIcon icon={faCreditCard} size="2x" />
                    <div>
                      <h6 className="mb-1">Quantity Sold</h6>
                      <h4 className="mb-0">{Math.round(data.quantity)}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className={`d-flex flex-row align-items-center gap-3 ${cardClass}`}>
                    <FontAwesomeIcon icon={faBalanceScale} size="2x" />
                    <div>
                      <h6 className="mb-1">Discount%</h6>
                      <h4 className="mb-0">{Math.round(data.discount)}%</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className={`d-flex flex-row align-items-center gap-3 ${cardClass}`}>
                    <FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />
                    <div>
                      <h6 className="mb-1">Profit</h6>
                      <h4 className="mb-0">${Math.round(data.profit)}</h4>
                    </div>
                  </div>
                </div>
              </div>


              <div className="row mb-4">
                <div className="col-md-6">
                  <div className={cardClass}>
                    <h5>Sales by City</h5>
                    <BarChartUI data={data.salesByCity} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className={cardClass}>
                    <h5>Sales by Products</h5>
                    <SalesTable data={data.salesByProduct} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className={cardClass}>
                    <h5>Sales by Category</h5>
                    <Chart data={data.salesByCategory} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={cardClass}>
                    <h5>Sales by Sub Category</h5>
                    <SalesTable data={data.salesBySubCategory} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={cardClass}>
                    <h5>Sales by Segment</h5>
                    <Chart data={data.salesBySegment} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
