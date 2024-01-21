import { NextRequest, NextResponse } from 'next/server';
import { add_node } from '../../../actions/node'; // Import the function from your utility file
import { db } from '@/lib/db';

/**
 * POST function to add a node to the tree and return the new tree
 * @param {NextRequest} request:NextRequest
 * @returns {NextResponse}
 */
export async function POST(request: NextRequest) {
    try {

      const data = await request.json();
      const {targetNodeName, tree, newNodeName} = data;

      const newTree = add_node(targetNodeName, tree, newNodeName);

      return NextResponse.json({ success: true, newTree:newTree });
    } catch (error) {
      // console.error('Error updating hierarchy tree:', error);
      return NextResponse.json({ success: false, error: 'Internal Server Error' });
    }
}

/**
 * GET function to get all the root nodes of all the trees we have
 * @param {any} request:NextRequest
 * @returns {any}
 */
export async function GET(request: NextRequest) {
  // get all the root nodes all the trees we have
  const root_nodes = await db.rootNode.findMany();
  return NextResponse.json({ success: true, root_nodes:root_nodes }, {status: 200});
}
