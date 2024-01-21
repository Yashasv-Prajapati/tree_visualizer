import { NextRequest, NextResponse } from "next/server";
import * as z from 'zod';
import { build_tree_from_db, update_nodes, save_tree_in_db, create_logs_from_updates } from "@/actions/node";
import { db } from '@/lib/db';
import { get_nodes_from_db } from "../../utils/db_tree";

const routeContextSchema = z.object({
  params: z.object({
    id: z.coerce.string(),
  }),
});

export async function GET( // save tree in db
    request: NextRequest,
    context: z.infer<typeof routeContextSchema>
    ){

      const rootId = context.params.id;
      console.log("Root id ",rootId);

      try {
        const depth = 6;
        let includeObject: any = {
          include: {children: true}
        }

        let pointer = includeObject.include;
        for (let i = 0; i < depth - 1; i++) {
            pointer.children = {include: {children: true}};
            pointer = pointer.children.include;
        }

        // Find the root node
        const rootNode = await db.treeNode.findUnique({
          where: { id: rootId },
          include: includeObject.include,
        });

        if (!rootNode) {
          console.log('Root node not found');
          return NextResponse.json({success:false, message:"Root node not found"}, {status: 404});
        }

        const tree = build_tree_from_db(rootNode);

        return NextResponse.json({success:true,tree: tree, message:"Root node found"}, {status: 200});
      } catch (error) {
        console.error('Error fetching tree nodes:', error);
        return NextResponse.json({success:false, message:"Error fetching tree nodes"}, {status: 500});
      }
}

export async function DELETE(
  request: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  // function to delete a specific node from the tree

  const nodeToDeleteId = context.params.id;
  console.log(nodeToDeleteId);

  try{

    const deletedNode = await db.treeNode.delete({
      where: { id: nodeToDeleteId },
    });

    if(deletedNode.root){
      await db.rootNode.delete({
        where : { id: nodeToDeleteId },
      });
    }

    return NextResponse.json({success:true, message:"Node deleted"}, {status: 200});

  }catch(err){
    console.log(err);
    return NextResponse.json({success:false, message:"Error deleting node"}, {status: 500});
  }

}

export async function PUT(
  request: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  // function to update the name of a specific node from the tree

  const rootId = context.params.id;

  const data = await request.json();
  const updatedTree = data.tree;

  try{

    if(updatedTree){

      const rootNode = get_nodes_from_db(rootId); // get all the nodes from db till a certains depth using find() function in prisma

      if (!rootNode) {
        console.log('Root node not found');
        return NextResponse.json({success:false, message:"Root node not found, could not update tree"}, {status: 404});
      }

      const oldTree = build_tree_from_db(rootNode); // old tree
      await update_nodes(updatedTree, oldTree); // update the tree in db

      const logs_saved = await create_logs_from_updates(updatedTree, oldTree); // create logs for the newly created trees

      if(logs_saved){
        return NextResponse.json({success:true, message:"Tree updated successfully with logs"}, {status: 200})
      }

      return NextResponse.json({success:false, message:"Tree updated successfully but could not save logs"}, {status: 500})
    }

    return NextResponse.json({success:false, message:"Updated tree not found"}, {status: 404});
  }catch(err){
    console.log(err);
    return NextResponse.json({success:false, message:"Error updating node"}, {status: 500});
  }

}