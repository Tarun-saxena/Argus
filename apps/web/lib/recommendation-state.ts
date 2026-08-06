import { api } from "@/lib/api";

export type RecommendationStatus = "idle" | "saving" | "recalculating" | "success";

type StatusListener = (status: RecommendationStatus) => void;
type InvalidationListener = () => void;

class RecommendationStateStore {
  private status: RecommendationStatus = "idle";
  private statusListeners = new Set<StatusListener>();
  private invalidationListeners = new Set<InvalidationListener>();

  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private safetyTimer: ReturnType<typeof setTimeout> | null = null;
  private successTimer: ReturnType<typeof setTimeout> | null = null;

  getStatus(): RecommendationStatus {
    return this.status;
  }

  setStatus(newStatus: RecommendationStatus) {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.statusListeners.forEach((listener) => {
      try {
        listener(newStatus);
      } catch (err) {
        console.error("Error in recommendation status listener:", err);
      }
    });
  }

  subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    // Emit initial status to new subscriber
    try {
      listener(this.status);
    } catch (err) {
      console.error("Error in initial recommendation status listener call:", err);
    }
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  subscribeInvalidation(listener: InvalidationListener): () => void {
    this.invalidationListeners.add(listener);
    return () => {
      this.invalidationListeners.delete(listener);
    };
  }

  notifyInvalidation() {
    this.invalidationListeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Error in recommendation invalidation listener:", err);
      }
    });
  }

  clearTimers() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }
    if (this.successTimer) {
      clearTimeout(this.successTimer);
      this.successTimer = null;
    }
  }

  startRematchTracking(saveTime: Date) {
    this.clearTimers();
    this.setStatus("recalculating");

    let finished = false;

    const finish = (isSuccess: boolean) => {
      if (finished) return;
      finished = true;
      this.clearTimers();

      // Trigger final invalidation to refresh UI
      this.notifyInvalidation();

      if (isSuccess) {
        this.setStatus("success");
        this.successTimer = setTimeout(() => {
          this.setStatus("idle");
        }, 3000);
      } else {
        this.setStatus("idle");
      }
    };

    // Poll every 1.5s for completed batches and final status
    this.pollTimer = setInterval(async () => {
      try {
        // Trigger invalidation on each tick so Explore/Feed re-fetch completed batches
        this.notifyInvalidation();

        const me = await api.getMe();
        if (me.lastMatchedAt && new Date(me.lastMatchedAt).getTime() >= saveTime.getTime()) {
          finish(true);
        }
      } catch {
        // Retry on next interval tick
      }
    }, 1500);

    // Safety timeout after 30s
    this.safetyTimer = setTimeout(() => {
      finish(false);
    }, 30000);
  }
}

export const recommendationState = new RecommendationStateStore();
