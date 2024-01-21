# Tree Visualizer

## Features
1. Visualize Tree Data Structure in a beautiful way.
2. The tree is stored in a SQLite database. Each node is stored individually with a parent id if it has a parent along with some other attributes.
3. Add
    - Add nodes anywhere in the tree by specifying a name to it.
4. Delete 
    - Delete nodes anywhere in the tree by clicking the node and selecting delete.
5. Update
    - Update nodes anywhere in the tree by clicking the node and selecting update.


## More technical details
1. How is the tree visualized?
    - The tree is visualized using a library called [react-d3-tree](https://www.npmjs.com/package/react-d3-tree)
    - The tree data structure has a certain schema defined in the library itself.
2. How are the nodes stored in the database?
    - Each node is stored individually with a parent id if it has a parent along with some other attributes. Start from the root and using any tree traversal(BFS in this case) store all the nodes in the database.
    - Look at the schema file for more information
3. How is the tree data structure created from the database?
    - The tree data structure is created by querying the database for the root upto a certain depth. Then those nodes are used to build the tree using recursive calls.
    - For more information look at build_tree_from_db function in the actions/node.ts file.
4. How is the tree data structure updated in the database?
    - The updated tree data structure and the old tree from database are both compared using any graph traversal(BFS in this case) and the changes are made accordingly.
    - For more information look at update_tree_in_db function in the actions/node.ts file.

## To-do

1. Minor bug fixes and improvements.
 - Error Page Styling for Error
 - Not Found Page Styling for invalid routes
2. Feature requests.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


### Installation
First install all the dependencies using 
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Setting up Prisma

#### Local Setup
In the .env file, set the DATABASE_URL to your database url. If you don't have a database url, you can set the DATABASE_URL to a local sqlite database, simply use this as your local database
```bash
DATABASE_URL="file:./dev.db"
```

Then run the following commands to setup the database
```bash
cd prisma
touch dev.db
cd ..
npx prisma db push 
```
Now your database should be in sync with the schema.

Once installed, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

