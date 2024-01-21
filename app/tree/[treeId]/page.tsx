import { PageProps } from '@/interfaces/tree';
import TreeStructure from '@/components/tree';

async function getLogs(){
  const response = await fetch('/api/logs');
  const result = await response.json();
  console.log(result);
  return result;
}

export default function Page ({ params }:PageProps) {

  const id = params.treeId;

  console.log("in tree/[treeid] ", id);

  return (

    <TreeStructure id={params.treeId} />

  )

};
