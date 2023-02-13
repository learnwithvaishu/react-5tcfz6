import React, { useEffect, useState } from 'react';
import LineCharts from './LineChart';
import BarCharts from './BarChart';
import LoadingSpinner from './LoadingSpinner';

const options = [
  { value: 'Open', label: 'Open' },
  { value: 'Low', label: 'Low' },
  { value: 'High', label: 'High' },
  { value: 'Close', label: 'Close' },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthYear(date) {
  var dt = new Date(date);
  return (months[dt.getMonth()] + "-" + dt.getFullYear().toString().slice(-2));
}

function groupBy(xs, f) {
  return xs.reduce((r, v, i, a, k = f(v)) => {
    (r[k] || (r[k] = [])).push(v);
    return r;
  }, {});
}

function App() {

  const [column, setColumn] = useState("Open");
  const [data, setData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [isLoading, setIsLoading] = useState(false);

  
  const load = function () {
    setIsLoading(true);
    setColumn("Open");
    fetch("./gemini_BTCUSD_2020_1min.csv")
      .then(response => response.text())
      .then(responseText => {
        csvToObjs(responseText);
      })
  };

  useEffect(load, []);

  const handleChartType = (type) => {
    document.getElementById("bar").classList.remove('active-tab');
    document.getElementById("line").classList.add('active-tab');
    setChartType(type);
    if (type === "bar"){
      processBarData();
      document.getElementById("line").classList.remove('active-tab');
      document.getElementById("bar").classList.add('active-tab');
    }
  }

  const processBarData = () => {

    let chartData = [];
    data.forEach(d => {
      if (d["Unix Timestamp"]) {
        chartData.push({
          month: getMonthYear(d.Date),
          open: d.Open,
          high: d.High,
          low: d.Low,
          close: d.Close
        })
      }
    })
    chartData = groupBy(chartData, (c) => c.month);
    let chartInput = [];
    for (var key in chartData) {
      let openSum = 0;
      let lowSum = 0;
      let highSum = 0;
      let closeSum = 0;
      var len = chartData[key].length;
      chartData[key].forEach(item => {
        openSum = openSum + Number(item.open);
        lowSum = lowSum + Number(item.low);
        highSum = highSum + Number(item.high);
        closeSum = openSum + Number(item.close);
      });
      let openAvg = openSum / len;
      let lowAvg = lowSum / len;
      let highAvg = highSum / len;
      let closeAvg = closeSum / len;
      chartInput.push({
        Date: key,
        Open: openAvg,
        Low: lowAvg,
        High: highAvg,
        Close: closeAvg
      })
    }

    setBarData(chartInput);
  }

  const handleColumnChange = ({ target }) => {
    setColumn(target.value)
  }

  function csvToObjs(string) {
    const lines = string.split(/\r\n|\n/);
    let [headings, ...entries] = lines;
    headings = headings.split(',');
    const objs = [];
    entries.map(entry => {
      let obj = entry.split(',');
      objs.push(Object.fromEntries(headings.map((head, i) => [head, obj[i]])));
      return objs;
    })
    setData(objs);
    setIsLoading(false);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Time Series Data</h1>
      <hr></hr>
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '3%' }}>
        <button onClick={load} disabled={isLoading}>Load Data</button>
      </div> */}
      {isLoading ? <LoadingSpinner /> : 
      data.length > 0 ? (
        <div>
          <div style={{ display: 'flex', paddingBottom: '1rem', justifyContent: 'space-between' }}>
            <select style={{ padding: '5px 20px' }}
              value={column}
              onChange={handleColumnChange}
            >
              {options.map(({ value, label }, index) => <option key={value}
                value={value} >{label}</option>)}
            </select>

            <div>
              <button id="line" className='active-tab' onClick={() => handleChartType("line")}
                style={{ padding: '6px 40px', border: '0' }}>Line</button>
              <button id="bar" onClick={() => handleChartType("bar")} style={{ padding: '6px 40px', border: '0' }}>Bar</button>
            </div>
          </div>
          <div style={{ border: '0.625px solid #d0d0d0' }}>
            {chartType === "line" ? <LineCharts data={data} column={column} /> :
              <BarCharts data={barData} column={column} />}
          </div>
        </div>
      ) : (<div>No data to display</div>)}
    </div>
  );
}

export default App;