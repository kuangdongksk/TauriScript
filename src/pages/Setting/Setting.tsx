import { useEffect, useState } from 'react';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import styles from './Setting.module.css';

const Setting = () => {
  const [autoStart, setAutoStart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初始化时检查自启动状态
    const checkAutoStart = async () => {
      try {
        const enabled = await isEnabled();
        setAutoStart(enabled);
      } catch (error) {
        console.error('检查自启动状态失败:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAutoStart();
  }, []);

  const handleAutoStartChange = async (checked: boolean) => {
    try {
      if (checked) {
        await enable();
      } else {
        await disable();
      }
      setAutoStart(checked);
    } catch (error) {
      console.error('设置自启动状态失败:', error);
      // 如果设置失败，恢复之前的状态
      setAutoStart(!checked);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className={styles.settingContainer}>
      <h1>设置</h1>
      <div className={styles.settingItem}>
        <label>
          <input
            type="checkbox"
            checked={autoStart}
            onChange={(e) => handleAutoStartChange(e.target.checked)}
          />
          开机自动启动
        </label>
      </div>
    </div>
  );
};

export default Setting;