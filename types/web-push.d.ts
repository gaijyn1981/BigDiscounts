declare module 'web-push' {
  interface PushSubscription {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }
  interface SendResult {
    statusCode: number
    headers: Record<string, string>
    body: string
  }
  function setVapidDetails(subject: string, publicKey: string, privateKey: string): void
  function sendNotification(sub: PushSubscription, payload?: string | Buffer, opts?: object): Promise<SendResult>
  function generateVAPIDKeys(): { publicKey: string; privateKey: string }
  export = { setVapidDetails, sendNotification, generateVAPIDKeys }
}
