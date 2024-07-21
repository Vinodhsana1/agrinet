import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const socket = io('http://localhost:5000');

function App() {
  const [soilType, setSoilType] = useState('');
  const [irrigationMethod, setIrrigationMethod] = useState('');
  const [seedType, setSeedType] = useState('');
  const [fertilizerUsed, setFertilizerUsed] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchData();
    socket.on('newData', (newData) => {
      setData((prevData) => [...prevData, newData]);
    });
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = { soilType, irrigationMethod, seedType, fertilizerUsed };
    try {
      await axios.post('http://localhost:5000/api/data', newData);
      setAlert({ type: 'success', message: 'Data submitted successfully' });
      setSoilType('');
      setIrrigationMethod('');
      setSeedType('');
      setFertilizerUsed('');
    } catch (error) {
      setAlert({ type: 'error', message: 'Error submitting data' });
      console.error('Error submitting data:', error);
    }
  };

  const lineChartData = {
    labels: data.map(item => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Soil Type',
        data: data.map(item => item.soilType),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Irrigation Method',
        data: data.map(item => item.irrigationMethod),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Seed Type',
        data: data.map(item => item.seedType),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Fertilizer Used',
        data: data.map(item => item.fertilizerUsed),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  const barChartData = {
    labels: data.map(item => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Soil Type',
        data: data.map(item => item.soilType),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Irrigation Method',
        data: data.map(item => item.irrigationMethod),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Seed Type',
        data: data.map(item => item.seedType),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
      {
        label: 'Fertilizer Used',
        data: data.map(item => item.fertilizerUsed),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Soil Type', 'Irrigation Method', 'Seed Type', 'Fertilizer Used'],
    datasets: [
      {
        data: [
          data.filter(item => item.soilType).length,
          data.filter(item => item.irrigationMethod).length,
          data.filter(item => item.seedType).length,
          data.filter(item => item.fertilizerUsed).length,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Agricultural Data Visualizations',
      },
    },
  };

  return (
    <div className="App container mt-5">
      <div className="content-wrapper">
        <h1 className="mb-4">Agricultural Data Collection and Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="form-group mb-3">
            <label htmlFor="soilType">Soil Type</label>
            <input 
              type="text" 
              className="form-control" 
              id="soilType" 
              value={soilType} 
              onChange={(e) => setSoilType(e.target.value)} 
              placeholder="e.g., Clay, Sandy, Loam" 
              required 
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="irrigationMethod">Irrigation Method</label>
            <input 
              type="text" 
              className="form-control" 
              id="irrigationMethod" 
              value={irrigationMethod} 
              onChange={(e) => setIrrigationMethod(e.target.value)} 
              placeholder="e.g., Drip, Sprinkler, Surface" 
              required 
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="seedType">Seed Type</label>
            <input 
              type="text" 
              className="form-control" 
              id="seedType" 
              value={seedType} 
              onChange={(e) => setSeedType(e.target.value)} 
              placeholder="e.g., Hybrid, GMO, Heirloom" 
              required 
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="fertilizerUsed">Fertilizer Used</label>
            <input 
              type="text" 
              className="form-control" 
              id="fertilizerUsed" 
              value={fertilizerUsed} 
              onChange={(e) => setFertilizerUsed(e.target.value)} 
              placeholder="e.g., Organic, Inorganic, Compost" 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

        {alert.message && (
          <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
            {alert.message}
          </div>
        )}

        <div className="dashboard">
          <h2>Dashboard</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="chart-container mb-5">
                <Line data={lineChartData} options={chartOptions} />
              </div>
              <div className="chart-container mb-5">
                <Bar data={barChartData} options={chartOptions} />
              </div>
              <div className="chart-container mb-5">
                <Pie data={pieChartData} options={chartOptions} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
