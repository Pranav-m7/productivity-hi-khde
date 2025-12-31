import React, { useMemo } from 'react';
import { Sankey, Tooltip, Layer, Rectangle } from 'recharts';

const COLORS = {
  'Applied': '#58a6ff',
  'No Response': '#8b949e',
  'Response': '#a371f7',
  'Rejected': '#f85149',
  'Online Assessment': '#d29922',
  'Phone Screen': '#3fb950',
  'Technical Interview': '#58a6ff',
  'Behavioral Interview': '#a371f7',
  'Final Round': '#db61a2',
  'Offer Received': '#3fb950',
  'Offer Accepted': '#238636',
  'Offer Declined': '#d29922',
  'Withdrawn': '#8b949e',
};

function SankeyDiagram({ applications, onNodeClick }) {
  const data = useMemo(() => {
    if (applications.length === 0) {
      return { nodes: [], links: [] };
    }

    const statusCounts = {};
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const nodes = [];
    const nodeMap = {};
    let nodeIndex = 0;

    const addNode = (name) => {
      if (nodeMap[name] === undefined) {
        nodeMap[name] = nodeIndex++;
        nodes.push({ name });
      }
      return nodeMap[name];
    };

    addNode('Applications');
    
    const noResponse = statusCounts['No Response'] || 0;
    const applied = statusCounts['Applied'] || 0;
    const responded = applications.length - noResponse - applied;

    if (noResponse > 0 || applied > 0) addNode('No Response');
    if (responded > 0) addNode('Responded');
    
    const rejected = statusCounts['Rejected'] || 0;
    const oa = statusCounts['Online Assessment'] || 0;
    const phone = statusCounts['Phone Screen'] || 0;
    const tech = statusCounts['Technical Interview'] || 0;
    const behavioral = statusCounts['Behavioral Interview'] || 0;
    const final = statusCounts['Final Round'] || 0;
    const offerReceived = statusCounts['Offer Received'] || 0;
    const offerAccepted = statusCounts['Offer Accepted'] || 0;
    const offerDeclined = statusCounts['Offer Declined'] || 0;

    if (rejected > 0) addNode('Rejected');
    if (oa > 0) addNode('Online Assessment');
    if (phone > 0) addNode('Phone Screen');
    if (tech > 0) addNode('Technical Interview');
    if (behavioral > 0) addNode('Behavioral Interview');
    if (final > 0) addNode('Final Round');
    if (offerReceived > 0 || offerAccepted > 0 || offerDeclined > 0) addNode('Offers');
    if (offerAccepted > 0) addNode('Accepted');
    if (offerDeclined > 0) addNode('Declined');

    const links = [];

    if (noResponse > 0 || applied > 0) {
      links.push({ source: nodeMap['Applications'], target: nodeMap['No Response'], value: noResponse + applied });
    }
    if (responded > 0) {
      links.push({ source: nodeMap['Applications'], target: nodeMap['Responded'], value: responded });
    }

    if (rejected > 0 && nodeMap['Responded'] !== undefined) {
      links.push({ source: nodeMap['Responded'], target: nodeMap['Rejected'], value: rejected });
    }
    
    const interviewTotal = oa + phone + tech + behavioral + final + offerReceived + offerAccepted + offerDeclined;
    if (interviewTotal > 0 && nodeMap['Responded'] !== undefined) {
      if (oa > 0) links.push({ source: nodeMap['Responded'], target: nodeMap['Online Assessment'], value: oa });
      if (phone > 0) links.push({ source: nodeMap['Responded'], target: nodeMap['Phone Screen'], value: phone });
      if (tech > 0) links.push({ source: nodeMap['Responded'], target: nodeMap['Technical Interview'], value: tech });
      if (behavioral > 0) links.push({ source: nodeMap['Responded'], target: nodeMap['Behavioral Interview'], value: behavioral });
      if (final > 0) links.push({ source: nodeMap['Responded'], target: nodeMap['Final Round'], value: final });
    }

    const totalOffers = offerReceived + offerAccepted + offerDeclined;
    if (totalOffers > 0) {
      if (nodeMap['Final Round'] !== undefined) {
        links.push({ source: nodeMap['Final Round'], target: nodeMap['Offers'], value: totalOffers });
      } else if (nodeMap['Responded'] !== undefined) {
        links.push({ source: nodeMap['Responded'], target: nodeMap['Offers'], value: totalOffers });
      }
      
      if (offerAccepted > 0) {
        links.push({ source: nodeMap['Offers'], target: nodeMap['Accepted'], value: offerAccepted });
      }
      if (offerDeclined > 0) {
        links.push({ source: nodeMap['Offers'], target: nodeMap['Declined'], value: offerDeclined });
      }
    }

    return { nodes, links: links.filter(l => l.value > 0) };
  }, [applications]);

  if (applications.length === 0) {
    return (
      <div className="bg-[#161b22] border border-[#21262d] rounded-xl text-center py-12">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-[#c9d1d9] font-medium">Add job applications to see the flow diagram</p>
      </div>
    );
  }

  const CustomNode = ({ x, y, width, height, index, payload }) => {
    const name = payload.name;
    const color = COLORS[name] || '#58a6ff';
    
    return (
      <g>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          fillOpacity={0.9}
          rx={4}
          ry={4}
          className="cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => onNodeClick && onNodeClick(name)}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={11}
          fontWeight={500}
        >
          {name}
        </text>
      </g>
    );
  };

  const CustomLink = ({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth }) => {
    return (
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        fill="none"
        stroke="#30363d"
        strokeWidth={linkWidth}
        strokeOpacity={0.6}
        className="transition-opacity hover:stroke-opacity-100"
      />
    );
  };

  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-4">
      <h3 className="text-base font-semibold text-[#c9d1d9] mb-4">Application Flow</h3>
      <div className="overflow-x-auto">
        <Sankey
          width={800}
          height={280}
          data={data}
          node={<CustomNode />}
          link={<CustomLink />}
          nodePadding={30}
          nodeWidth={10}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-2 text-sm shadow-lg">
                    <p className="text-[#c9d1d9] font-medium">{data.name || `${data.source?.name} → ${data.target?.name}`}</p>
                    <p className="text-[#8b949e]">Count: {data.value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </Sankey>
      </div>
      <p className="text-xs text-[#484f58] mt-2">Click on a node to filter the table</p>
    </div>
  );
}

export default SankeyDiagram;
