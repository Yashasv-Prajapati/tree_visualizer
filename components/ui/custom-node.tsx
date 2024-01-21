import * as React from "react";
import { CustomNodeParams } from "@/interfaces/tree";

export const CustomNode = (
    {
      nodeDatum,onNodeClick,
      width = 100,
      height = 20,
      fillColor = 'lightblue',
      textColor = 'black'
    }:CustomNodeParams
    ):React.JSX.Element => {
      /*
        Function for returning a custom component for a node in the tree
      */
    const textProps = {
      x: 0,
      y: height / 2 + 5, // Adjust for better vertical centering
      textAnchor: 'middle',
      fill: textColor
    };
    const borderRadius = 8;

    return (
      <g onClick={onNodeClick} width={width} stroke="black" strokeWidth="1" >
        <rect width={width} transform={`translate(${-width/2}, ${0})`} height={height} fill={fillColor} rx={borderRadius} ry={borderRadius} className="p-4" />
        <text {...textProps} >{nodeDatum.name}</text>
      </g>
    );
};