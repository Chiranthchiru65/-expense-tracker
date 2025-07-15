export interface Settings {
  monthlyIncome: number;
  monthlyBudget: number;
}

const SETTINGS_KEY = "expense_tracker_settings";

const defaultSettings: Settings = {
  monthlyIncome: 50000,
  monthlyBudget: 15000,
};

export const getSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error("Error reading settings from localStorage:", error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    window.dispatchEvent(
      new CustomEvent("settingsChanged", {
        detail: settings,
      })
    );
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};
