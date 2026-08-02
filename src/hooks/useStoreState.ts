import { useEffect, useState } from 'react';
import { store } from '../lib/store';

export function useStoreState<T>(getter: () => T): T {
  const [state, setState] = useState(getter);

  useEffect(() => {
    const update = () => setState(getter);
    const unsubscribe = store.subscribe(update);
    return unsubscribe;
  }, [getter]);

  return state;
}
