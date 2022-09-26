import { verifyPassword } from "@root/lib/crpyt";
import prisma from "@root/lib/prisma";
import NextCors from 'nextjs-cors';

async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });
     
    if (req.method !== 'POST') res.status(404).json({ message: "Invalid Method, expected POST" });

    if(!req.body) {
        res.status(422).json({
            message: "Body field is empty"
        })
    }

    const { email, password } = (typeof req.body == "string") 
        ?
        JSON.parse(req.body)
        :
        req.body;

    if (
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
        message:
            'Password should also be at least 7 characters long.',
        });
        return;
    }

    const existingUser = await prisma.user.findUnique({ 
        where: { 
            email
        } 
    });

    if(!existingUser) {
        res.status(404).json({
            message: "User does not exist."
        })
        return;
    }

    // Hash password, and do same on signup end for identical comparison.
    const truePass = await verifyPassword(password, existingUser.password);

    if(!truePass) {
        res.status(422).json({
            message:
                'Invalid username or password.',
            }
        );
    }else {
        res.status(201).json({ ...existingUser, password: null });
    }
}

export default handler;