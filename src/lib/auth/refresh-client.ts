export type RefreshResult = { success: boolean };
export type RefreshAction = () => Promise<RefreshResult>;

let activeRefresh: Promise<RefreshResult> | undefined;

const runWithBrowserLock = async (action: RefreshAction): Promise<RefreshResult> => {
  if (typeof navigator !== "undefined" && navigator.locks) {
    return navigator.locks.request("doctor-tracker-session-refresh", { mode: "exclusive" }, action);
  }
  return action();
};

export function requestCoordinatedRefresh(action: RefreshAction): Promise<RefreshResult> {
  if (activeRefresh) return activeRefresh;
  activeRefresh = runWithBrowserLock(action).finally(() => {
    activeRefresh = undefined;
  });
  return activeRefresh;
}
