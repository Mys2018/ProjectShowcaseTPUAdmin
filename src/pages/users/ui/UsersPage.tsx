import styles from "./UsersPage.module.css"
import {QuickActionsUsers} from "@/widgets/quick-actions";
import {UsersList} from "@/widgets/users-list";

export const UsersPage = () => {
  return (
      <main className={styles.mainContainer}>
        <h2 className={styles.usersTitle}>Пользователи</h2>
        <div className={styles.content}>
          <UsersList />
          <aside className={styles.quickSide}>
            <QuickActionsUsers />
          </aside>
        </div>
      </main>
  )
}
