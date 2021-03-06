import { EuiFlexGroup, EuiFlexItem, EuiText, EuiToolTip } from '@elastic/eui';
import React, { useState } from 'react';
import { Plt } from '../common/plt';

interface PlotParamsType {
  min: number;
  max: number;
  left: number;
  mid: number;
  right: number;
  addFilter: (condition: 'gte' | 'lte') => void;
}

export function BoxPlt({ plotParams }: { plotParams: PlotParamsType }) {
  const [hovered, setHovered] = useState('');

  const layout = {
    // plot_bgcolor: '#fafafa',
    // paper_bgcolor: '#fafafa',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    xaxis: {
      range: [plotParams.min, plotParams.max],
      fixedrange: true,
      showgrid: false,
      visible: false,
    },
    yaxis: {
      range: [-0.6, 0.6],
      fixedrange: true,
      showgrid: false,
      visible: false,
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0,
    },
    height: 15,
    width: 200,
  };
  const data = [
    {
      x: [plotParams.left],
      y: [0],
      type: 'bar',
      orientation: 'h',
      width: 1,
      marker: { color: 'rgba(0, 0, 0, 0)' },
      hoverinfo: 'none',
      showlegend: false,
    },
    {
      x: [plotParams.mid - plotParams.left],
      y: [0],
      type: 'bar',
      orientation: 'h',
      width: 1,
      marker: {
        color: '#ffffff',
        line: {
          color: hovered === 'lower' ? '#2e73b5' : '#957ac9',
          width: hovered === 'lower' ? 3 : 1,
        },
      },
    },
    {
      x: [plotParams.right - plotParams.mid],
      y: [0],
      type: 'bar',
      orientation: 'h',
      width: 1,
      marker: {
        color: '#957ac9',
        line: {
          color: hovered === 'upper' ? '#2e73b5' : '#957ac9',
          width: hovered === 'upper' ? 3 : 1,
        },
      },
    },
  ];

  const renderTooltip = () => {
    return (
      <EuiFlexGroup gutterSize="s" responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="column" gutterSize="xs" responsive={false}>
            <EuiFlexItem>
              <EuiText size="xs" style={{ color: hovered === 'lower' ? '#ffffff' : '#c9cbce' }}>
                <p style={{ whiteSpace: 'nowrap' }}>Latency &lt;95 percentile</p>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs" style={{ color: hovered === 'upper' ? '#ffffff' : '#c9cbce' }}>
                <p style={{ whiteSpace: 'nowrap' }}>Latency &gt;=95 percentile</p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="column" gutterSize="xs" responsive={false}>
            <EuiFlexItem>
              <EuiText size="xs" style={{ color: hovered === 'lower' ? '#ffffff' : '#c9cbce' }}>
                <p
                  style={{ whiteSpace: 'nowrap' }}
                >{`${plotParams.left}ms - ${plotParams.mid}ms`}</p>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs" style={{ color: hovered === 'upper' ? '#ffffff' : '#c9cbce' }}>
                <p
                  style={{ whiteSpace: 'nowrap' }}
                >{`${plotParams.mid}ms - ${plotParams.right}ms`}</p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  const onHoverHandler = (e) => {
    const mouseX = e.xvals[0];
    if (plotParams.left <= mouseX && mouseX <= plotParams.mid) setHovered('lower');
    else if (plotParams.mid <= mouseX && mouseX <= plotParams.right) setHovered('upper');
    else setHovered('');
  };

  const onClickHandler = (e) => {
    if (e.points[0].fullData.index === 1)
      plotParams.addFilter('lte');
    else if (e.points[0].fullData.index === 2)
      plotParams.addFilter('gte');
  };

  return (
    <EuiToolTip content={renderTooltip()} position="bottom" onMouseOut={() => setHovered('')}>
      <Plt
        data={data}
        layout={layout}
        onHoverHandler={onHoverHandler}
        onClickHandler={onClickHandler}
      />
    </EuiToolTip>
  );
}
