import { db } from "@/lib/db";

export const get_nodes_from_db = async (rootId: string) : Promise<any | null> => {

    try{

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

        return rootNode;
    }catch(err){
        return null;
    }

}