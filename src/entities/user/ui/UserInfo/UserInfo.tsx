import type { ComponentPropsWithoutRef } from 'react'
import styles from './UserInfo.module.css'
import type { UserCompetency, UserMessengers } from '../../model/types'

interface UserInfoProps extends ComponentPropsWithoutRef<'div'> {
  email: string
  bio?: string
  interests?: string
  competencies?: UserCompetency[]
  messengers?: UserMessengers
  portfolioLink?: string
  experience?: string
  studentInfo?: { course?: string; school?: string; group?: string } | null
  totalScore?: number | null
}

function formatMessenger(label: string, value?: string) {
  if (!value) return null
  const href =
    label === 'Telegram'
      ? value.startsWith('http')
        ? value
        : `https://t.me/${value.replace(/^@/, '')}`
      : label === 'VK'
        ? value.startsWith('http')
          ? value
          : `https://vk.com/${value.replace(/^@/, '')}`
        : value.startsWith('http')
          ? value
          : undefined

  return (
    <li key={label} className={styles.contactItem}>
      <span className={styles.contactLabel}>{label}</span>
      {href ? (
        <a className={styles.link} href={href} target='_blank' rel='noreferrer'>
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </li>
  )
}

export function UserInfo({
  email,
  bio,
  interests,
  competencies,
  messengers,
  portfolioLink,
  experience,
  studentInfo,
  totalScore,
  className,
  ...props
}: UserInfoProps) {
  const hasMessengers =
    Boolean(messengers?.telegram) || Boolean(messengers?.vk) || Boolean(messengers?.element)

  return (
    <div className={`${styles.container} ${className ?? ''}`} {...props}>
      <section className={styles.block}>
        <p className={styles.title}>Контакты</p>
        <dl className={styles.kv}>
          <div>
            <dt>Почта</dt>
            <dd>
              <a className={styles.link} href={`mailto:${email}`}>
                {email}
              </a>
            </dd>
          </div>
          {hasMessengers ? (
            <div>
              <dt>Мессенджеры</dt>
              <dd>
                <ul className={styles.contactList}>
                  {formatMessenger('Telegram', messengers?.telegram)}
                  {formatMessenger('VK', messengers?.vk)}
                  {formatMessenger('Element', messengers?.element)}
                </ul>
              </dd>
            </div>
          ) : null}
          {portfolioLink ? (
            <div>
              <dt>Портфолио</dt>
              <dd>
                <a className={styles.link} href={portfolioLink} target='_blank' rel='noreferrer'>
                  {portfolioLink}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className={styles.block}>
        <p className={styles.title}>О себе</p>
        <p className={styles.text}>{bio?.trim() ? bio : 'Не указано'}</p>
      </section>

      <section className={styles.block}>
        <p className={styles.title}>Интересы</p>
        <p className={styles.text}>{interests?.trim() ? interests : 'Не указано'}</p>
      </section>

      <section className={styles.block}>
        <p className={styles.title}>Компетенции и скиллы</p>
        {competencies && competencies.length > 0 ? (
          <ul className={styles.competencyList}>
            {competencies.map(c => (
              <li key={c.id || c.name} className={styles.competency}>
                <span className={styles.competencyName}>{c.name}</span>
                {c.skills.length > 0 ? (
                  <div className={styles.skillList}>
                    {c.skills.map(s => (
                      <span key={s.id || s.name} className={styles.skill}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.muted}>Скиллы не указаны</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.text}>Не указано</p>
        )}
      </section>

      {experience ? (
        <section className={styles.block}>
          <p className={styles.title}>Опыт</p>
          <p className={styles.text}>{experience}</p>
        </section>
      ) : null}

      {studentInfo ? (
        <section className={styles.block}>
          <p className={styles.title}>Студент</p>
          <dl className={styles.kv}>
            {studentInfo.course ? (
              <div>
                <dt>Курс</dt>
                <dd>{studentInfo.course}</dd>
              </div>
            ) : null}
            {studentInfo.school ? (
              <div>
                <dt>Школа</dt>
                <dd>{studentInfo.school}</dd>
              </div>
            ) : null}
            {studentInfo.group ? (
              <div>
                <dt>Группа</dt>
                <dd>{studentInfo.group}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {typeof totalScore === 'number' ? (
        <section className={styles.block}>
          <p className={styles.title}>Баллы</p>
          <p className={styles.score}>{totalScore}</p>
        </section>
      ) : null}
    </div>
  )
}
