import {
  EuiButtonGroup,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import React, { useState } from 'react';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import { getServiceMapData } from '../../data/service_map_data';
import { PanelTitle } from '../common';
import { Plt } from '../common/plt';

const renderServiceMap = (serviceMapData) => {
  return (
    <Graph
      graph={serviceMapData.graph}
      options={serviceMapData.options}
      events={serviceMapData.events}
      getNetwork={(network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );
};

const renderServiceMapScale = (scaleData) => {
  const layout = _.merge(
    {
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      xaxis: {
        range: [-0.35, 0.35],
        fixedrange: true,
        showgrid: false,
        showline: false,
        zeroline: false,
        showticklabels: false,
      },
      yaxis: {
        side: 'right',
        fixedrange: true,
        showgrid: false,
        showline: false,
        zeroline: false,
        showticklabels: true,
      },
      margin: {
        l: 0,
        r: 45,
        b: 10,
        t: 10,
        pad: 0,
      },
      height: 400,
      width: 65,
    },
    scaleData.layout
  ) as Partial<Plotly.Layout>;

  const data = [
    {
      x: [0, 0, 0, 0, 0],
      type: 'bar',
      orientation: 'v',
      width: 0.4,
      hoverinfo: 'none',
      showlegend: false,
      ...scaleData.data,
    },
  ];

  return (
    <div>
      <Plt data={data} layout={layout} />
    </div>
  );
};

export function ServiceMap() {
  const toggleButtons = [
    {
      id: 'latency',
      label: 'Latency',
    },
    {
      id: 'error_rate',
      label: 'Error rate',
    },
    {
      id: 'throughput',
      label: 'Throughput',
    },
  ];

  const [idSelected, setIdSelected] = useState<string>('latency');

  const scaleData = {
    [toggleButtons[0].id]: {
      data: {
        y: [20, 20, 20, 20, 20],
        marker: {
          color: ['#dad6e3', '#c7b2f1', '#987dcb', '#6448a0', '#330a5f'],
        },
      },
      layout: {
        yaxis: {
          range: [0, 100],
          title: {
            text: 'Latency (ms)',
          },
        },
      },
    },
    [toggleButtons[1].id]: {
      data: {
        y: [5, 5, 5, 5, 5],
        marker: {
          color: ['#efe0e6', '#f19ebb', '#ec6592', '#be3c64', '#7a1e39'],
        },
      },
      layout: {
        yaxis: {
          range: [0, 25],
          ticksuffix: '%',
          title: {
            text: 'Error rate',
          },
        },
      },
    },
    [toggleButtons[2].id]: {
      data: {
        y: [100, 100, 100, 100, 100],
        marker: {
          color: ['#d6d7d7', '#deecf7', '#abd3f0', '#5f9fd4', '#1f4e78'],
        },
      },
      layout: {
        yaxis: {
          range: [0, 500],
          title: {
            text: 'Throughput',
          },
        },
      },
    },
  };

  const serviceMapData = getServiceMapData(scaleData[idSelected].data.marker.color);

  return (
    <>
      <EuiPanel>
        <PanelTitle title="Service map" />
        <EuiSpacer size="m" />
        <EuiButtonGroup
          options={toggleButtons}
          idSelected={idSelected}
          onChange={(id) => setIdSelected(id)}
          buttonSize="s"
          color="text"
        />
        <EuiHorizontalRule margin="m" />
        <EuiFlexGroup alignItems="center" gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiText>Zoom in to</EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFieldSearch placeholder="Service name" value={''} onChange={() => {}} />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer />

        <EuiFlexGroup gutterSize="none" responsive={false}>
          <EuiFlexItem>{renderServiceMap(serviceMapData)}</EuiFlexItem>
          <EuiFlexItem grow={false}>{renderServiceMapScale(scaleData[idSelected])}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    </>
  );
}
