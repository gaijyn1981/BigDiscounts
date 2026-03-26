import { getServerSession } from 'next-auth'
import Navbar from './Navbar'

export default async function NavbarWrapper() {
  const session = await getServerSession()
  return (
    <Navbar
      session={!!session?.user}
      userName={session?.user?.name?.split(' ')[0]}
    />
  )
}
