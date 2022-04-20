import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart as ReactChartJS } from "react-chartjs-2";

export function Chart(props) {
  const { item } = props;

  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    fetch(
      `https://help-i-need-a-cms-in-ten-minutes.vercel.app/${item.Link}.json`,
    ).then(async (res) => {
      const data = await res.json();
      setDataset(data);
    });
  }, []);

  return dataset.length > 0 ? (
    <ReactChartJS
      type={item.Variant.toLowerCase()}
      data={{
        labels: dataset.map((x) => x.Label),
        datasets: [
          {
            id: 1,
            label: item.Content,
            data: dataset.map((x) => x.Value),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.9)",
          },
        ],
      }}
    />
  ) : null;
}
