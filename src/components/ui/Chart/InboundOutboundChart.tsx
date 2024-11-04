import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

import React from "react";
import ReactApexChart from "react-apexcharts";

interface ApexChartState {
  series: Array<{
    name: string;
    data: number[];
  }>;
  options: any;
  dateRange: DateValueType;

  allData: {
    inbound: number[];
    outbound: number[];
  };
}

class InboundOutboundChart extends React.Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "Inbound",
          data: [3000, 3200, 2800, 3300, 3500, 3600, 3400],
        },
        {
          name: "Outbound",
          data: [2800, 3000, 2500, 3100, 3300, 3400, 3200],
        },
      ],
      options: {
        chart: {
          type: "bar" as const,
          height: 350,
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        colors: ["#34D399", "#FBBF24"],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "35%",
            borderRadius: 10,
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
          max: 4000,
        },
        fill: {
          colors: ["#10B981", "#FBBF24"],
          opacity: 1,
        },
        tooltip: {
          enabled: true,
          theme: "dark",
          style: {
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
          },
          x: { show: false },
          y: {
            formatter: (val: number) => val.toLocaleString(),
          },
          marker: {
            show: false,
          },
          custom: ({
            series,
            seriesIndex,
            dataPointIndex,
          }: {
            series: number[][];
            seriesIndex: number;
            dataPointIndex: number;
          }) => {
            const val = series[seriesIndex][dataPointIndex];
            return (
              '<div class="custom-tooltip relative p-1 rounded bg-black text-white">' +
              "<span>" +
              val.toLocaleString() +
              "</span>" +
              '<span class="absolute inset-x-0 bottom-0 mx-auto mb-[-10px] h-2 w-2 rotate-45 rounded-sm bg-black"></span>' +
              "</div>"
            );
          },
        },
      },
      dateRange: {
        startDate: null,
        endDate: null,
      },
      allData: {
        inbound: [3000, 3200, 2800, 3300, 3500, 3600, 3400],
        outbound: [2800, 3000, 2500, 3100, 3300, 3400, 3200],
      },
    };
  }

  handleDateChange = (newValue: DateValueType) => {
    this.setState({ dateRange: newValue }, this.filterData);
  };

 
  filterData = () => {
    const { dateRange } = this.state;
    if (dateRange?.startDate && dateRange?.endDate) {
        // Lakukan filter data sesuai dateRange
      this.setState((prevState) => {
        const filteredInbound = prevState.allData.inbound.map(
          (value) => value * (Math.random() * (1.1 - 0.9) + 0.9)
        );
        const filteredOutbound = prevState.allData.outbound.map(
          (value) => value * (Math.random() * (1.1 - 0.9) + 0.9)
        );

        return {
          series: [
            { name: "Inbound", data: filteredInbound },
            { name: "Outbound", data: filteredOutbound },
          ],
        };
      });
    } else {
      this.setState((prevState) => ({
        series: [
          { name: "Inbound", data: prevState.allData.inbound },
          { name: "Outbound", data: prevState.allData.outbound },
        ],
      }));
    }
  };

  render() {
    return (
      <div className="col-span-6 rounded-lg bg-white p-4 shadow-[5%] lg:col-span-7">
        <div className="mb-4">
          <label
            htmlFor="date-range"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Select Date Range
          </label>
          <Datepicker
            inputClassName="rounded-[10px] w-full p-2 px-6 text-[12px] border border-[#07CDAA] border-1"
            primaryColor={"fuchsia"}
            value={this.state.dateRange}
            popoverDirection="down"
            onChange={this.handleDateChange}
            showShortcuts={true}
          />
        </div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}

export default InboundOutboundChart;
