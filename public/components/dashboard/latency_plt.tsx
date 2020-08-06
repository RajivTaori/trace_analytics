import { EuiHorizontalRule, EuiPanel, EuiSpacer, EuiText, EuiFlexGroup, EuiFlexItem, EuiButtonIcon } from '@elastic/eui';
import React from 'react';
import { PanelTitle } from '../common/helper_functions';
import { Plt } from '../common/plt';

export function LatencyPlt(props) {
  const layout = {
    xaxis: {
      range: [0, 25],
      showline: true,
      showgrid: false,
      tickmode: "linear",
      dtick: 6,
      color: '#899195'
    },
    yaxis: {
      title: {
        text: 'Hourly latency (ms)',
        font: {
          size: 12,
        }
      },
      // showline: true,
      gridcolor: '#d9d9d9',
      color: '#899195'
    },
    margin: {
      l: 50,
      r: 30,
      b: 30,
      t: 30,
      pad: 0,
    },
    height: 200,
    width: 400,
  }
  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiText size='s'>24-hour latency trend</EuiText>
          <EuiText size='s'>makePayment.auto</EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            iconType='cross'
            color='text'
            onClick={() => props.closePopover()}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <Plt data={props.data} layout={layout} />
    </>
  );
}
