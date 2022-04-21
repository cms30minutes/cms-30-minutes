import React, { useEffect, useState, Fragment } from "react";
import {API_BASE} from "../../constants";
import { Chart } from "../common/chart/Chart";
import { Page } from "../common/page/Page";

const CMSComponentMap = {
  H1: createH1,
  H2: createH2,
  H3: createH3,
  Paragraph: createParagraph,
  Image: createImage,
  Chart: createChart,
  Spacer: createSpacer,
  Pre: createPre,
  Link: createLink,
};

export function CMSParserPage(props) {
  const { url } = props;
  const [cmsData, setCMSData] = useState([]);

  useEffect(() => {
    const fn = async () => {
      const res = await fetch(
        `${API_BASE}/${url}.json`
      );
      const data = await res.json();
      setCMSData(data);
    };
    fn();
  }, []);

  return (
    <Page>
      {cmsData.map((item, i) => (
        <Fragment key={i}>{parseCMSItem(item)}</Fragment>
      ))}
    </Page>
  );
}

function parseCMSItem(item) {
  return CMSComponentMap[item.Type](item);
}

function createH1(item) {
  return <h1 className="text-3xl my-4">{item.Content}</h1>;
}

function createH2(item) {
  return <h2 className="text-2xl my-3">{item.Content}</h2>;
}

function createH3(item) {
  return <h3 className="text-xl my-2">{item.Content}</h3>;
}

function createPre(item) {
  return (
    <pre className="font-mono my-2 p-3 border-2 border-color-slate-50 overflow-x-auto max-w-full">
      {item.Content}
    </pre>
  );
}

function createParagraph(item) {
  return <p className="my-2">{item.Content}</p>;
}

function createImage(item) {
  return <img className="my-2" src={item.Link} alt={item.Content} />;
}

function createLink(item) {
  return <div><a className="my-2 underline color-blue-500" href={item.Link}>{item.Content}</a></div>;
}

function createSpacer(item) {
  return <div className="w-full h-8" />;
}

function createChart(item) {
  return <Chart item={item} />;
}
