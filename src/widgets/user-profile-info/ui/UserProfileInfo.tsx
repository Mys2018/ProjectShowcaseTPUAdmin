import type { ComponentPropsWithoutRef } from 'react'
import { UserInfo, UserInfoSkeleton, useUserById, useUserScores, type UserRole } from '@/entities/user'

interface UserProfileInfoProps extends ComponentPropsWithoutRef<'div'> {
  userId: string
}

export function UserProfileInfo({ userId, ...props }: UserProfileInfoProps) {
  const { data: user, isLoading, isError } = useUserById(userId)
  const scores = useUserScores(userId)

  if (isLoading) return <UserInfoSkeleton />
  if (isError || !user) return <h2>Ошибка</h2>

  const studentRole = user.roles.find(
    (r): r is Extract<UserRole, { type: 'Student' }> => r.type === 'Student'
  )

  return (
    <UserInfo
      email={user.email}
      bio={user.meta.bio}
      interests={user.meta.interests}
      competencies={user.meta.competencies}
      messengers={user.meta.messengers}
      portfolioLink={user.meta.portfolioLink}
      experience={user.meta.experience}
      studentInfo={
        studentRole
          ? {
              course: studentRole.course,
              school: studentRole.school,
              group: studentRole.meta?.group
            }
          : null
      }
      totalScore={scores.data?.totalScore ?? null}
      {...props}
    />
  )
}
