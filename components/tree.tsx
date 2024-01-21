'use client'

import { CustomRawNodeDatum, CustomTreeNodeDatum } from '@/interfaces/tree';
import dynamic from 'next/dynamic';
import { FormEvent, useEffect, useState } from 'react';
import Sidebar from './sidebar';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Navbar from './nav';
import { CustomNode } from './ui/custom-node';
const Tree = dynamic(() => import('react-d3-tree'), {
    ssr: false
});

interface TreeStructureProps{
  id?:string;
}

export default function TreeStructure ({id}:TreeStructureProps){

    const [open, setOpen] = useState(false);
    const [tree_data, setTreeData] = useState<CustomRawNodeDatum | CustomRawNodeDatum[]>({
        name:'Root',
        creatorEmail:'yamuprajapati05@gmail.com',
        root:true,
        children:[]
    });
    const [newNodeName, setNewNodeName] = useState(''); // information about new node to be added
    const [node, setNode] = useState<undefined | CustomTreeNodeDatum>(undefined); // state variable for a tree node
    const [treeExists, setTreeExists] = useState(false); // state variable to check if tree exists or not
    const router = useRouter();

    useEffect(()=>{
      const getTree = async () => {
        if(!id){
          return;
        }
        try{
          const response = await fetch(`/api/tree/${id}`, {
            method:'get',
            headers:{
              'Content-Type':'application/json'
            }
          });
          const result = await response.json();

          if(result.success){
            setTreeData(result.tree);
            setTreeExists(true);
          }else{
            setTreeExists(false);
          }
          return;

        }catch(err){
          return;
        }
      }
      getTree();
    }, []);


    const AddNode = async (e:FormEvent<HTMLFormElement>) : Promise<void> => {
        /*
        Function to add a new node in the tree
        */

        e.preventDefault();
        try{

          const targetNodeName = node?.name;

          if(!targetNodeName || targetNodeName==='' || !newNodeName || newNodeName ==='' ){
            close();
            return;
          }

          const response = await fetch('/api/tree',{ // contact api and send the information to add new node
            method:'post',
            body:JSON.stringify({targetNodeName:node?.name, tree:tree_data, newNodeName: newNodeName}),
            headers:{
              'Content-Type':'application/json'
            }
          });
          const data = await response.json(); // get computation data back
          const success = data.success;

          if(success){ // if success, node was added in the tree, so update the tree
            const newTree = await data.newTree;
            setTreeData(newTree);
          }

          return;

        }catch(err){
          toast.error('Something went wrong, could not add node');
          return;
        }
    }

    const handleNodeClick = (
        /*
        Function to handle when a node is clicked
        setNode - sets the information of the clicked node in the state variable for later use
        setOpen - opens the sidebar for information/changes related to that node
        */
        {data}:{data: CustomTreeNodeDatum }
        ) => {

        setNode(data);
        setOpen(true);
    }

    const SaveTree = async () =>{
      console.log("saving tree")
      try{

        const res = await fetch(`/api/tree/save_tree`,{
          method:'post',
          body:JSON.stringify({tree:tree_data}),
          headers:{
            'Content-Type':'application/json'
          }
        });

        const data = await res.json();
        console.log(data);
        if(data.success){
          toast.success('Tree Saved Successfully');
          router.push('/tree')
          router.refresh();
        }
      }
      catch(err){
        toast.error('Something went wrong, could not save tree');
        return;
      }
    }

    const UpdateTree = async () =>{
      console.log("updating tree")
      try{

      // const treeUpdateNodeId = node?.id;
      const res = await fetch(`/api/tree/${id}`,{
        method:'put',
        body:JSON.stringify({tree:tree_data}),
        headers:{
          'Content-Type':'application/json'
        }
      });

      const data = await res.json();
      console.log(data);

      if(data.success){
        toast.success(data.message);
        router.refresh();
      }else{
        toast.warning(data.message);
      }

      }catch(err){
        toast.error('Something went wrong, could not update tree');
        return;
      }

    }

    const DeleteNode = async () =>{
      // return;
      if(!node?.id){
        toast.error('Something went wrong, could not get tree id to delete node');
        return;
      }

      try{

        const targetNodeId = node?.id;
        const response = await fetch(`/api/tree/${targetNodeId}`,{
          method:'delete',
          headers:{
            'Content-Type':'application/json'
          }
        });

        const data = await response.json();
        if(data.success){
          toast.success('Node Deleted Successfully');
          router.refresh();

        }

      }catch(err){
        toast.error('Something went wrong, could not delete node');
        return;
      }
    }

    return (

    <div
    className="mx-auto top-2 flex justify-center flex-col items-center h-screen" // Use mx-auto for horizontal centering
    >
      <div className='z-0 w-full h-full '>
        <Tree
            data={tree_data}
            zoomable={true}
            zoom={2}
            scaleExtent={{ min: 0.5, max: 5 }}
            draggable={true}
            collapsible={false}
            onNodeClick={handleNodeClick}
            orientation='vertical'
            renderCustomNodeElement={CustomNode}
            pathFunc={'diagonal'}
            />
      </div>


      <div className=''>
        {
          treeExists ?
          <Button className='w-screen' onClick={ UpdateTree }>  Update Tree </Button>
          :
          <Button className='w-screen' onClick={ SaveTree }>  Save Tree </Button>
        }
      </div>

      <Sidebar open={open} setOpen={setOpen} AddNode={AddNode} setNewNodeName={setNewNodeName} DeleteNode={DeleteNode}/>
    </div>
    )
}