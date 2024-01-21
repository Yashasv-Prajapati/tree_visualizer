import { NextRequest, NextResponse } from "next/server";
import * as z from 'zod';
import { get_nodes_from_db } from "../../utils/db_tree";
import { build_tree_from_db } from "@/actions/node";

const routeContextSchema = z.object({
    params: z.object({
      id: z.coerce.string(),
    }),
});



export default async function PUT(request: NextRequest, context: z.infer<typeof routeContextSchema>) {
    // make logs for the tree

    const rootId = context.params.id;
    const data = await request.json();
    const updatedTree = data.tree;


    if(updatedTree){
        // decide till what level you want the tree
        const rootNode = get_nodes_from_db(rootId);

        if (!rootNode) {
          console.log('Root node not found');
          return NextResponse.json({success:false, message:"Root node not found, could not update tree"}, {status: 404});
        }

        const oldTree =  build_tree_from_db(rootNode);

    }

}