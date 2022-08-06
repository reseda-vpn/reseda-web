import prisma from "@root/lib/prisma";

async function handler(req, res) {
    if (req.method !== 'POST') return;

    const { email, password } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    console.log(req.body);

    if (
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
        message:
            'Invalid input - password should also be at least 7 characters long.',
        });
        return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    await prisma.user.delete({
        where: {
            id: existingUser.id
        }
    });

    res.status(201).json({ message: 'User Deleted Successfully' });
}

export default handler;