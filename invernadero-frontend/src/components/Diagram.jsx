/**
 * @file Diagram.jsx
 * @description Componente que renderiza un diagrama ER usando React Flow y Dagre.
 */
import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import { getDiagram } from "../api/diagramApi";
import BaseTable from "./BaseTable";

const nodeTypes = { BaseTable: BaseTable };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 120 });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: node.width, height: node.height }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);
  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return { ...node, position: { x: pos.x - node.width / 2, y: pos.y - node.height / 2 } };
  });
};

const Diagram = () => {
  const [rawData, setRawData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    const fetchDiagram = async () => {
      const data = await getDiagram();
      setRawData(data);
    };
    fetchDiagram();
  }, []);

  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { nodes, edges } = useMemo(() => {
    const newNodes = rawData.map((entity) => {
      const expanded = expandedNodes[entity.entityName];
      return {
        id: entity.entityName,
        type: "BaseTable",
        data: { ...entity, expanded, toggleNode },
        position: { x: 0, y: 0 },
        width: 260,
        height: expanded ? entity.fields.length * 28 + 140 : 260,
      };
    });

    const newEdges = [];
    rawData.forEach((entity) => {
      entity.relations.forEach((rel, index) => {
        newEdges.push({
          id: `${entity.entityName}-${rel.targetEntity}-${index}`,
          source: entity.entityName,
          target: rel.targetEntity,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#7c3aed", strokeWidth: 2 },
        });
      });
    });

    const layouted = getLayoutedElements(newNodes, newEdges);
    return { nodes: layouted, edges: newEdges };
  }, [rawData, expandedNodes]);

  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
        border: "1px solid #e0e7ff",
        boxShadow: "0 8px 32px rgba(79,70,229,0.10)",
        position: "relative",
      }}
    >
      {/* Subtle header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          gap: 8,
        }}
      >
        {["#f87171", "#fbbf24", "#34d399"].map((color) => (
          <div
            key={color}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              opacity: 0.85,
            }}
          />
        ))}
        <span
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "0.75rem",
            fontWeight: 600,
            marginLeft: 8,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Diagrama ER
        </span>
      </div>

      <div style={{ paddingTop: 40, height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.3}
          maxZoom={1.5}
        >
          <MiniMap
            zoomable
            pannable
            style={{
              background: "#ede9fe",
              border: "1px solid #c4b5fd",
              borderRadius: 8,
            }}
            maskColor="rgba(79,70,229,0.08)"
            nodeColor="#7c3aed"
          />
          <Controls
            style={{
              background: "#fff",
              border: "1px solid #e0e7ff",
              borderRadius: 10,
              boxShadow: "0 2px 12px rgba(79,70,229,0.12)",
            }}
          />
          <Background
            gap={24}
            size={1}
            color="#c7d2fe"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default function DiagramWrapper() {
  return (
    <ReactFlowProvider>
      <Diagram />
    </ReactFlowProvider>
  );
}