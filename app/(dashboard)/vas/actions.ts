'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createVA(formData: FormData) {
  const email = formData.get('email') as string
  const nameVal = (formData.get('name') as string) || null
  const firstName = nameVal?.split(' ')[0] || null
  const lastName = nameVal?.split(' ').slice(1).join(' ') || null
  const hourlyRate = formData.get('hourlyRate') as string
  const notes = (formData.get('notes') as string) || null
  const skillIds = formData.getAll('skillIds') as string[]

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      systemRole: 'VA',
      userType: 'VIRTUAL_ASSISTANT',
      vaProfile: {
        create: {
          hourlyRate: hourlyRate ? Number(hourlyRate) : null,
          notes,
          vaSkills: { connect: skillIds.map((id) => ({ id })) },
        },
      },
    },
    include: { vaProfile: true },
  })

  revalidatePath('/vas')
  redirect(`/vas/${user.vaProfile!.id}`)
}