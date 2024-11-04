import React from "react";
import ReactApexChart from "react-apexcharts";

interface ApexChartState {
  series: Array<{
    name: string;
    data: number[];
  }>;
  options: any;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  allData: {
    inbound: number[];
    outbound: number[];
  };
}

interface BarChartProps {
    Lemari: string;
    data: { name: string; data: number[] }[];
  }
  
const BarChart: React.FC<BarChartProps> = ({ Lemari, data }) => {
    const options = {
      chart: {
        type: "bar" as const,
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yaxis: {
        title: {
          text: "Quantity",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toLocaleString() + " items",
        },
      },
    };
  
    return (
      <div className="col-span-6 rounded-lg bg-white p-4 shadow-[5%] lg:col-span-3">
        <h3 className="mb-4 text-center text-xl font-semibold">
          {Lemari} Details
        </h3>
        <ReactApexChart options={options} series={data} type="bar" height={350} />
      </div>
    );
  };

  export default BarChart;