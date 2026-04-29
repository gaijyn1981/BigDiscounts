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

export async function sendAvasamWelcomeEmail(email: string, name: string, company: string, trialEndsAt: Date) {
  const trialEndStr = trialEndsAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  await getResend().emails.send({
    from: 'BigDiscounts <hello@bigdiscounts.uk>',
    to: email,
    subject: 'Welcome to BigDiscounts — Your 30-day free trial has started',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
        <h1 style="color: #f59e0b; font-size: 28px; margin-bottom: 8px;">🇬🇧 BigDiscounts</h1>
        <h2 style="color: white; margin-bottom: 16px;">Welcome to BigDiscounts, ${name}!</h2>
        <p style="color: #9ca3af; margin-bottom: 16px;">Your seller account for <strong style="color: white;">${company}</strong> is now live on <a href="https://www.bigdiscounts.uk" style="color: #f59e0b;">www.bigdiscounts.uk</a>.</p>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #f59e0b; font-weight: bold; margin: 0 0 8px;">🎁 Your free trial</p>
          <p style="color: white; margin: 0;">Your 30-day free trial runs until <strong>${trialEndStr}</strong>. Your products are live and visible to buyers right now — no action needed.</p>
        </div>
        <p style="color: #9ca3af; margin-bottom: 16px;">After your trial ends, keep selling for just <strong style="color: white;">£1/month</strong> per product listing.</p>
        <a href="https://www.bigdiscounts.uk/seller/dashboard" style="background: #f59e0b; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
          View Your Dashboard
        </a>
        <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">Questions? Just reply to this email — we're happy to help.</p>
        <p style="color: #6b7280; font-size: 14px;">— The BigDiscounts Team | <a href="https://www.bigdiscounts.uk" style="color: #f59e0b;">www.bigdiscounts.uk</a></p>
      </div>
    `
  })
}

export async function sendAvasamTrialDay25Email(email: string, name: string, company: string, trialEndsAt: Date) {
  const trialEndStr = trialEndsAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  await getResend().emails.send({
    from: 'BigDiscounts <hello@bigdiscounts.uk>',
    to: email,
    subject: 'Your BigDiscounts trial ends in 5 days — subscribe to keep selling',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
        <h1 style="color: #f59e0b; font-size: 28px; margin-bottom: 8px;">🇬🇧 BigDiscounts</h1>
        <h2 style="color: white; margin-bottom: 16px;">Your free trial ends in 5 days</h2>
        <p style="color: #9ca3af; margin-bottom: 16px;">Hi ${name}, your 30-day free trial for <strong style="color: white;">${company}</strong> on <a href="https://www.bigdiscounts.uk" style="color: #f59e0b;">BigDiscounts</a> ends on <strong style="color: white;">${trialEndStr}</strong>.</p>
        <div style="background: #1a1a1a; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #f59e0b; font-weight: bold; margin: 0 0 8px;">⚠️ What happens after your trial</p>
          <p style="color: white; margin: 0;">If you don't subscribe, your product listings will be hidden from buyers. Subscribe for just <strong>£1/month per listing</strong> to keep them live.</p>
        </div>
        <a href="https://www.bigdiscounts.uk/seller/dashboard" style="background: #f59e0b; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
          Subscribe Now — £1/month
        </a>
        <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">Questions? Reply to this email — we're here to help.</p>
        <p style="color: #6b7280; font-size: 14px;">— The BigDiscounts Team | <a href="https://www.bigdiscounts.uk" style="color: #f59e0b;">www.bigdiscounts.uk</a></p>
      </div>
    `
  })
}

export async function sendAvasamTrialDay30Email(email: string, name: string, company: string) {
  await getResend().emails.send({
    from: 'BigDiscounts <hello@bigdiscounts.uk>',
    to: email,
    subject: 'Your BigDiscounts listings have been paused — reactivate any time',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
        <h1 style="color: #f59e0b; font-size: 28px; margin-bottom: 8px;">🇬🇧 BigDiscounts</h1>
        <h2 style="color: white; margin-bottom: 16px;">Your listings have been paused</h2>
        <p style="color: #9ca3af; margin-bottom: 16px;">Hi ${name}, your 30-day free trial for <strong style="color: white;">${company}</strong> has ended. Your listings have been hidden from buyers.</p>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #f59e0b; font-weight: bold; margin: 0 0 8px;">✅ Reactivate in seconds</p>
          <p style="color: white; margin: 0;">Subscribe for <strong>£1/month per listing</strong> from your dashboard and your products will go live immediately.</p>
        </div>
        <a href="https://www.bigdiscounts.uk/seller/dashboard" style="background: #f59e0b; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
          Reactivate My Listings
        </a>
        <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">— The BigDiscounts Team | <a href="https://www.bigdiscounts.uk" style="color: #f59e0b;">www.bigdiscounts.uk</a></p>
      </div>
    `
  })
}
