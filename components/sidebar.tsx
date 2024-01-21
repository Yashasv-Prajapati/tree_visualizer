import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Sidebar({open, setOpen, setNewNodeName, AddNode, DeleteNode}:any) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
        </SheetTrigger>
        <SheetContent>
          <form onSubmit={AddNode}>
            <SheetHeader>
              <SheetTitle>Add Frequency</SheetTitle>
              <SheetDescription>
                Make a new node, give it a name.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue="Root" className="col-span-3" onChange={(e)=>{setNewNodeName(e.target.value)}}/>
              </div>

            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
                <Button type="button" onClick={DeleteNode}>Delete</Button>
            </SheetFooter>
          </form>

        </SheetContent>
    </Sheet>

  )
}
