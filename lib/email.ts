import { Resend } from 'resend'

const getResend = () => new Resend(process.env.RESEND_API_KEY!)

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`

  await getResend().emails.send({
    from: 'BigDiscounts <hello@bigdiscounts.uk>',
    to: email,
    subject: 'Verify your BigDiscounts account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
        <h1 style="color: #f59e0b; font-size: 28px; margin-bottom: 8px;">🇬🇧 BigDiscounts</h1>
        <h2 style="color: white; margin-bottom: 16px;">Welcome, ${name}!</h2>
        <p style="color: #9ca3af; margin-bottom: 24px;">Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}" style="background: #f59e0b; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
          Verify Email Address
        </a>
        <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `
  })
}

export async function sendContactNotification(
  sellerEmail: string,
  sellerName: string,
  productTitle: string,
  buyerEmail: string,
  buyerName: string,
  message: string
) {
  await getResend().emails.send({
    from: 'BigDiscounts <hello@bigdiscounts.uk>',
    to: sellerEmail,
    subject: `New enquiry for: ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
        <h1 style="color: #fcd968; font-size: 28px; margin-bottom: 8px;">🇬🇧 BigDiscounts</h1>
        <h2 style="color: white; margin-bottom: 8px;">New Buyer Enquiry</h2>
        <p style="color: #9ca3af; margin-bottom: 24px;">Someone is interested in your listing on BigDiscounts.</p>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #fcd968; font-weight: bold; margin: 0 0 8px;">📦 Product</p>
          <p style="color: white; margin: 0 0 16px;">${productTitle}</p>
          <p style="color: #fcd968; font-weight: bold; margin: 0 0 8px;">👤 From</p>
          <p style="color: white; margin: 0 0 4px;">${buyerName}</p>
          <p style="color: #9ca3af; margin: 0 0 16px;">${buyerEmail}</p>
          <p style="color: #fcd968; font-weight: bold; margin: 0 0 8px;">💬 Message</p>
          <p style="color: white; margin: 0;">${message}</p>
        </div>
        <a href="mailto:${buyerEmail}" style="background: #fcd968; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
          Reply to Buyer
        </a>
        <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">You received this because a buyer contacted you on <a href="https://www.bigdiscounts.uk" style="color: #fcd968;">BigDiscounts.uk</a></p>
      </div>
    `
  })
}
