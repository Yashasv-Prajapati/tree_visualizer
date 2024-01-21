import { NextRequest, NextResponse } from "next/server";
import { create_logs_from_updates, save_tree_in_db } from "@/actions/node";

/**
 * Saves the tree in the database in the form of nodes
 * @param {NextRequest} //savetreeindbrequest:NextRequest
 * @returns {NextResponse}
 */
export async function POST( // save tree in db
    request: NextRequest
    ){

    const data = await request.json();
    const {tree} = data;

    try{
        // using given tree, storing the tree nodes in db using tree traversal
        const updated_tree = await save_tree_in_db(tree);

        if(!updated_tree) return NextResponse.json({success:false, message:'Save Failed'}, {status: 500}); // if tree is not saved in db

        const success = await create_logs_from_updates(updated_tree); // create logs for the new tree
        
        if(success){
            return NextResponse.json({success:true, message:'Save Successful'}, {status: 200})
        }else{
            return NextResponse.json({success:false, message:'Tree saved successfully but could not save logs'}, {status: 500})
        }

    }catch(err){
        console.log(err)
        return NextResponse.json({success:false, message:'Save Failed'}, {status: 500})
    }

}
