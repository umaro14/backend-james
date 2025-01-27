const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    // ==========================================
    // CREATE
    // ==========================================
    const newUser = await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
      },
    });
    console.log('Created User:', newUser);

    // ==========================================
    // READ
    // ==========================================
    // Find a single user by ID
    const userById = await prisma.user.findUnique({
      where: { id: 1 },
    });
    console.log('User by ID:', userById);

    // Find multiple users with filters
    const users = await prisma.user.findMany({
      where: { name: { contains: 'A' } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    console.log('Users:', users);

    // ==========================================
    // UPDATE
    // ==========================================
    // Update a single user
    const updatedUser = await prisma.user.update({
      where: { id: 1 },
      data: { name: 'Alice Updated' },
    });
    console.log('Updated User:', updatedUser);

    // Update multiple users
    const updatedUsers = await prisma.user.updateMany({
      where: { role: 'USER' },
      data: { role: 'ADMIN' },
    });
    console.log('Updated Users:', updatedUsers);

    // ==========================================
    // DELETE
    // ==========================================
    // Delete a single user
    const deletedUser = await prisma.user.delete({
      where: { id: 1 },
    });
    console.log('Deleted User:', deletedUser);

    // Delete multiple users
    const deletedUsers = await prisma.user.deleteMany({
      where: { role: 'INACTIVE' },
    });
    console.log('Deleted Users:', deletedUsers);

    // ==========================================
    // ADVANCED QUERYING
    // ==========================================
    // Filtering with conditions
    const filteredUsers = await prisma.user.findMany({
      where: {
        AND: [
          { email: { endsWith: '@example.com' } },
          { createdAt: { gte: new Date('2022-01-01') } },
        ],
      },
    });
    console.log('Filtered Users:', filteredUsers);

    // Include related records
    const userWithPosts = await prisma.user.findUnique({
      where: { id: 1 },
      include: { posts: true },
    });
    console.log('User with Posts:', userWithPosts);

    // Aggregations
    const userStats = await prisma.user.aggregate({
      _count: { _all: true },
      _avg: { age: true },
      _sum: { age: true },
    });
    console.log('User Stats:', userStats);

    // ==========================================
    // TRANSACTIONS
    // ==========================================
    const [createdUser, createdPost] = await prisma.$transaction([
      prisma.user.create({ data: { name: 'Bob' } }),
      prisma.post.create({ data: { title: 'Bob Post', userId: 2 } }),
    ]);
    console.log('Transaction Results:', { createdUser, createdPost });

    // ==========================================
    // RAW SQL
    // ==========================================
    // Execute raw SQL
    const updatedRowCount = await prisma.$executeRaw`UPDATE User SET active = true WHERE id = ${2}`;
    console.log('Updated Rows:', updatedRowCount);

    // Query raw data
    const rawUsers = await prisma.$queryRaw`SELECT * FROM User WHERE active = true`;
    console.log('Raw Users:', rawUsers);

    // ==========================================
    // MIDDLEWARE
    // ==========================================
    prisma.$use(async (params, next) => {
      console.log(`Middleware: ${params.model}.${params.action}`);
      return next(params);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
})();
