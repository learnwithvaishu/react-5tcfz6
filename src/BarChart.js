import BarChart from 'echarts-for-react';
import React from 'react';

const BarCharts = ({ data, column }) => {
  console.log(data);
  return (
    <BarChart
      option={{
        xAxis: {
          type: 'category',
          data: data.map((x) => x['Date']),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: data.map((x) => x[column]),
            type: 'bar',
          },
        ],
      }}
    />
  );
};

export default BarCharts;
