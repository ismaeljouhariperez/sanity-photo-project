import type { AnimationState } from '@/store/animationStore'

export interface IAnimationService {
  setPageTransition(isLeaving: boolean): void
}

export class ZustandAnimationAdapter implements IAnimationService {
  constructor(private animationStore: AnimationState) {}

  setPageTransition(isLeaving: boolean): void {
    this.animationStore.setLeavingPage(isLeaving)
  }
}
