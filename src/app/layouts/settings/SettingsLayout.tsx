import { Outlet } from "react-router-dom";
import styles from './SettingsLayout.module.css'
import { SettingsTabs } from "@/widgets/settings-tabs";

export function SettingsLayout() {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Настройки</h1>
				<SettingsTabs/>
			</div>
			<Outlet/>
		</div>
	)
}