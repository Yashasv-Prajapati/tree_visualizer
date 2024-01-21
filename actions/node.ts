import { CustomRawNodeDatum } from '@/interfaces/tree';
import { db } from '@/lib/db';

/**
 * Adds a node to the tree structure at the specified location
 * ! nothing to do with the database, only adds node to the tree structure
 * @param {string} currNodeName:string
 * @param {CustomRawNodeDatum|CustomRawNodeDatum[]} tree:CustomRawNodeDatum|CustomRawNodeDatum[]
 * @param {string} newNodeName:string
 * @returns {CustomRawNodeDatum|CustomRawNodeDatum[]}
 */
export const add_node = (currNodeName:string, tree:CustomRawNodeDatum|CustomRawNodeDatum[], newNodeName:string) => {
    const queue = Array<CustomRawNodeDatum>();

    queue.unshift(tree as CustomRawNodeDatum);
    while(queue.length){
      const currNode = queue.pop();
      if(currNode?.name === currNodeName){ // check if it the right node to add child to

        if(currNode?.children?.some(child => child.name === newNodeName)){ // if the exact same node already exists
          console.log("Node already exists")
          return {...tree};
        }else{
          currNode?.children?.push({ // else insert a new node
            name:newNodeName,
            creatorEmail:"test",
            parentId:"",
            root:false,
            children:[]
          });
        }

        return {...tree}; // return the tree by appending the child to it.

      }

      const currNodeLen = currNode?.children?.length ? currNode.children.length : 0;

      for(let i=0;i<currNodeLen;i++){
        if(currNode && currNode.children){
          queue.unshift(currNode?.children[i]);
        }
      }
    }

}


/**
 * Save the tree in the database in the form of nodes using tree traversal(bfs)
 * @param {CustomRawNodeDatum} root_node:CustomRawNodeDatum
 * @returns {CustomRawNodeDatum | null}
 */
export async function save_tree_in_db(root_node:CustomRawNodeDatum): Promise<CustomRawNodeDatum | null>{

  try {

      const root = await db.treeNode.create({ // add root to db in TreeNode
          data:{
              name:root_node.name,
              creatorEmail:root_node.creatorEmail,
              root: root_node.root
          }
      });

      // now save this root id in RootNode table for future use
      const root_node_db = await db.rootNode.create({
          data:{
              id: root.id,
              creatorEmail: root_node.creatorEmail,
              name: root_node.name
          }
      });

      // continue with bfs to add all the nodes in db in TreeNode table

      let parent_id = root.id; // get root id and set it to curr_parent id
      root_node.id = root.id; // set id of root node to id of node in db

      const queue = Array<CustomRawNodeDatum>(); // queue for bfs
      queue.unshift(root_node); // add root to queue

      while(queue.length){ // bfs to traverse the tree and add nodes to db
          const curr_node = queue.pop(); // get a node

          if(!curr_node) return null;

          parent_id = curr_node.id as string; // set id of current node as parent id for next iteration


          for(let i=0;i<curr_node.children.length;i++){ // add all the children of node in db
              const child_node = curr_node.children[i];

              const node_db = await db.treeNode.create({ // save node in db
                  data:{
                      name:child_node.name,
                      creatorEmail:child_node.creatorEmail,
                      root: child_node.root,
                      parentId: parent_id
                  }
              });

              child_node.id = node_db.id; // set id of node to id of node in db

              queue.unshift(child_node); // add child to queue for further bfs
          }

      }

      return root_node;
  }catch(err){
      console.log(err);
      return null;
  }
}

/**
 * Builds the tree from the database using recursive calls, recursively builds subtree and returns to the parent to build the tree.
 *
 * @param {any} root_node:any
 * @returns {any}
 */
export function build_tree_from_db(root_node: any){

  const new_node = {
    id: root_node.id,
    name:root_node.name,
    creatorEmail:root_node.creatorEmail,
    root:root_node.root,
    children: Array<any>()
  };

  for(let i=0 ;i<root_node?.children.length;i++){
    const child_node = root_node.children[i];
    new_node.children.push( build_tree_from_db(child_node) );
  }

  return new_node;

}


/**
 * Updates the nodes in the database using bfs traversal comparison,
 * compares the old tree from db with the updated tree from request and updates the nodes in db
 * @param {any} updated_tree:any
 * @param {any} old_tree_from_db:any
 * @returns {any}
 */
export async function update_nodes(updated_tree:any, old_tree_from_db:any ){


  for(let i =0;i<updated_tree.children.length;i++){
    if(!old_tree_from_db.children[i]) {
      // tree does not exist in db, so we have to add it
      // add node to db
      const new_node = await db.treeNode.create({ // parent is the updated_tree
        data:{
          name:updated_tree.children[i].name,
          creatorEmail:updated_tree.children[i].creatorEmail,
          root: updated_tree.children[i].root,
          parentId: updated_tree.id
        }
      });

      updated_tree.children[i].id = new_node.id; // set id of updated tree node to id of node in db

      // also add this to old_tree_structure so that we can compare it with updated_tree_structure for further children
      // it may be the case that there are new children added to the new children, so we have to also compare with children added
      // in new tree.
      // ** basically new children of new children **

      old_tree_from_db.children.push(updated_tree.children[i]);
    }

    update_nodes(updated_tree.children[i], old_tree_from_db.children[i]);
  }


  return;
}

/** Creates logs for the nodes that are created in the tree,
 * 1. If there is no old tree, then create logs for all the nodes in updated_tree
 *  ! nodeId is the id of the created node from database, so when calling this function without old_tree_from_db,
 *  make sure that the updated_tree is the tree from database because the brand new tree won't have any id's
 *
 * 2. Else compare the two trees and create logs for the new nodes that are created
 *
 * @param {CustomRawNodeDatum} updated_tree:CustomRawNodeDatum
 * @param {CustomRawNodeDatum | null} old_tree_from_db:CustomRawNodeDatum | null
 * @returns {boolean}
 */
export async function create_logs_from_updates(updated_tree:CustomRawNodeDatum, old_tree_from_db:CustomRawNodeDatum | null = null ){
  function get_message(node_name:string, creater_name:string){
    return `Node with name ${node_name} created by user ${creater_name}`;
  }

  try {

    // if there is no old tree, then create logs for all the nodes in updated_tree
    if(!old_tree_from_db){
      for(let i=0;i<updated_tree.children.length;i++){
        await db.logs.create({
          data:{
            nodeId: updated_tree.children[i].id,
            message: get_message(updated_tree.children[i].name, updated_tree.children[i].creatorEmail),
            type: "created"
          }
        });
      }
      return true;
    }else{



    // else compare the two trees and create logs for the nodes that are created
    for(let i=0;i<updated_tree.children.length;i++){
      if(!old_tree_from_db.children[i]){
        // create logs for this node
        await db.logs.create({
          data:{
            nodeId: updated_tree.children[i].id,
            message: get_message(updated_tree.children[i].name, updated_tree.children[i].creatorEmail),
            type: "created"
          }
        });
      }
    }
    return true;
  }
  }catch(err){
    return false;
  }
}
