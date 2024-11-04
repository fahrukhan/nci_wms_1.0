import BarChart from "./BarChart";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface DonutChartState {
  series: number[];
  options: any;
  selectedLemari: string;
  detailedData: { [key: string]: { name: string; data: number[] }[] };
}

class DonutChart extends React.Component<{}, DonutChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [35, 25, 25, 15],
      options: {
        chart: {
          type: "donut" as const,
          events: {
            dataPointSelection: (
              event: any,
              chartContext: any,
              config: any
            ) => {
              const selectedLemari =
                config.w.config.labels[config.dataPointIndex];
              this.setState({ selectedLemari });
            },
          },
        },
        labels: ["Lemari A", "Lemari B", "Lemari C", "Lemari D"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: "gradient",
        },
        legend: {
          position: "right",
          offsetY: 0,
          height: 230,
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  formatter: () => "100 items",
                },
              },
            },
          },
        },
      },
      selectedLemari: "Lemari A",
      detailedData: {
        "Lemari A": [
          { name: "Barang A", data: [10, 20, 15, 25, 30, 35, 40] },
          { name: "Barang B", data: [20, 25, 30, 35, 40, 45, 50] },
        ],
        "Lemari B": [
          { name: "Barang A", data: [15, 25, 20, 30, 35, 40, 45] },
          { name: "Barang B", data: [25, 30, 35, 40, 45, 50, 55] },
        ],
        "Lemari C": [
          { name: "Barang A", data: [20, 30, 25, 35, 40, 45, 50] },
          { name: "Barang B", data: [30, 35, 40, 45, 50, 55, 60] },
        ],
        "Lemari D": [
          { name: "Barang A", data: [25, 35, 30, 40, 45, 50, 55] },
          { name: "Barang B", data: [35, 40, 45, 50, 55, 60, 65] },
        ],
      },
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleDropdownChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ selectedLemari: event.target.value });
  }

  render() {
    return (
      <div className="col-span-6 rounded-lg bg-white p-4 shadow-[5%] lg:col-span-5">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="donut"
          height={350}
        />
        <div className="mt-4">
          <label
            htmlFor="Lemari-select"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Select Lemari
          </label>
          <select
            id="Lemari-select"
            value={this.state.selectedLemari}
            onChange={this.handleDropdownChange}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Object.keys(this.state.detailedData).map((Lemari) => (
              <option key={Lemari} value={Lemari}>
                {Lemari}
              </option>
            ))}
          </select>
        </div>
        <BarChart
          Lemari={this.state.selectedLemari}
          data={this.state.detailedData[this.state.selectedLemari]}
        />
      </div>
    );
  }
}

export default DonutChart;
