import React from "react"
import Link from "next/link";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TreeCardProps{
    treeId: string;
};

export default function TreeCard({treeId}:TreeCardProps) {
  return (
    <Card className="w-[350px] p-2 m-2 hover:bg-slate-200">
      <CardHeader>
        <CardTitle>Hierarchy {treeId}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="destructive">Delete</Button>
        <Link href={`/tree/${treeId}`}><Button>Modify/View</Button></Link>
      </CardFooter>
    </Card>
  )
}
