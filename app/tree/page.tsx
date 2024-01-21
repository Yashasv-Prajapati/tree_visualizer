import React from 'react';
import Link from 'next/link';

import { db } from '@/lib/db';
import { buttonVariants } from '@/components/ui/button';
import TreeCard from '@/components/tree-card';
import Navbar from '@/components/nav';

export default async function Page() {
  const trees = await db.$transaction(async (db) => {
    const trees = await db.rootNode.findMany();
    return trees;
  });

  return (
    <div className='h-screen'>
    <Navbar href='/tree/new' ButtonName='Create New Tree'/>
      <div className='grid grid-cols-3 gap-4 mx-auto'>
          {trees.length > 0 ? (
            trees.map((data) => {
              return (
                <TreeCard treeId={data.id} key={data.id} />
              )
            })
          )
          :
          (
            <div className='flex justify-center items-center flex-col w-screen'>
            <p className='text-inter text-3xl font-semibold py-2 text-center'>No Trees Found</p>
            <Link href={'/tree/new'}
              className={buttonVariants({
                size: 'sm',
              })}
            >
              Create New Tree
            </Link>
            </div>
          )}
      </div>
    </div>
  );
}
