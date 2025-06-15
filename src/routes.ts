import { Router } from "express";
import { prisma } from "./database";

const router = Router();

router.get('/', (req, res) => {
    async function main() {
  const users = await prisma.user.findMany();
  
  console.log(users);
}

main();
    res.json(prisma)
});

export { router };