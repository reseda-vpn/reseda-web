import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import nodemailer from "nodemailer"
import prisma from '@root/lib/prisma';
import { verifyPassword } from "@root/lib/crpyt";

export default NextAuth({
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	secret: process.env.SECRET,
	providers: [
		GithubProvider({
		clientId: process.env.GITHUB_ID,
		clientSecret: process.env.GITHUB_SECRET,
		}),
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "email", type: "email", placeholder: "jonnydoe@test.com" },
				password: { label: "password", type: "password" }
			},
			async authorize(credentials) {
				const possibleUser = await prisma.user.findUnique({
					where: {
						email: credentials.username
					},
					select: {
						password: true
					}
				});

				if(!possibleUser) 
					throw Error("No user exists with this email!");

				const isValid = await verifyPassword(credentials.password, possibleUser.password);

				if(!isValid) 
					throw Error("Wrong password for account!");

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.username
					}
				});

				return user;
			}
		}),
		// EmailProvider({
		//   server: process.env.EMAIL_SERVER,
		//   from: process.env.EMAIL_FROM,
		//   sendVerificationRequest({
		//     identifier,
		//     url,
		//     provider: { server, from },
		//   }) {
		//     sendVerif({ 
		//       identifier, 
		//       url, 
		//       provider: { 
		//         server, 
		//         from 
		//       } 
		//     })
		//   },
		// }),
  	],
  	pages: {
    	signIn: '/login',
  	},
  	callbacks: {
		jwt: ({ token, user }) => {
			if(user) token.id = user.id;
			return token;
		},
		session: ({ session, token }) => {
			if(token) session.id = token.id;
			return session;
		}
  	}
});

const sendVerif = async ({
  identifier: email,
  url,
  provider: { server, from },
}) => {
  const { host } = new URL(url)
  const transport = nodemailer.createTransport(server)
  await transport.sendMail({
    to: email,
    from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, email }),
  })
}

// Email HTML body
function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`

  // Some simple styling options
  const backgroundColor = "#f9f9f9"
  const textColor = "#444444"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#346df1"
  const buttonBorderColor = "#346df1"
  const buttonTextColor = "#ffffff"

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
  return `Sign in to ${host}\n${url}\n\n`
}