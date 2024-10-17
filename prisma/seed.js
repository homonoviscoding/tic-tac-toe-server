import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function mockUsers() {
  const saltRounds = 10

  const users = [
    {
      username: 'alice',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', saltRounds),
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      password: await bcrypt.hash('password456', saltRounds),
    },
    {
      username: 'charlie',
      email: 'charlie@example.com',
      password: await bcrypt.hash('password789', saltRounds),
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  // Create a sample game
  const alice = await prisma.user.findUnique({ where: { email: 'alice@example.com' } })
  const bob = await prisma.user.findUnique({ where: { email: 'bob@example.com' } })

  await prisma.game.create({
    data: {
      player1Id: alice.id,
      player2Id: bob.id,
      status: 'IN_PROGRESS',
      board: JSON.stringify([
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]),
    },
  })

  console.log('Seed data created successfully')
}

mockUsers()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

