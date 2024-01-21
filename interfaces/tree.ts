import Tree, { RawNodeDatum, SyntheticEventHandler, TreeNodeDatum, TreeNodeEventCallback } from "react-d3-tree";

export interface OrgChartNode {
    name: string;
    attributes?: {
        department?: string;
    };
    children?: OrgChartNode[];
}

export interface CustomNodeParams{
    nodeDatum: TreeNodeDatum;
    onNodeClick: SyntheticEventHandler;
    width?: number;
    height?:number;
    fillColor?:string;
    textColor?:string;
}

export interface PageProps {
    params: { treeId?: string };
}

export interface CustomRawNodeDatum extends RawNodeDatum{
    id?: string;
    root: boolean;
    creatorEmail: string;
    name: string;
    parentId?: string;
    children: CustomRawNodeDatum[];
}

export interface CustomTreeNodeDatum extends TreeNodeDatum{
    id?:string;
}