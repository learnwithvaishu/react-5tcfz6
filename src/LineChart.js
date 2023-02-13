import LineChart from 'echarts-for-react';

const LineCharts = ({data, column}) => {

    return (
        <LineChart
        option={{
          xAxis: {
            type: 'category',
            data: data.map(x => x["Unix Timestamp"])
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: data.map(x => x[column]),
              type: 'line'
            }
          ]
        }}
      />
    )
}

export default LineCharts;